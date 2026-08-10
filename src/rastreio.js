// ── Rastreio de origem (UTM + referrer) ────────────────────────────
//
// PROBLEMA: o site é estático e o "CRM" é o WhatsApp. Quando o visitante
// clica no botão, a origem dele (anúncio, campanha, criativo) se perdia —
// todo lead chegava como "whatsapp" no funil.
//
// SOLUÇÃO: na chegada, guardamos utm_* + referrer + página em localStorage
// (validade de 7 dias — se a pessoa voltar amanhã por acesso direto, a
// campanha original continua valendo). No clique, isso vira um código
// compacto ("cod: ...") anexado ao FIM da mensagem do WhatsApp. O sistema
// que recebe a mensagem decodifica o código, preenche a origem do lead e
// remove a linha do texto.
//
// PRIVACIDADE: nada aqui identifica a pessoa — são só parâmetros da URL
// da campanha e o domínio de onde ela veio. Nenhum dado sai do navegador
// antes de a própria pessoa decidir abrir o WhatsApp.

const CHAVE_STORAGE = "rastreio_origem_v1";
const VALIDADE_MS = 7 * 24 * 60 * 60 * 1000; // 7 dias

// Ordem fixa dos campos — TEM que bater com o decodificador do backend
// (supabase/functions/_shared/lead-parsing.ts, TRACKING_FIELDS).
const CAMPOS = [
  "utm_source", "utm_medium", "utm_campaign", "utm_content",
  "utm_term", "referrer", "landing_page", "ts_min",
];

// base64url com suporte a acentos (btoa puro quebra com unicode)
const b64url = (str) => {
  const bytes = new TextEncoder().encode(str);
  let bin = "";
  bytes.forEach((b) => (bin += String.fromCharCode(b)));
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
};

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
      landing_page: window.location.pathname + window.location.search.slice(0, 80),
      ts_min: String(Math.floor(Date.now() / 60000)),
      salvoEm: Date.now(),
    }));
  } catch { /* nunca deixar rastreio quebrar a página */ }
};

/**
 * Código compacto para anexar à mensagem do WhatsApp.
 * Retorna "" se não houver nada rastreado (mensagem sai limpa).
 */
export const codigoRastreio = () => {
  const dado = lerStorage();
  if (!dado) return "";
  const linha = CAMPOS.map((c) => String(dado[c] || "").replace(/\|/g, "/")).join("|");
  if (linha.replace(/\|/g, "") === "") return "";
  return b64url(linha);
};
