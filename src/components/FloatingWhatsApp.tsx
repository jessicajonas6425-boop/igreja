import { MessageCircle } from "lucide-react";
import { ChurchConfig } from "../types";

interface FloatingWhatsAppProps {
  config: ChurchConfig;
}

export default function FloatingWhatsApp({ config }: FloatingWhatsAppProps) {
  const handleWhatsappClick = () => {
    const text = "Graça e Paz! Visitei o site oficial da MCI Vila Velha e gostaria de obter mais informações sobre a igreja e os cultos.";
    const whatsappNum = config.whatsapp || "5527996952801";
    window.open(`https://wa.me/${whatsappNum}?text=${encodeURIComponent(text)}`, "_blank");
  };

  return (
    <button
      onClick={handleWhatsappClick}
      className="fixed bottom-6 right-6 z-30 p-4 bg-[#25D366] hover:bg-[#20BA5A] text-white rounded-full shadow-[0_8px_32px_rgba(37,211,102,0.35)] hover:scale-110 active:scale-95 transition-all cursor-pointer flex items-center justify-center animate-bounce group"
      style={{ animationDuration: "3s" }}
      title="Fale Conosco pelo WhatsApp"
    >
      <MessageCircle className="w-6 h-6 fill-white text-[#25D366]" />
      {/* Floating text badge */}
      <span className="absolute right-14 bg-[#0A2424]/95 backdrop-blur-md text-[#E0F8F8] border border-gold/25 text-[9px] uppercase font-display tracking-widest font-bold py-1.5 px-3 rounded-sm shadow-xl opacity-0 group-hover:opacity-100 transition duration-300 pointer-events-none whitespace-nowrap">
        Suporte Whatsapp
      </span>
    </button>
  );
}
