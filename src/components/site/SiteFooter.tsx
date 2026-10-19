import Link from "next/link";
import InteractiveFooterCanvas from "@/components/InteractiveFooterCanvas";
import FooterMotion from "@/components/site/FooterMotion";
import { launch } from "@/config/launch";
import { legalDocuments } from "@/config/legal";
import { brand, nav, contactCta } from "@/content/home";
import "@/components/footer-motion.css";

export default function SiteFooter() {
  const links = [
    contactCta,
    ...nav.filter((link) => link.href === "/company"),
    { label: legalDocuments.privacy.title, href: legalDocuments.privacy.path },
    { label: legalDocuments.terms.title, href: legalDocuments.terms.path },
    ...(launch.legalNoticePublished
      ? [{ label: legalDocuments.legalNotice.title, href: legalDocuments.legalNotice.path }]
      : []),
  ];

  return (
    <footer className="site-footer-shell" data-header-dark="">
      <FooterMotion />
      <div className="site-footer">
        <InteractiveFooterCanvas />
        <div className="site-footer-main">
          <Link href="/" className="site-footer-brand site-footer-logo">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={brand.logo.src} width={brand.logo.width} height={brand.logo.height} alt={brand.name} />
          </Link>
          <nav className="site-footer-nav" aria-label="フッター">
            {links.map((link) => (
              <Link key={link.href} href={link.href} className="site-footer-link">
                <span className="site-footer-link-dot" aria-hidden="true" />
                <span>{link.label}</span>
              </Link>
            ))}
          </nav>
        </div>
        <p className="site-footer-copy">{brand.copyright}</p>
      </div>
    </footer>
  );
}
