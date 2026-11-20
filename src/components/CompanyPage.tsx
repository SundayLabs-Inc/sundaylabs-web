import SubPageLayout from "@/components/SubPageLayout";
import { getSite, type Locale } from "@/constants/site";

export default function CompanyPage({ locale }: { locale: Locale }) {
  const site = getSite(locale);

  return (
    <SubPageLayout
      locale={locale}
      title={site.company.title}
      headingId="company-heading"
      centered
    >
      <dl className="mt-12">
        {site.company.rows.map((row) => (
          <div
            key={row.label}
            className="grid gap-2 border-t border-[var(--nav-border)] py-6 sm:grid-cols-[200px_1fr] sm:gap-6"
          >
            <dt className="label-1 text-muted">{row.label}</dt>
            <dd className="whitespace-pre-line leading-relaxed">{row.value}</dd>
          </div>
        ))}
      </dl>
    </SubPageLayout>
  );
}
