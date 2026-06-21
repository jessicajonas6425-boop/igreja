import { motion } from "motion/react";
import { Sparkles, Compass, Flame, ShoppingBag, Eye, Heart, HelpCircle } from "lucide-react";
import { ChurchConfig } from "../types";

interface GeracaoSantaProps {
  config: ChurchConfig;
  onNavigate: (sectionId: string) => void;
}

export default function GeracaoSanta({ config, onNavigate }: GeracaoSantaProps) {
  const shirts = [
    {
      id: "shirt-gs-1",
      name: "Camisa Streetwear Oversized Preta",
      edition: "Coleção Streetwear - Off-Black",
      description: "Modelagem streetwear premium, malha robusta 100% algodão fio 30.1 penteado para caimento perfeito e durabilidade extrema.",
      image: "https://i.postimg.cc/02JQXMdy/725648117-1309203004251851-4126246104645338812-n.jpg",
      badge: "Premium"
    },
    {
      id: "shirt-gs-2",
      name: "Moletom / T-Shirt Streetwear Off-White",
      edition: "Coleção Streetwear - Pure Off-White",
      description: "Design contemporâneo minimalista e elegante. Detalhes icônicos nas costas que comunicam propósito e ousadia espiritual.",
      image: "https://i.postimg.cc/02JQXMdj/726016132-2586244968444639-2377671953930966526-n.jpg",
      badge: "Lançamento"
    },
    {
      id: "shirt-gs-3",
      name: "T-Shirt Streetwear Sand Fire",
      edition: "Coleção Streetwear - Special Edition",
      description: "Modelagem americana, tom de areia terroso super confortável de alta gramatura. Arte exclusiva representando o fogo da nossa geração.",
      image: "https://i.postimg.cc/m2FDpzNh/727586530-1524206392717488-265326593722776445-n.jpg",
      badge: "Exclusivo"
    }
  ];

  const highlights = [
    {
      icon: <Flame className="w-5 h-5 text-gold" />,
      title: "Coração Incendiado",
      content: "Nossa paixão é Jesus. Não aceitamos um evangelho morno; buscamos avivamento ativo, adoração e profunda intimidade com Deus."
    },
    {
      icon: <Sparkles className="w-5 h-5 text-gold" />,
      title: "Cultura Jovem Relevante",
      content: "Somos sintonizados com música moderna, design, arte e tendências, mostrando que viver com Deus é atual, dinâmico e extraordinário."
    },
    {
      icon: <Compass className="w-5 h-5 text-gold" />,
      title: "Propósito e Santidade",
      content: "Geração Santa não é apenas um nome. É o nosso compromisso de viver contra a correnteza deste mundo, guardando o coração para cumprir o destino."
    }
  ];

  const handleOrderShirt = (shirtName: string) => {
    const message = `Olá! Vi no site oficial e gostaria de encomendar a camisa Geração Santa: *${shirtName}*. Como posso efetuar a compra?`;
    window.open(`https://wa.me/${config.whatsapp || '5527996952801'}?text=${encodeURIComponent(message)}`, "_blank");
  };

  return (
    <section id="geracao-santa" className="py-24 bg-sophisticated-dark relative overflow-hidden border-t border-white/5 text-left">
      
      {/* Background Graphic Flare effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gold/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-gold-dark/3 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        
        {/* Header Title with Custom Gold Badge */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-1.5 bg-gold/10 border border-gold/30 px-3.5 py-1.5 rounded-sm text-xs text-gold uppercase font-display tracking-widest mb-2 shadow-lg font-bold">
            🔥 Ministério Jovem
          </div>
          
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-white uppercase italic">
            GERAÇÃO <span className="text-gold not-italic font-sans font-black tracking-tight">SANTA.</span>
          </h2>
          
          <div className="h-[1px] w-24 bg-gold mx-auto" />
          
          <p className="text-zinc-400 text-sm sm:text-base leading-relaxed font-light">
            Não somos apenas um grupo de jovens. Somos uma geração de inconformados, dispostos a carregar a glória de Deus e impactar Vila Velha!
          </p>
        </div>

        {/* Narrative & Highlights Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-20 text-left">
          
          {/* Column 1: Story / Vision */}
          <div className="lg:col-span-6 space-y-6">
            <h3 className="text-2xl sm:text-3xl font-bold font-display text-white tracking-widest uppercase">
              NOSSA IDENTIDADE E VISÃO
            </h3>
            
            <p className="text-zinc-350 font-light text-sm sm:text-base leading-relaxed font-serif italic">
              {config.gsText || "O Geração Santa une música contemporânea, comunhão real e paixão pelo Espírito Santo. Nossos cultos aos sábados são repletos de adoração compromissada, mensagens fortes e um ambiente excelente para fazer novos amigos e consolidar sua caminhada cristã."}
            </p>

            <div className="p-5 rounded-sm bg-[#0A2424]/80 backdrop-blur-sm border border-gold/15">
              <span className="text-gold text-[10px] font-display font-bold tracking-[0.15em] uppercase block mb-1">
                A Grande Visão
              </span>
              <p className="text-zinc-450 text-xs leading-relaxed italic font-serif">
                "{config.gsVision || "Consolidar uma juventude viva, espiritualmente sensível e socialmente responsável, estabelecendo uma herança que permanecerá por gerações."}"
              </p>
            </div>

            {/* Quick list highlight cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
              {highlights.map((h, i) => (
                <div key={i} className="bg-[#0A2424]/70 backdrop-blur-sm p-4 rounded-sm border border-gold/15 flex flex-col space-y-2 shadow-md">
                  <div className="p-2 self-start rounded-sm bg-white/5 border border-white/10 text-gold">
                    {h.icon}
                  </div>
                  <h4 className="text-[11px] font-bold font-display text-white uppercase tracking-wider">{h.title}</h4>
                  <p className="text-[10px] text-zinc-500 leading-relaxed font-light">{h.content}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Column 2: Creative Youth Atmosphere photo */}
          <div className="lg:col-span-6 relative">
            <div className="absolute -inset-1 rounded-sm bg-gold/10 opacity-35 blur-xl pointer-events-none" />
            <div className="relative rounded-sm overflow-hidden shadow-2xl border border-gold/15 bg-[#0A2424]/80 backdrop-blur-sm p-2.5">
              <img
                src="https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?auto=format&fit=crop&w=800&q=80"
                alt="Culto Jovem Geração Santa"
                className="rounded-sm w-full object-cover h-64 sm:h-96 filter brightness-90 saturate-110"
                referrerPolicy="no-referrer"
              />
              {/* Overlay visual status */}
              <div className="absolute bottom-5 left-5 right-5 p-4 bg-sophisticated-dark/95 border border-gold/15 rounded-sm text-left">
                <span className="text-[10px] font-display text-gold uppercase tracking-[0.2em] block font-bold">
                  Próximo Encontro
                </span>
                <p className="text-white text-xs sm:text-sm font-bold mt-1 uppercase font-display tracking-wider">
                  Sábado, às 19:30h — Traga suas expectativas altas!
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Shirts Showcase / Camisas da Igreja Section */}
        <div className="pt-12 border-t border-white/10">
          
          <div className="text-center max-w-xl mx-auto mb-12 space-y-3">
            <span className="text-gold font-display tracking-[0.25em] text-[10px] uppercase block font-bold">
              Veste A Identidade
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-white tracking-widest font-display uppercase">
              NOSSAS CAMISAS (ECO-STREETWEAR)
            </h3>
            <p className="text-zinc-500 text-xs font-light">
              Nossas t-shirts são criadas com modelagem unissex especial, feitas sob medida para você demonstrar a fé e pertencer ao movimento. Encomende a sua pelo WhatsApp!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {shirts.map((shirt) => (
              <motion.div
                key={shirt.id}
                whileHover={{ y: -4 }}
                className="relative bg-[#0A2424]/80 backdrop-blur-sm rounded-sm overflow-hidden border border-gold/15 hover:border-gold/35 transition-all duration-300 text-left flex flex-col h-full shadow-xl"
              >
                
                {/* Image panel with underlay blur - no clipping or cropping */}
                <div className="relative aspect-[3/4] overflow-hidden bg-black/40 flex items-center justify-center">
                  <div 
                    className="absolute inset-0 bg-cover bg-center filter blur-lg opacity-35 select-none scale-105 pointer-events-none"
                    style={{ backgroundImage: `url('${shirt.image}')` }}
                  />
                  <img
                    src={shirt.image}
                    alt={shirt.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-contain relative z-10 filter brightness-95"
                  />
                  
                  {/* Badge */}
                  <span className="absolute top-4 left-4 z-20 text-[9px] font-display font-bold uppercase tracking-widest bg-gold text-black px-2.5 py-1.5 rounded-sm shadow-md">
                    {shirt.badge}
                  </span>
                </div>

                {/* Content Panel */}
                <div className="p-6 flex flex-col justify-between flex-grow space-y-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-sans font-bold text-gold uppercase tracking-widest">
                      {shirt.edition}
                    </span>
                    <h4 className="text-base font-bold text-white tracking-wider font-display uppercase">
                      {shirt.name}
                    </h4>
                    <p className="text-xs text-zinc-400 font-light leading-relaxed pt-1.5">
                      {shirt.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-white/5">
                    <button
                      onClick={() => handleOrderShirt(shirt.name)}
                      className="w-full py-3.5 text-[10px] font-bold uppercase tracking-widest bg-gradient-to-r from-gold to-gold-dark text-black hover:brightness-110 rounded-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md font-display"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" /> ADQUIRIR CAMISA
                    </button>
                  </div>
                </div>

              </motion.div>
            ))}
          </div>

        </div>

      </div>

    </section>
  );
}
