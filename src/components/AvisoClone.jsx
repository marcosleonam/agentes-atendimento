import { dominioAutorizado } from "../contato";

// Se a página estiver rodando fora dos domínios autorizados, é cópia.
// A tarja avisa o visitante e leva pro site verdadeiro — em vez de o clonador
// colher o lead com o material dos outros.
const OFICIAL = "https://marcosleonam.github.io/agentes-atendimento/";

export default function AvisoClone() {
  if (dominioAutorizado()) return null;
  return (
    <div className="sticky top-0 z-[60] bg-red-600 px-4 py-3 text-center text-sm font-semibold text-white">
      Esta cópia não é o site oficial.{" "}
      <a href={OFICIAL} className="underline underline-offset-2">
        Acesse a página verdadeira
      </a>
      .
    </div>
  );
}
