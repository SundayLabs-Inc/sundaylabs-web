#!/usr/bin/env node
// Usage: node scripts/create-invite.mjs [days-valid=30] [waitlist-entry-uuid]
// Prints a new invitation code (send it to the invitee) and the SQL to run in
// the Supabase SQL editor. Only the sha256 hash is stored in the database.
import { createHash, randomBytes } from "node:crypto";

const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const days = Number(process.argv[2] ?? 30);
const entryId = process.argv[3];

const bytes = randomBytes(12);
const code = Array.from(bytes, (b) => ALPHABET[b % ALPHABET.length]).join("");
const display = code.match(/.{1,4}/g).join("-");
const hash = createHash("sha256").update(code).digest("hex");

if (entryId && !/^[0-9a-f-]{36}$/i.test(entryId)) {
  console.error("waitlist-entry-uuid must be a UUID");
  process.exit(1);
}

console.log(`Invite code: ${display}\n`);
console.log(
  `insert into public.invitations (code_hash, waitlist_entry_id, expires_at)\nvalues ('${hash}', ${
    entryId ? `'${entryId}'` : "null"
  }, now() + interval '${days} days');`,
);
