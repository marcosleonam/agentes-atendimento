import { useState } from "react";
import { ChevronDown } from "lucide-react";
import Section from "./Section";

const ITENS = [
  {
    q: "O cliente vai perceber que é um robô?",
    a: "Ele percebe que foi atendido rápido. O agente é treinado com o seu jeito de falar, seus preços e suas objeções — não é aquele menuzinho de 'digite 1'. E quando a conversa fica séria, ele passa pra uma pessoa do seu time.",
  },
  {
    q: "Preciso trocar meu número de WhatsApp?",
    a: "Não. O agente entra no número que você já usa e já divulga. Nada muda no seu anúncio, no seu cartão ou na sua bio.",
  },
  {
    q: "Vou ter que demitir meu atendente?",
    a: "Não é essa a ideia. O agente cobre o que ninguém cobre: o primeiro minuto, a madrugada, o domingo e várias conversas ao mesmo tempo. Seu time para de repetir 'qual o valor?' e passa a fechar venda.",
  },
  {
    q: "Quanto tempo pra colocar no ar?",
    a: "Poucos dias. A parte que leva tempo é escutar como você atende hoje — isso a gente resolve numa conversa. Depois é montar, testar e ligar.",
  },
  {
    q: "E se ele responder alguma coisa errada?",
    a: "O agente trabalha dentro do que você definiu e, no que foge disso, ele chama um humano em vez de inventar. Nas primeiras semanas a gente acompanha as conversas e ajusta.",
  },
  {
    q: "Serve pro meu segmento?",
    a: "Se o seu cliente chega pelo WhatsApp e faz sempre as mesmas perguntas antes de comprar, serve. Funciona igual pra clínica, imobiliária, solar, oficina, loja e prestador de serviço.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState(null);
  return (
    <Section id="faq" className="border-t border-line">
      <div className="mx-auto max-w-3xl px-6">
        <span className="etiqueta text-xs text-accent">Dúvidas</span>
        <h2 className="display mt-4 text-4xl sm:text-5xl">Perguntas que sempre fazem</h2>

        <div className="mt-10">
          {ITENS.map((it, i) => (
            <div key={i} className="border-b border-line">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                aria-expanded={open === i}
                className="flex w-full items-center justify-between gap-4 rounded py-5 text-left text-[17px] font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                {it.q}
                <ChevronDown
                  className={`h-5 w-5 shrink-0 text-accent transition-transform ${
                    open === i ? "rotate-180" : ""
                  }`}
                />
              </button>
              {open === i && (
                <p className="pb-6 text-[15px] leading-relaxed text-white/60">{it.a}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
