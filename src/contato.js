// ── Contato protegido ──────────────────────────────────────────────
//
// POR QUE ESTE ARQUIVO EXISTE
// Número e e-mail em texto puro dentro do HTML são o alvo nº 1 de robô de
// coleta: bastava um "view-source" ou um crawler pra levar o contato e sair
// disparando spam. Aqui nada disso aparece em texto legível — os dados ficam
// codificados e só viram string de verdade no instante em que a pessoa clica.
//
// LIMITE HONESTO
// Isto derruba robô de coleta e o clonador que copia e cola a página. NÃO
// impede um desenvolvedor determinado: qualquer coisa que o navegador precisa
// exibir, ele consegue ler. Segurança de frontend é camada de atrito, não
// cofre. O que realmente protege contra clone é registrar o domínio próprio e
// denunciar a cópia.

import { codigoRastreio } from "./rastreio.js";

const CHAVE = 0x5b;

// XOR + base64: as strings originais não existem no arquivo publicado.
const decodificar = (s) =>
  new TextDecoder().decode(
    Uint8Array.from(atob(s), (c) => c.charCodeAt(0) ^ CHAVE)
  );

const COD = {
  zap: "bm5iY2JjamlobmhraQ==",
  mail: "NjopODQoNz40NTo2amJjbRs8NjoyN3U4NDY=",
  msg: "FDczPjJ7KC46eyuY+jwyNTp7PnsqLj4pNHsoOjk+KXs2OjIoeyg0OSk+ezo8PjUvPih7Pz57Oi8+NT8yNj41LzQ=",
  insta: "NjopODQoNz40NTo2ag==",
};

// ── Trava de domínio ───────────────────────────────────────────────
// Se alguém clonar a página e subir em outro endereço, os botões não abrem o
// WhatsApp: o lead não é desviado pro clonador. Ajuste a lista ao publicar em
// domínio próprio.
const DOMINIOS_AUTORIZADOS = [
  "marcosleonam.github.io",
  "localhost",
  "127.0.0.1",
];

export const dominioAutorizado = () => {
  const h = window.location.hostname;
  return DOMINIOS_AUTORIZADOS.some((d) => h === d || h.endsWith("." + d));
};

// ── Acesso aos dados (só sob demanda) ──────────────────────────────
export const zap = () => decodificar(COD.zap);
export const email = () => decodificar(COD.mail);
export const mensagemPadrao = () => decodificar(COD.msg);
export const instagramHandle = () => "@" + decodificar(COD.insta);
export const instagramUrl = () => "https://instagram.com/" + decodificar(COD.insta);

const AVISO_CLONE =
  "Esta página não é a oficial. Acesse o site verdadeiro para falar com a gente.";

/** Abre o WhatsApp com a mensagem indicada. Bloqueia se o domínio não confere. */
export const abrirWhatsApp = (texto) => {
  if (!dominioAutorizado()) {
    window.alert(AVISO_CLONE);
    return false;
  }
  let mensagem = texto ?? mensagemPadrao();
  // Anexa a origem (utm/referrer) numa linha curta no fim — o sistema que
  // recebe lê, grava no funil e remove a linha. Ver src/rastreio.js.
  const cod = codigoRastreio();
  if (cod) mensagem += `\n\nref: ${cod}`;
  const url = `https://wa.me/${zap()}?text=${encodeURIComponent(mensagem)}`;
  window.open(url, "_blank", "noopener,noreferrer");
  return true;
};

/** Limpa o que o visitante digitou antes de virar mensagem de WhatsApp. */
export const limpar = (v, max = 120) =>
  String(v ?? "")
    // eslint-disable-next-line no-control-regex
    .replace(/[\u0000-\u001F\u007F-\u009F]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max);
