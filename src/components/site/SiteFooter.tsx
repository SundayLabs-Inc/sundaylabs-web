import Link from "next/link";
import { launch } from "@/config/launch";
import { legalDocuments } from "@/config/legal";
import Wordmark from "@/components/site/Wordmark";
import { getSite } from "@/constants/site";
import { brand, footerNav, contactCta } from "@/content/home";

export default function SiteFooter() {
  const { company } = getSite("ja");
  const address = company.rows.find((row) => row.label === "所在地")?.value.replace(/\n/g, " ");
  const legal = [
    legalDocuments.privacy,
    legalDocuments.terms,
    ...(launch.legalNoticePublished ? [legalDocuments.legalNotice] : []),
  ];

  return (
    <footer className="site-content bg-[#e73b09] pt-14 pb-10 text-white lg:pt-20">
      <div>
        <nav aria-label="フッター">
          <ul className="grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-4 lg:grid-cols-5">
            {[...footerNav, contactCta].map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-sm font-bold transition-opacity hover:opacity-60">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mt-20 lg:mt-28">
          <Link href="/" className="block text-white">
            <Wordmark name={brand.name} className="h-auto w-full max-w-[920px]" />
          </Link>
          <p className="mt-6 text-sm leading-[1.8]">
            {brand.legalName}
            <br />
            {address}
          </p>
        </div>

        <div className="mt-10 flex flex-col-reverse gap-6 pt-8 lg:flex-row lg:items-center lg:justify-between">
          <p className="text-[11px]">{brand.copyright}</p>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {legal.map((doc) => (
              <li key={doc.path}>
                <Link href={doc.path} className="text-xs transition-opacity hover:opacity-60">
                  {doc.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
