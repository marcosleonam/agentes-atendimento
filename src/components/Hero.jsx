import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import fotoEspera from "../img/espera.jpg";
import CTAButton from "./CTAButton";

// Cronômetro que sobe desde que a página abriu. É o argumento da página
// acontecendo ao vivo: quanto tempo o visitante já está esperando.
function Cronometro() {
  const [s, setS] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setS((v) => v + 1), 1000);
    return () => clearInterval(t);
  }, []);
  const mm = String(Math.floor(s / 60)).padStart(2, "0");
  const ss = String(s % 60).padStart(2, "0");
  return (
    <div className="inline-flex items-baseline gap-3 rounded-2xl border border-line bg-ink-2/80 px-5 py-4 backdrop-blur">
      <span className="etiqueta text-[11px] text-white/45">Você está nesta página há</span>
      <span className="font-mono text-2xl font-medium tabular-nums text-accent">
        {mm}:{ss}
      </span>
    </div>
  );
}

export default function Hero() {
  return (
    <header className="relative isolate min-h-[100svh] overflow-hidden">
      {/* foto */}
      <div className="absolute inset-0 -z-20">
        <img
          src={fotoEspera}
          alt="Mulher ao telefone com a mão no rosto, esperando ser atendida"
          className="foto-campanha h-full w-full object-cover object-[58%_22%]"
        />
      </div>
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(8,9,11,.80)_0%,rgba(8,9,11,.30)_26%,rgba(8,9,11,.72)_62%,rgba(8,9,11,.97)_88%,#08090B_100%)]" />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(8,9,11,.78)_0%,transparent_58%)]" />

      <div className="relative mx-auto flex min-h-[100svh] max-w-6xl flex-col px-6 pb-14 pt-8">
        <div className="flex items-baseline justify-between">
          <span className="etiqueta text-[11px] text-white/60 sm:text-xs">
            Atendimento que não dorme
          </span>
          <span className="etiqueta hidden text-[11px] text-accent sm:inline sm:text-xs">
            00:01:30 de espera
          </span>
        </div>

        <div className="mt-auto max-w-4xl">
          <motion.h1
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="display text-[2.15rem] leading-[0.94] xs:text-[2.6rem] sm:text-6xl lg:text-7xl"
          >
            Se você não gosta<br />de esperar atendimento,<br />seu cliente também não.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.12 }}
            className="mt-6 max-w-2xl text-lg text-accent sm:text-xl"
          >
            Esperar "um minutinho" está fora de cogitação no mercado atual.
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.24 }}
            className="mt-5 max-w-xl text-base text-white/65"
          >
            Um agente de IA atende em 3 segundos, 24 horas por dia, qualifica o lead
            e só passa pro seu time quem realmente quer comprar.
          </motion.p>

          <div className="mt-9 flex flex-col items-start gap-5 sm:flex-row sm:items-center">
            <CTAButton>Quero ver funcionando</CTAButton>
            <Cronometro />
          </div>
        </div>

        <a
          href="#dor"
          className="mt-12 inline-flex items-center gap-2 self-start text-sm text-white/45 transition-colors hover:text-accent focus-visible:outline-none focus-visible:text-accent"
        >
          <ArrowDown className="h-4 w-4" /> o que acontece enquanto ninguém responde
        </a>
      </div>
    </header>
  );
}
