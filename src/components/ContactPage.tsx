import SubPageLayout from "@/components/SubPageLayout";
import ContactCta from "@/components/ContactCta";
import { getSite, type Locale } from "@/constants/site";

export default function ContactPage({ locale }: { locale: Locale }) {
  const site = getSite(locale);

  return (
    <SubPageLayout
      locale={locale}
      title={site.contact.title}
      headingId="contact-heading"
      centered
    >
      <p className="text-center text-[15px] font-normal leading-[2] lg:text-base">{site.contact.body}</p>
      <ContactCta locale={locale} />
    </SubPageLayout>
  );
}
