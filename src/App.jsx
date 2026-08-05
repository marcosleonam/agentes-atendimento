import Hero from "./components/Hero";
import Marquee from "./components/Marquee";
import Dor from "./components/Dor";
import Solucao from "./components/Solucao";
import Como from "./components/Como";
import LeadForm from "./components/LeadForm";
import FAQ from "./components/FAQ";
import CTAFinal from "./components/CTAFinal";
import Footer from "./components/Footer";
import WhatsAppFloat from "./components/WhatsAppFloat";
import AvisoClone from "./components/AvisoClone";

export default function App() {
  return (
    <>
      <AvisoClone />
      <main className="min-h-screen grade-fina">
        <Hero />
        <Marquee />
        <Dor />
        <Solucao />
        <Como />
        <LeadForm />
        <FAQ />
        <CTAFinal />
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  );
}
