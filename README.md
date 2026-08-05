# Landing — Agentes de Atendimento

**No ar:** https://marcosleonam.github.io/agentes-atendimento/

Página de captação construída a partir do card 02 da campanha
("Se você não gosta de esperar atendimento, seu cliente também não").

Mesma identidade dos cards: fundo `#08090B`, verde `#2BE08A`, Big Shoulders nos
títulos, Instrument Sans no corpo, JetBrains Mono nas etiquetas. As fotos usam o
mesmo tratamento de cor (`.foto-campanha`), então site e cards leem como uma
campanha só.

## Stack

React 18 + Vite + Tailwind CSS v4 + framer-motion + lucide-react. Estático, sem backend.

## Dados do cliente

- **`src/config.js`** — dados não sensíveis (nome, cidade).
- **`src/contato.js`** — WhatsApp, e-mail e Instagram, **codificados**. Não
  ficam em texto puro nem no site publicado nem neste repositório. Para trocar
  algum, gere o novo valor com XOR `0x5B` + base64 (a função `decodificar` no
  próprio arquivo mostra o formato) — ou me peça.

Ali também mora `DOMINIOS_AUTORIZADOS`: **ao publicar em domínio próprio,
inclua o domínio nessa lista**, senão a trava anti-clone bloqueia o site
oficial. Ver `SEGURANCA.md`.

## Rodar

```bash
npm install
npm run dev              # desenvolvimento
npm run build            # gera dist/
npm run preview          # testa o build local
```

## Republicar (GitHub Pages)

`vite.config.js` usa `base: './'` e as fotos entram por `import`, então o build
funciona tanto em subpasta quanto em domínio próprio, sem alterar nada.

```bash
npm run build
touch dist/.nojekyll
cd dist && git init -q && git checkout -q -b gh-pages && git add -A \
  && git commit -qm "deploy" \
  && git push -qf https://github.com/marcosleonam/agentes-atendimento.git gh-pages
```

Para trocar por domínio próprio depois: adicionar o arquivo `dist/CNAME` com o
domínio e apontar o DNS.

## Estrutura das dobras

Hero (foto + cronômetro ao vivo) → Marquee → Dor (linha do tempo da espera) →
Solução (6 benefícios) → Como funciona (3 passos) → Formulário → FAQ →
CTA final → Footer.

O cronômetro do hero conta desde que a página abriu: o argumento da página
acontecendo ao vivo com o visitante.

## Captação

O formulário não usa servidor: monta uma mensagem formatada e abre `wa.me` com
tudo preenchido. Quando houver CRM, trocar o `window.open` de `LeadForm.jsx` por
um `fetch` pro webhook, mantendo os mesmos campos.

## Fotos

`public/img/` — Pexels, licença de uso comercial, atribuição não obrigatória.
Créditos em `/root/marketing/cards-agentes-atendimento/CREDITOS-FOTOS.txt`.

## Validado

- Build limpo, sem erros.
- Sem overflow horizontal a 360 / 768 / 1280px.
