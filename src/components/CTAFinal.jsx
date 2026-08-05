import Section from "./Section";
import CTAButton from "./CTAButton";
import fotoNoite from "../img/noite.jpg";

export default function CTAFinal() {
  return (
    <Section className="relative isolate overflow-hidden border-t border-line">
      <div className="absolute inset-0 -z-20">
        <img
          src={fotoNoite}
          alt=""
          aria-hidden="true"
          loading="lazy"
          className="foto-campanha h-full w-full object-cover object-[50%_38%]"
        />
      </div>
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,#08090B_0%,rgba(8,9,11,.72)_40%,rgba(8,9,11,.94)_100%)]" />

      <div className="mx-auto max-w-4xl px-6 text-center">
        <h2 className="display text-4xl sm:text-5xl lg:text-6xl">
          Enquanto você lê isso,<br />alguém está esperando resposta.
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-lg text-white/70">
          Pode ser o seu próximo cliente. Ou o próximo cliente do concorrente.
        </p>
        <div className="mt-10">
          <CTAButton>Chame no WhatsApp e veja funcionando hoje</CTAButton>
        </div>
      </div>
    </Section>
  );
}
