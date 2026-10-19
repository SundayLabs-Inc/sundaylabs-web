import Header from "@/components/Header";
import IntroLoader from "@/components/IntroLoader";
import RailHero from "@/components/rail/RailHero";
import RailServices from "@/components/rail/RailServices";
import RailRobots from "@/components/rail/RailRobots";
import RailSchedule from "@/components/rail/RailSchedule";
import Faq from "@/components/Faq";
import Spotlight from "@/components/Spotlight";
import Footer from "@/components/Footer";
import type { Locale } from "@/constants/site";

export default function HomePage({ locale }: { locale: Locale }) {
  return (
    <>
      <IntroLoader />
      <Header locale={locale} />
      <div className="content-wrapper">
        <main>
          <RailHero locale={locale} />
          <RailRobots />
          <RailServices locale={locale} />
          <RailSchedule locale={locale} />
          <Faq locale={locale} />
          <Spotlight locale={locale} />
        </main>
      </div>
      <Footer locale={locale} />
    </>
  );
}
