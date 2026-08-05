import { Zap, Filter, Repeat, Clock, Users, MessageSquare } from "lucide-react";
import Section from "./Section";

const BENEFICIOS = [
  {
    icon: Zap,
    titulo: "Responde em 3 segundos",
    txt: "Às 23h, no domingo, no feriado. O cliente é atendido enquanto ainda está interessado.",
  },
  {
    icon: Filter,
    titulo: "Qualifica sozinho",
    txt: "Pergunta o que precisa saber e separa curioso de comprador. Seu time só fala com quem vale.",
  },
  {
    icon: Repeat,
    titulo: "Nunca esquece o follow-up",
    txt: "Volta a falar com quem sumiu, no tempo certo. É aí que boa parte da venda acontece.",
  },
  {
    icon: Clock,
    titulo: "Não falta, não atrasa",
    txt: "Não tira férias, não pede demissão, não precisa ser treinado de novo a cada troca.",
  },
  {
    icon: Users,
    titulo: "Escala sem contratar",
    txt: "Atende 5 ou 500 conversas ao mesmo tempo, com a mesma velocidade.",
  },
  {
    icon: MessageSquare,
    titulo: "Fala como o seu negócio fala",
    txt: "Treinado com seus preços, prazos, objeções e jeito de atender. Não é robô genérico.",
  },
];

export default function Solucao() {
  return (
    <Section id="solucao">
      <div className="mx-auto max-w-6xl px-6">
        <div className="max-w-3xl">
          <span className="etiqueta text-xs text-accent">A solução</span>
          <h2 className="display mt-4 text-4xl sm:text-5xl lg:text-6xl">
            Não é sobre demitir ninguém.<br />É sobre nunca deixar a mensagem sem resposta.
          </h2>
          <p className="mt-6 text-lg text-white/65">
            Seu time continua. O agente cobre o que humano nenhum cobre: o primeiro
            minuto, a madrugada, o domingo e as dez conversas ao mesmo tempo.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
          {BENEFICIOS.map(({ icon: Icon, titulo, txt }) => (
            <div key={titulo} className="bg-ink-2 p-8">
              <Icon className="h-7 w-7 text-accent" strokeWidth={1.6} />
              <h3 className="mt-5 text-lg font-semibold">{titulo}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-white/55">{txt}</p>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
