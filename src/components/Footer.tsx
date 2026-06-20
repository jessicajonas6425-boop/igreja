import { Heart, Instagram, Facebook, Youtube, ShieldAlert, ArrowUp } from "lucide-react";
import { ChurchConfig } from "../types";

interface FooterProps {
  config: ChurchConfig;
  onNavigate: (sectionId: string) => void;
  onToggleAdmin?: () => void;
}

export default function Footer({ config, onNavigate, onToggleAdmin }: FooterProps) {
  
  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-sophisticated-dark border-t border-white/5 pt-16 pb-8 text-left relative overflow-hidden font-sans">
      
      {/* Visual background fade element */}
      <div className="absolute bottom-0 left-0 right-0 h-44 bg-gradient-to-t from-gold/3 via-transparent to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        
        {/* Core Layout Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Logo Brand Panel */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3 cursor-pointer group" onClick={handleScrollTop}>
              <div className="relative">
                <div className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-gold to-gold-dark opacity-50 blur group-hover:opacity-75 transition-opacity" />
                <img
                  src="https://i.postimg.cc/Y9q0dd8Z/726996325-1036680408784033-7332466181714466935-n.jpg"
                  alt="Igreja MCI"
                  referrerPolicy="no-referrer"
                  className="relative w-12 h-12 object-cover rounded-full border border-gold/30"
                />
              </div>
              <div>
                <span className="text-base font-black tracking-widest text-white uppercase block font-display">
                  MCI VILA VELHA
                </span>
                <span className="text-[9px] font-display text-gold tracking-[0.2em] block font-bold">
                  UM LUGAR PARA PERTENCER
                </span>
              </div>
            </div>

            <p className="text-zinc-400 text-xs sm:text-sm font-light leading-relaxed max-w-sm">
              Nossa visão é amar as pessoas de forma prática, pregar a Palavra com integridade e avivar a juventude de Vila Velha e região metropolitana do Espírito Santo.
            </p>

            {/* Social Network Circles */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href={`https://instagram.com/${config.instagram || 'igrejamcivilavelha'}`}
                target="_blank"
                rel="noreferrer"
                className="p-2.5 bg-white/5 hover:bg-gold border border-white/10 text-gold hover:text-black rounded-sm transition-all shadow cursor-pointer"
                title="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>

              <a
                href={`https://facebook.com/${config.facebook || 'igrejamcivilavelha'}`}
                target="_blank"
                rel="noreferrer"
                className="p-2.5 bg-white/5 hover:bg-gold border border-white/10 text-gold hover:text-black rounded-sm transition-all shadow cursor-pointer"
                title="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>

              <a
                href={`https://youtube.com/${config.youtube || '@igrejamcivilavelha'}`}
                target="_blank"
                rel="noreferrer"
                className="p-2.5 bg-white/5 hover:bg-gold border border-white/10 text-gold hover:text-black rounded-sm transition-all shadow cursor-pointer"
                title="Youtube oficial"
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="text-[10px] font-display font-bold text-white uppercase tracking-widest pb-1 border-b border-white/5">Navegação</h4>
            <div className="flex flex-col gap-2.5 text-xs">
              <button 
                onClick={() => onNavigate("home")} 
                className="text-zinc-400 hover:text-gold transition-colors text-left font-light cursor-pointer font-sans"
              >
                Início (Home)
              </button>
              <button 
                onClick={() => onNavigate("sobre-nos")} 
                className="text-zinc-400 hover:text-gold transition-colors text-left font-light cursor-pointer font-sans"
              >
                Sobre Nós
              </button>
              <button 
                onClick={() => onNavigate("eventos")} 
                className="text-zinc-400 hover:text-gold transition-colors text-left font-light cursor-pointer font-sans"
              >
                Eventos e Cultos
              </button>
              <button 
                onClick={() => onNavigate("geracao-santa")} 
                className="text-zinc-400 hover:text-gold transition-colors text-left font-light cursor-pointer font-sans"
              >
                Geração Santa (Jovens)
              </button>
              <button 
                onClick={() => onNavigate("membros")} 
                className="text-zinc-400 hover:text-gold transition-colors text-left font-light cursor-pointer font-sans"
              >
                Área do Membro
              </button>
              <button 
                onClick={() => onNavigate("contato")} 
                className="text-zinc-400 hover:text-gold transition-colors text-left font-light cursor-pointer font-sans"
              >
                Contato & Endereço
              </button>
            </div>
          </div>

          {/* Location details */}
          <div className="md:col-span-4 space-y-4">
            <h4 className="text-[10px] font-display font-bold text-white uppercase tracking-widest pb-1 border-b border-white/5">Endereço & Expediente</h4>
            <div className="space-y-3.5 text-xs text-zinc-400 font-light leading-relaxed">
              <p className="font-serif italic text-zinc-300">
                {config.address || "Avenida Presidente Kennedy, 99 - Barramares, Vila Velha, ES"}
              </p>
              
              <div className="pt-3 border-t border-white/5 space-y-1 font-display uppercase tracking-wider text-[9px]">
                <p>Cultos aos Sábados: <strong className="text-white">19:30h</strong> — JOVENS</p>
                <p>Cultos aos Domingos: <strong className="text-white">18:00h</strong> — FAMÍLIA</p>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Credits with To-Top scroll button */}
        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] text-zinc-500 font-display uppercase tracking-widest">
          <p>
            &copy; {currentYear} IGREJA MCI VILA VELHA. Todos os direitos reservados.
          </p>

          {onToggleAdmin && (
            <button
              id="btn-footer-admin"
              onClick={onToggleAdmin}
              className="text-[10px] font-display font-bold text-zinc-400 hover:text-gold transition-colors tracking-widest uppercase cursor-pointer flex items-center gap-1.5"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              PAINEL DO ADMIN
            </button>
          )}

          <p className="flex items-center gap-1.5 lowercase font-serif italic text-zinc-400 normal-case">
            Criado com <Heart className="w-3 h-3 text-gold animate-pulse fill-gold" /> para a glória de Deus.
          </p>

          <button
            onClick={handleScrollTop}
            className="p-2.5 bg-white/5 hover:bg-gold border border-white/10 hover:text-black text-gold rounded-sm transition-all flex items-center justify-center cursor-pointer shadow-md"
            title="Voltar ao Topo"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>

      </div>

    </footer>
  );
}
