// ── Rastreio de origem (UTM + referrer) ────────────────────────────
//
// PROBLEMA: o site é estático e o "CRM" é o WhatsApp. Quando o visitante
// clica no botão, a origem dele (anúncio, campanha, criativo) se perdia —
// todo lead chegava como "whatsapp" no funil.
//
// SOLUÇÃO: na chegada, guardamos utm_* + referrer em localStorage
// (validade de 7 dias — se a pessoa voltar amanhã por acesso direto, a
// campanha original continua valendo). No clique, isso vira UMA linha
// curta no fim da mensagem, tipo:
//
//     ref: ig/ps/agosto-2026/reel-01
//
// POR QUE CURTO E LEGÍVEL: quem envia a mensagem é a pessoa, e ela lê o
// texto antes de apertar enviar. Um bloco longo de caracteres aleatórios
// parece código malicioso e faz o lead apagar (ou desistir). Uma linha
// curta e reconhecível passa despercebida. O backend expande as siglas de
// volta ("ig" -> "instagram") antes de gravar no funil.
//
// PRIVACIDADE: nada aqui identifica a pessoa — são só parâmetros da URL
// da campanha e o domínio de onde ela veio. Nenhum dado sai do navegador
// antes de a própria pessoa decidir abrir o WhatsApp.

const CHAVE_STORAGE = "rastreio_origem_v1";
const VALIDADE_MS = 7 * 24 * 60 * 60 * 1000; // 7 dias

// Siglas para as origens mais comuns — o backend tem a tabela inversa
// (supabase/functions/_shared/lead-parsing.ts). Origem desconhecida vai
// truncada em texto puro; nada quebra.
const SIGLA_SOURCE = {
  instagram: "ig", facebook: "fb", google: "gg", youtube: "yt",
  tiktok: "tt", linkedin: "li", whatsapp: "wa", email: "em",
};
const SIGLA_MEDIUM = {
  paid_social: "ps", social: "s", cpc: "c", ppc: "c", organic: "o",
  email: "e", referral: "r", display: "d", video: "v",
};

// Limites por campo: mantêm a linha por volta de 40 caracteres.
const LIM_CAMPANHA = 16;
const LIM_CRIATIVO = 12;

const enxugar = (v, max) =>
  String(v || "")
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")   // barra é separador; espaço vira hífen
    .replace(/^-+|-+$/g, "")
    .slice(0, max);

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
 * Linha curta de origem para o fim da mensagem do WhatsApp.
 * Formato: "source/medium/campanha/criativo" (campos vazios viram "-",
 * e os "-" do fim somem). Retorna "" quando não há nada a rastrear —
 * nesse caso a mensagem sai exatamente como era antes.
 */
export const codigoRastreio = () => {
  const dado = lerStorage();
  if (!dado) return "";

  // Sem utm_source (tráfego orgânico), o domínio de origem vira a source:
  // "l.instagram.com" -> "instagram". É o dado que o Marcos quer ver.
  let source = enxugar(dado.utm_source, 20);
  if (!source && dado.referrer) {
    const host = String(dado.referrer).replace(/^www\./, "");
    const conhecido = Object.keys(SIGLA_SOURCE).find((k) => host.includes(k));
    source = conhecido || enxugar(host.split(".")[0], 12);
  }

  const partes = [
    SIGLA_SOURCE[source] || source,
    SIGLA_MEDIUM[enxugar(dado.utm_medium, 20)] || enxugar(dado.utm_medium, 8),
    enxugar(dado.utm_campaign, LIM_CAMPANHA),
    enxugar(dado.utm_content, LIM_CRIATIVO),
  ].map((p) => p || "-");

  while (partes.length && partes[partes.length - 1] === "-") partes.pop();
  if (!partes.length || partes.every((p) => p === "-")) return "";

  return partes.join("/");
};
