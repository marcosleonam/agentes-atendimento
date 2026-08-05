import Section from "./Section";
import CTAButton from "./CTAButton";
import fotoEquipe from "../img/equipe.jpg";

const PASSOS = [
  {
    n: "01",
    titulo: "A gente escuta seu atendimento",
    txt: "Preço, prazo, objeção, o que o cliente sempre pergunta. Sai daqui o roteiro do agente.",
  },
  {
    n: "02",
    titulo: "O agente entra no seu WhatsApp",
    txt: "No número que você já usa. Sem mudar link de anúncio, sem cliente estranhar.",
  },
  {
    n: "03",
    titulo: "Você recebe só quem quer comprar",
    txt: "O agente filtra, responde o resto sozinho e te passa a conversa pronta.",
  },
];

export default function Como() {
  return (
    <Section id="como" className="border-y border-line bg-ink-2/40">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          <div>
            <span className="etiqueta text-xs text-accent">Como funciona</span>
            <h2 className="display mt-4 text-4xl sm:text-5xl">
              Três passos.<br />No ar em poucos dias.
            </h2>

            <ol className="mt-10 space-y-8">
              {PASSOS.map((p) => (
                <li key={p.n} className="flex gap-5">
                  <span className="font-mono text-sm text-accent">{p.n}</span>
                  <div>
                    <h3 className="text-lg font-semibold">{p.titulo}</h3>
                    <p className="mt-1.5 text-[15px] leading-relaxed text-white/55">{p.txt}</p>
                  </div>
                </li>
              ))}
            </ol>

            <div className="mt-10">
              <CTAButton>Quero montar o meu</CTAButton>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-2xl border border-line">
            <img
              src={fotoEquipe}
              alt="Equipe de atendimento trabalhando com headsets em um escritório"
              loading="lazy"
              className="foto-campanha h-72 w-full object-cover object-bottom sm:h-96 lg:h-full"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_35%,rgba(8,9,11,.92)_100%)]" />
            <p className="absolute bottom-6 left-6 right-6 text-sm text-white/75">
              Seu time não sai de cena. Ele só para de gastar o dia respondendo
              "qual o valor?" pela quadragésima vez.
            </p>
          </div>
        </div>
      </div>
    </Section>
  );
}
