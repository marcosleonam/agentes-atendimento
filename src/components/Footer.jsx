import { useState } from "react";
import { site } from "../config";
import { email, instagramHandle, instagramUrl, dominioAutorizado } from "../contato";

// O e-mail não é renderizado de saída: robô de spam varre a página atrás de
// endereço em texto puro. Fica atrás de um clique e só então é montado.
function Email() {
  const [aberto, setAberto] = useState(false);

  if (!aberto) {
    return (
      <button
        type="button"
        onClick={() => setAberto(true)}
        className="text-sm text-white/50 underline underline-offset-4 transition-colors hover:text-accent focus-visible:outline-none focus-visible:text-accent"
      >
        mostrar e-mail
      </button>
    );
  }

  const end = email();
  return (
    <a
      href={`mailto:${end}`}
      className="text-sm text-white/70 transition-colors hover:text-accent"
    >
      {end}
    </a>
  );
}

export default function Footer() {
  const autorizado = dominioAutorizado();
  return (
    <footer className="border-t border-line py-12">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-6 text-center">
        <p className="display text-2xl">{site.nome}</p>
        {site.cidade && <p className="text-sm text-white/50">{site.cidade}</p>}
        <Email />
        {autorizado && (
          <a
            href={instagramUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-white/50 transition-colors hover:text-accent"
          >
            {instagramHandle()}
          </a>
        )}
        <p className="etiqueta mt-3 text-[10px] text-white/25">
          © {new Date().getFullYear()} — todos os direitos reservados
        </p>
      </div>
    </footer>
  );
}
