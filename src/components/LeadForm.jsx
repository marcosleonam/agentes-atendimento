// Captação sem backend: o formulário monta uma mensagem formatada e abre o
// WhatsApp já preenchido. O "CRM" é a conversa. O número vem de contato.js,
// codificado — nunca em texto puro na página.
import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Check } from "lucide-react";
import { abrirWhatsApp, limpar } from "../contato";

const FIELDS = [
  { key: "nome", label: "Seu nome", placeholder: "Como te chamam", required: true },
  { key: "negocio", label: "Nome do negócio", placeholder: "Sua marca / empresa" },
  { key: "segmento", label: "Segmento", placeholder: "Ex: solar, clínica, imobiliária..." },
  { key: "whatsapp", label: "Seu WhatsApp", placeholder: "(00) 00000-0000", required: true },
  {
    key: "volume",
    label: "Quantas conversas você recebe por dia?",
    placeholder: "Chute um número, serve",
  },
];

const OPTIONS = [
  "Perco lead fora do horário",
  "Demoro pra responder",
  "Meu time perde tempo com curioso",
  "Esqueço de dar retorno",
];
const OPTIONS_LABEL = "O que mais te incomoda hoje?";
// Sem emoji de propósito: o redirect do wa.me quebra caracteres fora do BMP
// e a mensagem chega com "" no lugar. Texto puro sempre chega limpo.
const TITULO_MSG = "*QUERO UM AGENTE DE ATENDIMENTO*";

const campoBase =
  "w-full rounded-xl border border-line bg-ink px-4 py-3 text-white placeholder:text-white/30 " +
  "focus:outline-none focus:border-accent transition-colors";

export default function LeadForm() {
  const [f, setF] = useState(() => ({
    ...Object.fromEntries(FIELDS.map((c) => [c.key, ""])),
    _opts: [],
  }));

  const set = (k) => (e) => setF((s) => ({ ...s, [k]: e.target.value }));

  const toggleOpt = (op) =>
    setF((s) => ({
      ...s,
      _opts: s._opts.includes(op) ? s._opts.filter((x) => x !== op) : [...s._opts, op],
    }));

  const enviar = (e) => {
    e.preventDefault();
    // tudo que veio do visitante passa por limpar(): sem quebra de linha nem
    // caractere de controle, com tamanho limitado.
    const linha = (label, val) => (val ? `${label}: ${limpar(val)}\n` : "");
    let msg = TITULO_MSG + "\n\n";
    for (const c of FIELDS) msg += linha(c.label, f[c.key]);
    if (f._opts.length) msg += linha(OPTIONS_LABEL, f._opts.join(", "));
    abrirWhatsApp(msg);
  };

  return (
    <section id="contato" className="py-20 md:py-28">
      <div className="mx-auto max-w-3xl px-6">
        <div className="text-center">
          <span className="etiqueta text-xs text-accent">Comece agora</span>
          <h2 className="display mt-4 text-4xl sm:text-5xl">
            Veja o agente respondendo o seu caso
          </h2>
          <p className="mt-5 text-white/65">
            Preenche rapidinho. Ao enviar, seus dados vão direto pro nosso WhatsApp
            — e você já sente na pele o que é ser atendido na hora.
          </p>
        </div>

        <motion.form
          onSubmit={enviar}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.5 }}
          className="mt-12 space-y-6 rounded-3xl border border-line bg-ink-2 p-6 md:p-10"
        >
          {FIELDS.map((c) => (
            <Campo key={c.key} label={c.label} required={c.required}>
              <input
                className={campoBase}
                value={f[c.key]}
                onChange={set(c.key)}
                placeholder={c.placeholder}
                required={c.required}
                maxLength={120}
                autoComplete="off"
              />
            </Campo>
          ))}

          <Campo label={OPTIONS_LABEL}>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {OPTIONS.map((op) => {
                const on = f._opts.includes(op);
                return (
                  <button
                    key={op}
                    type="button"
                    aria-pressed={on}
                    onClick={() => toggleOpt(op)}
                    className={`flex items-start gap-2 rounded-xl border p-4 text-left text-sm transition-colors ${
                      on
                        ? "border-accent bg-accent/10 text-white"
                        : "border-line bg-ink text-white/70 hover:border-accent/50"
                    }`}
                  >
                    <span
                      className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border ${
                        on ? "border-accent bg-accent text-black" : "border-white/30"
                      }`}
                    >
                      {on && <Check className="h-3.5 w-3.5" />}
                    </span>
                    {op}
                  </button>
                );
              })}
            </div>
          </Campo>

          <button
            type="submit"
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent px-8 py-4 text-sm font-semibold uppercase tracking-[0.12em] text-black transition-all duration-300 hover:bg-accent-soft hover:shadow-[0_14px_44px_rgba(43,224,138,0.38)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-ink-2 md:text-base"
          >
            Enviar pelo WhatsApp <Send className="h-4 w-4" />
          </button>
          <p className="text-center text-xs text-white/40">
            Ao enviar, abre o WhatsApp com seus dados já preenchidos.
          </p>
        </motion.form>
      </div>
    </section>
  );
}

function Campo({ label, required, children }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-white/80">
        {label}
        {required && <span className="text-accent"> *</span>}
      </span>
      {children}
    </label>
  );
}
