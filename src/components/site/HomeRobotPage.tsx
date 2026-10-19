import { getImageProps } from "next/image";
import Link from "next/link";
import FaqList from "@/components/site/FaqList";
import MediaFrame from "@/components/site/MediaFrame";
import HeroFrame from "@/components/site/HeroFrame";
import PlaceRail from "@/components/site/PlaceRail";
import Section, { SectionHeading } from "@/components/site/Section";
import {
  closing,
  contactCta,
  faq,
  hero,
  industries,
  service,
  steps,
  technology,
} from "@/content/home";

const bodyText = "text-[15px] leading-[1.9] text-ink-muted lg:text-base";

const heroSizes = "100vw";
const {
  props: { srcSet: heroLandscape },
} = getImageProps({ ...hero.media.landscape, alt: "", sizes: heroSizes, priority: true });
const { props: heroImage } = getImageProps({
  ...hero.media.portrait,
  alt: "",
  sizes: heroSizes,
  priority: true,
});

export default function HomeRobotPage() {
  return (
    <>
      <section aria-labelledby="hero-heading">
        <HeroFrame className="relative h-[calc(100svh-4rem)] min-h-[560px] overflow-hidden bg-ink text-white">
          <picture>
            <source media="(min-aspect-ratio: 1/1)" srcSet={heroLandscape} sizes={heroSizes} />
            <img {...heroImage} alt={hero.media.alt} className="hero-media absolute inset-0 h-full w-full object-cover" />
          </picture>
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent"
          />
          <div className="absolute inset-x-0 bottom-0 px-8 pb-8 lg:px-12 lg:pb-12">
            <h1
              id="hero-heading"
              className="hero-rise text-[min(9.8vw,64px)] font-bold leading-[1.15] tracking-[-0.04em] lg:whitespace-nowrap lg:text-[min(5.6vw,104px)] lg:leading-[1.05]"
            >
              {hero.title}
            </h1>
            <div className="hero-rise hero-rise-2 mt-5 lg:mt-8">
              <Link
                href={contactCta.href}
                className="group inline-flex h-14 w-full items-center justify-between gap-4 rounded-full bg-white pr-2 pl-6 text-[15px] font-medium text-ink transition-colors hover:bg-white/90 sm:w-auto"
              >
                {contactCta.label}
                <span
                  aria-hidden="true"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-ink text-white transition-transform duration-200 group-hover:translate-x-0.5"
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M1 6h9M6.5 2.5L10 6l-3.5 3.5" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                </span>
              </Link>
            </div>
          </div>
        </HeroFrame>
      </section>

      <Section id="service" labelledBy="service-heading">
        <h2
          id="service-heading"
          className="reveal text-[22px] font-bold leading-[1.5] tracking-[-0.01em] lg:text-[34px] lg:leading-[1.45]"
        >
          {service.body}
        </h2>
        <div className="mt-14 lg:mt-20">
          <PlaceRail items={service.items} label="事業内容" />
        </div>
      </Section>

      <Section id="flow" labelledBy="steps-heading" tone="paper">
        <SectionHeading id="steps-heading">{steps.title}</SectionHeading>
        <ol className="mt-14 grid gap-10 sm:grid-cols-2 lg:mt-20 lg:grid-cols-4 lg:gap-6">
          {steps.items.map((item) => (
            <li key={item.step} className="reveal border-t border-ink pt-6">
              <p className="font-mono text-xs tracking-[0.04em] text-ink-muted">{item.step}</p>
              <h3 className="mt-4 text-xl font-bold">{item.title}</h3>
              <p className={`mt-3 ${bodyText}`}>{item.body}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section id="technology" labelledBy="technology-heading">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-6">
          <div className="reveal lg:col-span-5">
            <SectionHeading id="technology-heading">{technology.title}</SectionHeading>
            <p className={`mt-8 ${bodyText}`}>{technology.body}</p>
          </div>
          <div className="reveal lg:col-span-7">
            <MediaFrame media={technology.media} sizes="(min-width: 1024px) 58vw, 100vw" />
          </div>
        </div>
      </Section>

      <Section id="industries" labelledBy="industries-heading" tone="paper">
        <div className="reveal grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <SectionHeading id="industries-heading">{industries.title}</SectionHeading>
          </div>
          <div className="lg:col-span-6">
            <p className={bodyText}>{industries.body}</p>
            <ul className="mt-8 grid grid-cols-2 border-t border-ink sm:grid-cols-3">
              {industries.items.map((item) => (
                <li key={item} className="border-b border-line py-4 text-[15px] font-medium lg:text-base">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <Section id="faq" labelledBy="faq-heading">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <SectionHeading id="faq-heading">{faq.title}</SectionHeading>
          </div>
          <div className="lg:col-span-8">
            <FaqList items={faq.items} />
          </div>
        </div>
      </Section>

      <section aria-labelledby="closing-heading" className="bg-paper px-4 py-24 lg:px-6 lg:py-36">
        <h2
          id="closing-heading"
          className="text-[28px] font-bold leading-[1.3] tracking-[-0.02em] lg:text-6xl lg:leading-[1.15]"
        >
          {closing.title}
        </h2>
        <p className={`mt-6 ${bodyText}`}>{closing.body}</p>
        <Link
          href={contactCta.href}
          className="group mt-10 inline-flex h-14 w-full items-center justify-between gap-4 rounded-full bg-ink pr-2 pl-6 text-[15px] font-medium text-white transition-colors hover:bg-ink/85 sm:w-auto"
        >
          {contactCta.label}
          <span
            aria-hidden="true"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-ink transition-transform duration-200 group-hover:translate-x-0.5"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M1 6h9M6.5 2.5L10 6l-3.5 3.5" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </span>
        </Link>
      </section>
    </>
  );
}
