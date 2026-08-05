const PALAVRAS = [
  "responde em 3 segundos",
  "24h por dia",
  "nunca falta",
  "não tira férias",
  "qualifica sozinho",
  "não esquece follow-up",
  "atende no domingo",
  "escala sem contratar",
];

export default function Marquee() {
  const fita = [...PALAVRAS, ...PALAVRAS];
  return (
    <div className="border-y border-line bg-ink-2/60 py-4 overflow-hidden" aria-hidden="true">
      <div className="marquee-track">
        {fita.map((p, i) => (
          <span key={i} className="etiqueta flex items-center text-xs text-white/45 sm:text-sm">
            <span className="px-6">{p}</span>
            <span className="text-accent">/</span>
          </span>
        ))}
      </div>
    </div>
  );
}
