import { motion } from "framer-motion";
import { abrirWhatsApp } from "../contato";

// CTA em pílula, caixa-alta, verde sólido sobre texto preto (contraste alto).
//
// O href NÃO carrega o número: fica como âncora inofensiva e o link real é
// montado só no clique. Assim o contato não aparece no HTML pra robô de coleta,
// e o elemento continua sendo um <a> de verdade — acessível por teclado e
// leitor de tela.
export default function CTAButton({ children, className = "", texto }) {
  return (
    <motion.a
      href="#contato"
      onClick={(e) => {
        e.preventDefault();
        abrirWhatsApp(texto);
      }}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      className={
        "inline-flex cursor-pointer items-center justify-center gap-2 rounded-full bg-accent px-8 py-4 " +
        "text-sm md:text-base font-semibold uppercase tracking-[0.12em] text-black " +
        "transition-shadow duration-300 hover:shadow-[0_14px_44px_rgba(43,224,138,0.38)] " +
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent " +
        "focus-visible:ring-offset-2 focus-visible:ring-offset-ink " + className
      }
    >
      {children}
    </motion.a>
  );
}
