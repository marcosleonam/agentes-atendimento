// ── Rastreio de origem (UTM + referrer) ────────────────────────────
//
// PROBLEMA: o site é estático e o "CRM" é o WhatsApp. Quando o visitante
// clica no botão, a origem dele (anúncio, campanha, criativo) se perdia —
// todo lead chegava como "whatsapp" no funil.
//
// SOLUÇÃO: na chegada, guardamos utm_* + referrer em localStorage
// (validade de 7 dias — se a pessoa voltar amanhã por acesso direto, a
// campanha original continua valendo). No clique, isso vira uma frase
// em português no fim da mensagem:
//
//     Vim pelo Instagram (agosto-2026 · reel-01)
//
// POR QUE UMA FRASE E NÃO UM CÓDIGO: quem envia a mensagem é a pessoa, e
// ela lê o texto antes de apertar enviar. Qualquer coisa com cara de
// código ("cod: aWd...", "ref: ig/ps/...") assusta e faz o lead apagar ou
// desistir. Uma frase que ela mesma poderia ter escrito passa natural.
// O backend lê essa frase e transforma de volta em utm_source/medium/
// campaign/content antes de gravar no funil.
//
// PRIVACIDADE: nada aqui identifica a pessoa — são só parâmetros da URL
// da campanha e o domínio de onde ela veio. Nenhum dado sai do navegador
// antes de a própria pessoa decidir abrir o WhatsApp.

const CHAVE_STORAGE = "rastreio_origem_v1";
const VALIDADE_MS = 7 * 24 * 60 * 60 * 1000; // 7 dias

// Nome de exibição das origens conhecidas. O backend tem a tabela inversa
// (supabase/functions/_shared/lead-parsing.ts). Origem fora da lista entra
// capitalizada, em texto puro; nada quebra.
const NOME_SOURCE = {
  instagram: "Instagram", facebook: "Facebook", google: "Google",
  youtube: "YouTube", tiktok: "TikTok", linkedin: "LinkedIn",
  whatsapp: "WhatsApp", email: "E-mail", threads: "Threads",
};

// Preposição certa pra frase soar natural em português.
const ARTIGO = { "E-mail": "por", Threads: "pelo" };
const preposicao = (nome) => ARTIGO[nome] || (/^[AI]/.test(nome) ? "pelo" : "pelo");

// Limites por campo: mantêm a frase curta.
const LIM_CAMPANHA = 18;
const LIM_CRIATIVO = 14;

// Corta no último separador em vez de no meio da palavra: "agentes-agosto-2026"
// vira "agentes-agosto", não "agentes-agosto-202".
const enxugar = (v, max) => {
  const limpo = String(v || "")
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "");
  if (limpo.length <= max) return limpo;
  const cortado = limpo.slice(0, max);
  const sep = Math.max(cortado.lastIndexOf("-"), cortado.lastIndexOf("_"), cortado.lastIndexOf("."));
  return (sep >= max * 0.5 ? cortado.slice(0, sep) : cortado).replace(/[-_.]+$/, "");
};

const capitalizar = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : "");

const lerStorage = () => {
  try {
    const raw = localStorage.getItem(CHAVE_STORAGE);
    if (!raw) return null;
    const dado = JSON.parse(raw);
    if (!dado?.salvoEm || Date.now() - dado.salvoEm > VALIDADE_MS) {
      localStorage.removeItem(CHAVE_STORAGE);
      return null;
    }
    return dado;
  } catch {
    return null; // storage bloqueado/corrompido: rastreio é opcional, segue o jogo
  }
};

/**
 * Captura a origem da visita atual. Chamar UMA vez, no carregamento.
 * Regra: visita COM utm sobrescreve o que havia (campanha nova vale mais);
 * visita sem utm só preenche se não havia nada (não apaga a campanha).
 */
export const capturarRastreio = () => {
  try {
    const params = new URLSearchParams(window.location.search);
    const utm = {};
    for (const c of ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"]) {
      const v = (params.get(c) || "").trim().slice(0, 120);
      if (v) utm[c] = v;
    }

    let referrer = "";
    try {
      if (document.referrer) {
        const host = new URL(document.referrer).hostname;
        // referrer do próprio site não é origem
        if (host && host !== window.location.hostname) referrer = host;
      }
    } catch { /* referrer malformado: ignora */ }

    const temUtm = Object.keys(utm).length > 0;
    const existente = lerStorage();
    if (existente && !temUtm) return; // preserva a campanha original

    localStorage.setItem(CHAVE_STORAGE, JSON.stringify({
      ...utm,
      referrer,
      salvoEm: Date.now(),
    }));
  } catch { /* nunca deixar rastreio quebrar a página */ }
};

/**
 * Frase de origem para o fim da mensagem do WhatsApp, ex.:
 *   "Vim pelo Instagram (agosto-2026 · reel-01)"
 * Retorna "" quando não há origem conhecida — nesse caso a mensagem sai
 * exatamente como era antes, sem nenhuma linha extra.
 */
export const codigoRastreio = () => {
  const dado = lerStorage();
  if (!dado) return "";

  // Sem utm_source (tráfego orgânico), o domínio de origem vira a source:
  // "l.instagram.com" -> "instagram". É o dado que interessa no funil.
  let source = enxugar(dado.utm_source, 20);
  if (!source && dado.referrer) {
    const host = String(dado.referrer).replace(/^www\./, "");
    const conhecido = Object.keys(NOME_SOURCE).find((k) => host.includes(k));
    source = conhecido || enxugar(host.split(".")[0], 14);
  }
  if (!source) return ""; // sem origem, nada a dizer

  const nome = NOME_SOURCE[source] || capitalizar(source);

  // Detalhe da campanha entre parênteses. O medium não entra na frase:
  // "social"/"cpc" não dizem nada pra quem lê, e o backend consegue
  // inferir pela campanha. Fica guardado no localStorage de qualquer forma.
  const detalhe = [
    enxugar(dado.utm_campaign, LIM_CAMPANHA),
    enxugar(dado.utm_content, LIM_CRIATIVO),
  ].filter(Boolean).join(" · ");

  return `Vim ${preposicao(nome)} ${nome}${detalhe ? ` (${detalhe})` : ""}`;
};
