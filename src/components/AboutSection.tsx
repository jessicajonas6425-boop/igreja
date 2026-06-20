import { motion } from "motion/react";
import { Heart, Compass, Shield, Users, Flame, Star } from "lucide-react";

export default function AboutSection() {
  const values = [
    {
      icon: <Users className="w-5 h-5 text-gold" />,
      title: "Comunhão Genuína",
      description: "Acreditamos que a igreja é uma família. Valorizamos relacionamentos saudáveis, adoração intencional e a integração de todos no corpo de Cristo."
    },
    {
      icon: <Flame className="w-5 h-5 text-gold" />,
      title: "Louvor & Adoração",
      description: "Buscamos uma adoração fervorosa e autêntica. Desejamos que cada momento de adoração seja uma porta aberta para a presença manifesta do Espírito Santo."
    },
    {
      icon: <Compass className="w-5 h-5 text-gold" />,
      title: "Palavra de Impacto",
      description: "Comprometidos com o ensino bíblico claro, prático e guiado pelo Espírito. Mensagens que trazem revelação, sabedoria e transformação de vida."
    },
    {
      icon: <Star className="w-5 h-5 text-gold" />,
      title: "Sacerdócio de Todos",
      description: "Cremos que cada pessoa carrega uma identidade de filho e um chamado divino. Estimulamos todos a descobrirem, desenvolverem e aplicarem seus dons."
    }
  ];

  return (
    <section id="sobre-nos" className="py-24 bg-sophisticated-dark relative overflow-hidden text-left border-t border-white/5">
      
      {/* Decorative refined elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gold/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gold-dark/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-gold font-display tracking-[0.3em] text-xs font-bold uppercase block">
            Nossa Essência
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-white uppercase italic">
            QUEM SOMOS <span className="text-gold not-italic font-sans font-black tracking-tight">NÓS.</span>
          </h2>
          <div className="h-[1px] w-24 bg-gold mx-auto" />
          <p className="text-zinc-400 text-sm sm:text-base leading-relaxed font-light">
            A Igreja MCI Vila Velha é um lugar para pertencer. Nascemos sob uma visão de expressar o coração do Pai através de um evangelho alegre, disculado comprometido e serviço de excelência.
          </p>
        </div>

        {/* Narrative Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-20">
          
          {/* Collage mockup / Rich Graphic Representation */}
          <div className="lg:col-span-5 relative order-last lg:order-first">
            <div className="absolute -inset-1 rounded-sm bg-gradient-to-tr from-gold to-gold-dark opacity-10 blur-xl" />
            <div className="relative rounded-sm overflow-hidden shadow-2xl border border-white/10 bg-[#0A0C14] p-3">
              <img
                src="https://images.unsplash.com/photo-1544427920-c49ccfb85579?auto=format&fit=crop&w=800&q=80"
                alt="Comunhão e Celebração"
                className="rounded-sm w-full object-cover h-64 sm:h-80 shadow-inner filter brightness-90 contrast-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-x-3 bottom-3 p-5 bg-gradient-to-t from-[#05070A] via-[#05070A]/90 to-transparent rounded-b-sm text-left">
                <span className="text-[10px] font-display text-gold uppercase tracking-[0.2em] font-bold block">
                  Visão Pastoral
                </span>
                <p className="text-white/80 text-xs sm:text-sm mt-1.5 leading-relaxed font-serif italic">
                  "Nosso maior tesouro são as pessoas que Deus nos confia. Cada sorriso, história e transformação reflete o amor de Jesus."
                </p>
              </div>
            </div>

            {/* Float accent badge */}
            <div className="absolute -top-4 -right-4 bg-[#0A0C14] border border-white/15 p-4 rounded-sm shadow-2xl flex items-center gap-2.5 transform rotate-3 hover:translate-y-0.5 transition duration-300">
              <span className="text-xl">🔥</span>
              <div className="text-left">
                <span className="text-white font-bold text-xs uppercase tracking-wider font-display block">Avivamento Real</span>
                <span className="text-gold text-[10px] block font-mono font-medium">Ação do Espírito Santo</span>
              </div>
            </div>
          </div>

          {/* Corporate Texts */}
          <div className="lg:col-span-7 flex flex-col space-y-6 text-left">
            <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-widest uppercase font-display border-b border-white/5 pb-2">
              UM EVANGELHO DE AMOR, PODER E GRAÇA
            </h3>
            
            <p className="text-zinc-300 leading-relaxed font-normal text-sm sm:text-base font-serif italic">
              Acreditamos que o amor de Deus é incondicional e tem o poder de resgatar, curar e guiar o ser humano. Nossa missão na comunidade de Barramares e arredores em Vila Velha é nos posicionarmos como um ponto de luz, esperança e restauração.
            </p>

            <p className="text-zinc-400 leading-relaxed font-light text-sm">
              Seja você um cristão de longa data procurando um corpo ativo para servir e adorar, ou alguém com dúvidas sinceras sobre a fé e a vida buscando respostas com respeito — você encontrará um lugar de acolhimento quente e genuíno nos nossos cultos e células de cuidado.
            </p>

            {/* Mission/Vision Box */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <div className="bg-[#0A0C14] border border-white/10 p-5 rounded-sm shadow-xl">
                <span className="text-gold text-xs font-bold font-display tracking-[0.15em] uppercase block mb-1.5">Missão</span>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Anunciar as Boas Novas de Cristo, promover discipulado prático, amar os necessitados e edificar famílias sadias em santidade.
                </p>
              </div>
              <div className="bg-[#0A0C14] border border-white/10 p-5 rounded-sm shadow-xl">
                <span className="text-white/90 text-xs font-bold font-display tracking-[0.15em] uppercase block mb-1.5">Visão</span>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Ser uma igreja de impacto, cheia do Espírito Santo, relevante na Grande Vitória e reconhecida pela excelência no amor e cuidado integral das pessoas.
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Section Core Values List */}
        <div className="pt-8 border-t border-white/10">
          <h4 className="text-[10px] font-display text-zinc-450 uppercase tracking-[0.25em] text-center mb-10 font-bold">
            Nossos Valores Fundamentais
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -4 }}
                className="p-6 rounded-sm bg-[#0A0C14] border border-white/10 hover:border-gold/30 transition duration-300 text-left flex flex-col space-y-4 shadow-xl"
              >
                <div className="p-2.5 self-start rounded-sm bg-white/5 border border-white/10 text-gold shadow-sm">
                  {v.icon}
                </div>
                <h5 className="text-sm font-bold font-display text-white tracking-widest uppercase">
                  {v.title}
                </h5>
                <p className="text-xs text-zinc-400 leading-relaxed font-light">
                  {v.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

      </div>

    </section>
  );
}
