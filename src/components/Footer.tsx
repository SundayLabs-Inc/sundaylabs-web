import { getSite, type Locale } from "@/constants/site";
import InteractiveFooterCanvas from "@/components/InteractiveFooterCanvas";

export default function Footer({ locale }: { locale: Locale }) {
  const site = getSite(locale);
  const prefix = locale === "en" ? "/en" : "";
  const home = locale === "en" ? "/en" : "/";

  const links = [
    { label: site.nav.services, href: `${home}#services` },
    { label: site.footer.company, href: `${prefix}/company` },
    { label: site.nav.faqs, href: `${home}#faqs` },
    { label: site.footer.contact, href: `${prefix}/contact` },
    { label: site.footer.privacy, href: `${prefix}/privacy` },
  ];

  return (
    <footer className="site-footer-shell">
      <div className="site-footer">
        <InteractiveFooterCanvas />

        <div className="site-footer-main">
          <a href={home} className="site-footer-brand" aria-label="Home">
            <img src="/images/logo-mark.png" alt="" />
            <span>{site.nameEn}</span>
          </a>
          <nav className="site-footer-nav" aria-label="Footer">
            {links.map((link) => (
              <a key={link.href} href={link.href} className="site-footer-link">
                <span className="site-footer-link-dot" aria-hidden="true" />
                <span>{link.label}</span>
              </a>
            ))}
          </nav>
        </div>
        <p className="site-footer-copy">{site.copyright}</p>
      </div>
    </footer>
  );
}
