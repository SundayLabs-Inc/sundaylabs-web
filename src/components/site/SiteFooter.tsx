import Link from "next/link";
import { launch } from "@/config/launch";
import { legalDocuments } from "@/config/legal";
import Wordmark from "@/components/site/Wordmark";
import { brand, nav, contactCta } from "@/content/home";

const linkClass = "text-[15px] leading-[1.8] text-white transition-opacity hover:opacity-60";

export default function SiteFooter() {
  const legal = [
    legalDocuments.privacy,
    legalDocuments.terms,
    ...(launch.legalNoticePublished ? [legalDocuments.legalNotice] : []),
  ];
  const columns = [
    nav,
    [{ label: "会社概要", href: "/company" }, contactCta],
    legal.map((doc) => ({ label: doc.title, href: doc.path })),
  ];

  return (
    <footer className="brand-footer bg-[#111111] text-white">
      <div className="mx-auto w-full max-w-[1312px] border-t border-white/10 px-6 pt-16 pb-20 md:px-10 lg:pt-20 lg:pb-24">
        <div className="flex flex-col gap-14 lg:flex-row lg:gap-20">
          <div className="shrink-0 lg:w-[280px]">
            <Link href="/" className="block text-white">
              <Wordmark name={brand.name} symbolOnly className="block h-8 w-auto" />
            </Link>
            <span className="mt-8 block text-xs leading-none">{brand.copyright}</span>
          </div>

          <nav aria-label="フッター" className="grid grid-cols-2 gap-x-8 gap-y-10 md:grid-cols-3 md:gap-x-12 lg:ml-auto lg:gap-x-14">
            {columns.map((column) => (
              <ul key={column[0].href} className="flex flex-col gap-3">
                {column.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className={linkClass}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
