-- Ashitano Robotics: waitlist, rate limiting, invitation-only booking.
-- Every table has RLS enabled with no policies, and privileges are revoked
-- from anon/authenticated. Only the server (service_role) can read or write.

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- Waitlist
-- ---------------------------------------------------------------------------

create type public.waitlist_status as enum ('waiting', 'invited', 'contacted', 'withdrawn');

create table public.waitlist_entries (
  id uuid primary key default gen_random_uuid(),
  email text not null unique
    check (email = lower(email) and char_length(email) between 3 and 254),
  prefecture text not null check (char_length(prefecture) between 2 and 4),
  city text not null check (char_length(city) between 1 and 50),
  interested_tasks text[] not null default '{}'
    check (interested_tasks <@ array['tidying', 'cleaning', 'dishes', 'other']::text[]),
  marketing_opt_in boolean not null default false,
  marketing_opt_in_at timestamptz,
  privacy_policy_version text not null,
  privacy_acknowledged_at timestamptz not null,
  status public.waitlist_status not null default 'waiting',
  confirmation_email_status text not null default 'pending'
    check (confirmation_email_status in ('pending', 'sent', 'failed', 'not_configured')),
  confirmation_email_id text,
  confirmation_email_error text,
  confirmation_email_attempted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index waitlist_entries_status_idx on public.waitlist_entries (status);
create index waitlist_entries_prefecture_idx on public.waitlist_entries (prefecture);

create trigger waitlist_entries_updated_at
  before update on public.waitlist_entries
  for each row execute function public.set_updated_at();

alter table public.waitlist_entries enable row level security;
revoke all on table public.waitlist_entries from anon, authenticated;

-- Admin check: entries whose confirmation email was not delivered.
create view public.waitlist_email_failures
with (security_invoker = true) as
  select id, created_at, confirmation_email_status, confirmation_email_error,
         confirmation_email_attempted_at
  from public.waitlist_entries
  where confirmation_email_status in ('pending', 'failed', 'not_configured');

revoke all on table public.waitlist_email_failures from anon, authenticated;

-- ---------------------------------------------------------------------------
-- Rate limiting (keys are HMAC hashes, never raw IPs or emails)
-- ---------------------------------------------------------------------------

create table public.request_rate_limits (
  key text primary key,
  window_started_at timestamptz not null,
  hits integer not null
);

alter table public.request_rate_limits enable row level security;
revoke all on table public.request_rate_limits from anon, authenticated;

create or replace function public.consume_rate_limit(
  p_key text,
  p_limit integer,
  p_window_seconds integer
)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_hits integer;
  v_expired timestamptz := now() - make_interval(secs => p_window_seconds);
begin
  insert into public.request_rate_limits as r (key, window_started_at, hits)
  values (p_key, now(), 1)
  on conflict (key) do update set
    hits = case when r.window_started_at < v_expired then 1 else r.hits + 1 end,
    window_started_at = case when r.window_started_at < v_expired then now() else r.window_started_at end
  returning hits into v_hits;

  return v_hits <= p_limit;
end;
$$;

revoke execute on function public.consume_rate_limit(text, integer, integer) from public, anon, authenticated;
grant execute on function public.consume_rate_limit(text, integer, integer) to service_role;

-- ---------------------------------------------------------------------------
-- Invitation-only booking (disabled in the app until BOOKING_ENABLED=true)
-- ---------------------------------------------------------------------------

create table public.invitations (
  id uuid primary key default gen_random_uuid(),
  -- sha256 hex of the normalized (upper-case, no spaces/hyphens) code
  code_hash text not null unique check (char_length(code_hash) = 64),
  waitlist_entry_id uuid references public.waitlist_entries (id) on delete set null,
  max_uses integer not null default 1 check (max_uses > 0),
  used_count integer not null default 0 check (used_count >= 0),
  expires_at timestamptz,
  revoked_at timestamptz,
  note text,
  created_at timestamptz not null default now()
);

alter table public.invitations enable row level security;
revoke all on table public.invitations from anon, authenticated;

create type public.booking_status as enum ('requested', 'confirmed', 'completed', 'cancelled');

create table public.bookings (
  id uuid primary key default gen_random_uuid(),
  invitation_id uuid not null references public.invitations (id),
  full_name text not null check (char_length(full_name) between 1 and 100),
  email text not null check (email = lower(email) and char_length(email) <= 254),
  phone text not null check (char_length(phone) between 10 and 15),
  postal_code text not null check (postal_code ~ '^[0-9]{7}$'),
  prefecture text not null,
  address text not null check (char_length(address) between 1 and 200),
  housing_type text not null check (housing_type in ('detached', 'apartment', 'other')),
  requested_tasks text[] not null default '{}'
    check (requested_tasks <@ array['tidying', 'cleaning', 'dishes', 'other']::text[]),
  excluded_areas text not null default '' check (char_length(excluded_areas) <= 1000),
  preferred_slots timestamptz[] not null check (cardinality(preferred_slots) between 1 and 3),
  notes text not null default '' check (char_length(notes) <= 2000),
  status public.booking_status not null default 'requested',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger bookings_updated_at
  before update on public.bookings
  for each row execute function public.set_updated_at();

alter table public.bookings enable row level security;
revoke all on table public.bookings from anon, authenticated;

create type public.consent_type as enum ('service_terms', 'recording_ai_training');

create table public.consent_records (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references public.bookings (id) on delete cascade,
  consent_type public.consent_type not null,
  document_path text not null,
  document_version text not null,
  granted boolean not null,
  granted_at timestamptz not null,
  withdrawn_at timestamptz,
  created_at timestamptz not null default now(),
  unique (booking_id, consent_type)
);

alter table public.consent_records enable row level security;
revoke all on table public.consent_records from anon, authenticated;

create or replace function public.invitation_is_valid(p_code_hash text)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.invitations
    where code_hash = p_code_hash
      and revoked_at is null
      and (expires_at is null or expires_at > now())
      and used_count < max_uses
  );
$$;

-- Validates the invitation, creates the booking and both consent records,
-- and consumes one use of the invitation in a single transaction.
create or replace function public.create_booking_with_invitation(
  p_code_hash text,
  p_booking jsonb,
  p_consents jsonb
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_invitation_id uuid;
  v_booking_id uuid;
  v_consent jsonb;
begin
  select id into v_invitation_id
  from public.invitations
  where code_hash = p_code_hash
    and revoked_at is null
    and (expires_at is null or expires_at > now())
    and used_count < max_uses
  for update;

  if v_invitation_id is null then
    raise exception 'invalid_invitation' using errcode = 'P0001';
  end if;

  insert into public.bookings (
    invitation_id, full_name, email, phone, postal_code, prefecture, address,
    housing_type, requested_tasks, excluded_areas, preferred_slots, notes
  ) values (
    v_invitation_id,
    p_booking->>'full_name',
    p_booking->>'email',
    p_booking->>'phone',
    p_booking->>'postal_code',
    p_booking->>'prefecture',
    p_booking->>'address',
    p_booking->>'housing_type',
    array(select jsonb_array_elements_text(p_booking->'requested_tasks')),
    coalesce(p_booking->>'excluded_areas', ''),
    array(select (jsonb_array_elements_text(p_booking->'preferred_slots'))::timestamptz),
    coalesce(p_booking->>'notes', '')
  )
  returning id into v_booking_id;

  for v_consent in select * from jsonb_array_elements(p_consents) loop
    insert into public.consent_records (
      booking_id, consent_type, document_path, document_version, granted, granted_at
    ) values (
      v_booking_id,
      (v_consent->>'consent_type')::public.consent_type,
      v_consent->>'document_path',
      v_consent->>'document_version',
      (v_consent->>'granted')::boolean,
      now()
    );
  end loop;

  update public.invitations set used_count = used_count + 1 where id = v_invitation_id;

  return v_booking_id;
end;
$$;

revoke execute on function public.invitation_is_valid(text) from public, anon, authenticated;
revoke execute on function public.create_booking_with_invitation(text, jsonb, jsonb) from public, anon, authenticated;
grant execute on function public.invitation_is_valid(text) to service_role;
grant execute on function public.create_booking_with_invitation(text, jsonb, jsonb) to service_role;
