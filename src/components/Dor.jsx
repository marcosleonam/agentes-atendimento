import { motion } from "framer-motion";
import Section from "./Section";

const ETAPAS = [
  {
    t: "00:00",
    titulo: "Ele manda a mensagem",
    txt: "Vem do anúncio, do Instagram, da indicação. Está com a carteira na mão.",
  },
  {
    t: "00:30",
    titulo: "Ninguém respondeu ainda",
    txt: "Seu time está no almoço, atendendo outro cliente, ou já foi embora.",
  },
  {
    t: "01:30",
    titulo: "Ele abre a conversa do concorrente",
    txt: "Não é falta de interesse. É que alguém respondeu antes de você.",
  },
  {
    t: "DEPOIS",
    titulo: "Você responde",
    txt: "E recebe o silêncio. Ou o clássico: 'já resolvi, obrigado'.",
  },
];

// Tira de segmentos: os últimos acesos são o ponto em que o lead desiste.
function Faixa() {
  const total = 30;
  return (
    <div className="flex h-8 items-end gap-[6px]" aria-hidden="true">
      {Array.from({ length: total }, (_, i) => {
        const on = i >= total - 5;
        return (
          <motion.div
            key={i}
            initial={{ scaleY: 0.25, opacity: 0.4 }}
            whileInView={{ scaleY: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: i * 0.022 }}
            style={{ originY: 1 }}
            className={`flex-1 ${on ? "h-8 bg-accent" : "h-2.5 bg-white/15"}`}
          />
        );
      })}
    </div>
  );
}

export default function Dor() {
  return (
    <Section id="dor">
      <div className="mx-auto max-w-6xl px-6">
        <span className="etiqueta text-xs text-accent">O que acontece na prática</span>
        <h2 className="display mt-4 max-w-3xl text-4xl sm:text-5xl lg:text-6xl">
          O lead não some.<br />Ele só é atendido por outro.
        </h2>

        <div className="mt-12">
          <Faixa />
          <p className="etiqueta mt-4 text-[11px] text-white/40">
            os últimos segundos antes de ele desistir
          </p>
        </div>

        <ol className="mt-14 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {ETAPAS.map((e) => (
            <li key={e.t} className="bg-ink-2 p-7">
              <span className="font-mono text-sm text-accent">{e.t}</span>
              <h3 className="mt-4 text-lg font-semibold">{e.titulo}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-white/55">{e.txt}</p>
            </li>
          ))}
        </ol>
      </div>
    </Section>
  );
}
