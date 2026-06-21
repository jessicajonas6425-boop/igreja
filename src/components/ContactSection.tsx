import React, { useState } from "react";
import { motion } from "motion/react";
import { MapPin, Phone, Mail, Clock, Send, MessageSquare } from "lucide-react";
import { ChurchConfig } from "../types";

interface ContactSectionProps {
  config: ChurchConfig;
}

export default function ContactSection({ config }: ContactSectionProps) {
  const [userName, setUserName] = useState("");
  const [userMsg, setUserMsg] = useState("");

  const handleWhatsappSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim() || !userMsg.trim()) {
      alert("Por favor digite seu nome e sua mensagem.");
      return;
    }

    const message = `Olá, meu nome é *${userName.trim()}*. Estou enviando uma mensagem pelo site oficial da MCI Vila Velha:\n\n"${userMsg.trim()}"`;
    const whatsappNumber = config.whatsapp || "5527996952801";
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, "_blank");
    
    setUserName("");
    setUserMsg("");
  };

  return (
    <section id="contato" className="py-24 bg-sophisticated-dark relative overflow-hidden border-t border-white/5 text-left">
      
      {/* Background visual graphics */}
      <div className="absolute top-1/2 left-0 w-80 h-80 bg-gold/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-10 w-80 h-80 bg-gold-dark/3 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-gold font-display tracking-[0.3em] text-xs font-bold uppercase block">
            Fale Conosco
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-white uppercase italic">
            CONTATO E <span className="text-gold not-italic font-sans font-black tracking-tight">LOCALIZAÇÃO.</span>
          </h2>
          <div className="h-[1px] w-24 bg-gold mx-auto" />
          <p className="text-zinc-400 text-sm sm:text-base leading-relaxed font-light">
            Tem alguma dúvida, precisa de oração ou quer nos fazer uma visita? Entre em contato. Estamos de braços abertos para te receber!
          </p>
        </div>

        {/* Info & Form Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
          
          {/* Column 1: Contact Detail Card */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6 text-left">
            
            <div className="bg-[#0A2424]/80 backdrop-blur-sm border border-gold/10 rounded-sm p-6 sm:p-8 space-y-6 flex-grow shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-full blur-2xl pointer-events-none" />
              
              <h3 className="text-xs font-bold font-display text-white uppercase tracking-widest border-b border-white/5 pb-3 flex items-center gap-2">
                🏠 Secretaria da Igreja
              </h3>

              <div className="space-y-5">
                {/* 1. Address */}
                <div className="flex gap-4 items-start">
                  <div className="p-2.5 bg-white/5 border border-white/10 rounded-sm mt-1 flex-shrink-0 text-gold shadow-sm">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[9px] font-display text-zinc-500 uppercase tracking-wider block">Endereço Principal</span>
                    <p className="text-xs sm:text-sm text-zinc-200 mt-0.5 leading-relaxed font-serif italic">
                      {config.address || "Avenida Presidente Kennedy, 99 - Barramares, Vila Velha, ES"}
                    </p>
                  </div>
                </div>

                {/* 2. Phone */}
                <div className="flex gap-4 items-start">
                  <div className="p-2.5 bg-white/5 border border-white/10 rounded-sm mt-1 flex-shrink-0 text-gold shadow-sm">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[9px] font-display text-zinc-500 uppercase tracking-wider block">Secretaria / Ouvidoria</span>
                    <p className="text-xs sm:text-sm text-zinc-200 mt-0.5 font-mono">
                      {config.phone || "(27) 99695-2801"}
                    </p>
                  </div>
                </div>

                {/* 3. Email */}
                <div className="flex gap-4 items-start">
                  <div className="p-2.5 bg-white/5 border border-white/10 rounded-sm mt-1 flex-shrink-0 text-gold shadow-sm">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[9px] font-display text-zinc-500 uppercase tracking-wider block">E-mail para Contatos</span>
                    <p className="text-xs sm:text-sm text-zinc-200 mt-0.5 font-mono">
                      {config.email || "igrejamcivilavelha@gmail.com"}
                    </p>
                  </div>
                </div>

                {/* 4. Meetings Times */}
                <div className="flex gap-4 items-start pt-4 border-t border-white/5">
                  <div className="p-2.5 bg-white/5 border border-white/10 rounded-sm mt-1 flex-shrink-0 text-gold shadow-sm">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[9px] font-display text-zinc-500 uppercase tracking-wider block">Horários dos Cultos</span>
                    <div className="text-xs text-zinc-400 mt-1 space-y-1">
                      <p><strong className="text-white font-display uppercase tracking-wider text-[10px]">Sábado às 19:30h</strong> — Culto GS Jovem</p>
                      <p><strong className="text-white font-display uppercase tracking-wider text-[10px]">Domingo às 18:00h</strong> — Culto de Celebração Familiar</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Column 2: WhatsApp quick contact form & interactive map mockup */}
          <div className="lg:col-span-7 flex flex-col space-y-6">
            
            {/* Quick WhatsApp helper Form */}
            <div className="bg-[#0A2424]/80 backdrop-blur-sm border border-gold/10 p-6 sm:p-8 rounded-sm text-left shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-full blur-2xl pointer-events-none" />
              
              <h3 className="text-sm font-bold font-display text-white uppercase tracking-widest mb-6 pb-2 border-b border-white/5 flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-gold" /> Envie WhatsApp Instantâneo
              </h3>

              <form onSubmit={handleWhatsappSend} className="space-y-4">
                <div>
                  <label className="text-[9px] font-display text-zinc-500 uppercase block mb-1.5 font-bold tracking-wider">Seu Nome Completo</label>
                  <input
                    type="text"
                    placeholder="Ex: Clara Mendes"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 focus:border-gold/50 rounded-sm py-3.5 px-4 text-white text-xs outline-none transition font-sans"
                    required
                  />
                </div>

                <div>
                  <label className="text-[9px] font-display text-zinc-500 uppercase block mb-1.5 font-bold tracking-wider font-semibold">Sua Mensagem ou Pedido de Oração</label>
                  <textarea
                    rows={3}
                    placeholder="Escreva sua mensagem com carinho..."
                    value={userMsg}
                    onChange={(e) => setUserMsg(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 focus:border-gold/50 rounded-sm p-4 text-white text-xs outline-none transition font-sans"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="px-5 py-3.5 bg-gradient-to-r from-gold to-gold-dark text-black font-bold text-xs uppercase tracking-widest rounded-sm shadow-md cursor-pointer flex items-center gap-1.5 transition-all w-full justify-center hover:brightness-110 active:scale-95 font-display"
                >
                  <Send className="w-3.5 h-3.5" /> Enviar Mensagem para a Liderança
                </button>
              </form>
            </div>

            {/* Embedded maps mock visual presentation card */}
            <div className="relative rounded-sm overflow-hidden shadow-2xl h-56 border border-gold/10 group">
              <div 
                className="absolute inset-0 bg-cover bg-center filter grayscale contrast-125 brightness-75 group-hover:scale-105 transition-transform duration-500 pointer-events-none"
                style={{ 
                  backgroundImage: `url('https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=800&q=80')` 
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-[#051414] via-[#051414]/60 to-transparent" />
              
              <div className="absolute inset-0 p-5 flex flex-col justify-between text-left relative z-10">
                <span className="text-[9px] font-display font-medium tracking-widest uppercase bg-black/80 border border-gold/20 text-gold px-2.5 py-1 rounded-sm inline-block self-start">
                  🗺️ Como Chegar
                </span>

                <div className="space-y-1.5">
                  <h4 className="text-base font-bold text-white uppercase tracking-widest font-display">Avenida Presidente Kennedy, 99</h4>
                  <p className="text-[11px] text-zinc-400 font-light mt-0.5 leading-relaxed max-w-sm font-serif italic">
                    Localizada no bairro Barramares, em Vila Velha. Venha compartilhar conosco! Use o Google Maps ou Waze facilmente apontando para o endereço.
                  </p>
                  
                  <a
                    href="https://maps.google.com/?q=Avenida+Presidente+Kennedy,+99+-+Barramares,+Vila+Velha+-+ES"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 px-4 py-2 bg-white/5 border border-white/20 text-white hover:bg-white/10 text-[10px] font-bold uppercase tracking-widest rounded-sm transition-all font-display"
                  >
                    Abrir no Navegador GPS
                  </a>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>

    </section>
  );
}
