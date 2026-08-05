# Segurança da página

O que foi feito para reduzir o risco de coleta do contato e de clonagem, e —
igualmente importante — o que **não** dá pra impedir.

## 1. Contato fora do texto puro

Número de WhatsApp, e-mail e Instagram não existem como texto legível no site
publicado nem no repositório. Ficam codificados (XOR + base64) em
`src/contato.js` e só viram string no instante do clique.

Os links também não carregam o contato no atributo `href`: o `<a>` aponta para
uma âncora inofensiva e o endereço real é montado no `onClick`. Robô de coleta
que lê o HTML não encontra nada.

O e-mail no rodapé exige um clique em "mostrar e-mail" — é o alvo preferido de
robô de spam, então não fica exposto de saída.

**Verificação:** `grep -r "5598981235302\|marcosleonam1986" dist/` não retorna
nada.

## 2. Trava de domínio (anti-clone)

`contato.js` só libera o WhatsApp nos domínios da lista
`DOMINIOS_AUTORIZADOS`. Se alguém copiar a página e subir noutro endereço:

- uma tarja vermelha avisa o visitante que aquilo é cópia e aponta pro site real;
- os botões não abrem o WhatsApp — o lead não cai no colo do clonador.

**Ao publicar em domínio próprio, adicione o domínio nessa lista**, senão o
próprio site oficial fica travado.

## 3. Cabeçalhos e isolamento

- **CSP** (`<meta http-equiv>` no `index.html`): só carrega recurso do próprio
  domínio. Bloqueia script injetado, `object`, `iframe` e envio de formulário
  pra fora.
- **Anti-enquadramento** em `src/main.jsx`: se a página for aberta dentro de um
  iframe de terceiro, se joga pra fora. Fica no bundle, e não como script
  inline, porque o CSP bloqueia inline — e liberar inline abriria justamente a
  porta que o CSP fecha. (`frame-ancestors` não funciona via `<meta>`; num
  servidor com cabeçalhos próprios, prefira o cabeçalho HTTP.)
- **`referrer`** em `strict-origin-when-cross-origin`.
- Links externos com `rel="noopener noreferrer"`.

## 4. Fontes locais

As fontes saíram do Google Fonts e passaram a ser servidas pelo próprio site
(WOFF2, licença OFL). Some a requisição a terceiro — que entregava o IP de cada
visitante ao Google — e o CSP pôde ficar restrito a `font-src 'self'`.

## 5. Entrada do visitante

Os campos do formulário têm `maxLength`, e tudo passa por `limpar()`: remove
caracteres de controle e quebra de linha, colapsa espaço e corta o tamanho.
Evita mensagem forjada ou gigante chegando no WhatsApp.

## 6. Sem segredos no repositório

Não há chave de API, token ou credencial no projeto. A chave do Pexels usada
para baixar as fotos mora fora daqui, com permissão restrita e ignorada pelo
git.

---

## O que isto NÃO resolve — sem ilusão

- **Contato 100% escondido não existe.** O navegador precisa montar o link pra
  a pessoa falar com você; quem entende de código consegue ler. O que foi feito
  derruba robô de coleta e o clonador de copiar-e-colar, que é a esmagadora
  maioria. Não segura um desenvolvedor determinado.
- **A trava de domínio é removível** por quem sabe editar JavaScript.
- **Anúncio expõe o número de qualquer jeito**: quem clica no seu anúncio e
  conversa no WhatsApp já tem o número. Isso é o negócio funcionando.

### O que protege de verdade, e depende de você

1. **Domínio próprio.** Com domínio registrado no seu nome, cópia vira
   violação de marca e o Meta derruba o anúncio do clonador na denúncia.
2. **WhatsApp Business verificado**, para o cliente reconhecer o oficial.
3. **Denúncia ativa**: achou clone, denuncia no Meta e no host da cópia.
4. Se o volume de spam incomodar, trocar o link direto por um **intermediário
   com verificação** (um redirecionador seu que valida antes de encaminhar).
