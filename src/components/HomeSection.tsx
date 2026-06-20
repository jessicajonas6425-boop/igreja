import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, BookOpen, Heart, Calendar, ArrowLeft, Shirt, Eye } from "lucide-react";
import { doc, onSnapshot, collection, query, limit, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { ChurchConfig, DailyVerse } from "../types";

interface HomeSectionProps {
  onNavigate: (sectionId: string) => void;
  onOpenAuth: () => void;
  config: ChurchConfig;
}

export default function HomeSection({ onNavigate, onOpenAuth, config }: HomeSectionProps) {
  const [verse, setVerse] = useState<DailyVerse>({
    id: "default",
    text: "E conhecereis a verdade, e a verdade vos libertará.",
    reference: "João 8:32",
    dateString: ""
  });
  const [carouselIndex, setCarouselIndex] = useState(0);

  // Default images of church events and shirts
  const carouselItems = [
    {
      title: "Cultos Inspiradores",
      description: "Ambiente repleto de fé, adoração apaixonada e ensinamento profundo da Bíblia.",
      image: "https://i.postimg.cc/QxrtPN65/725024930-1734240047760327-421770373615123641-n.jpg",
      badge: "Comunhão"
    },
    {
      title: "Células Semanais",
      description: "A igreja se reúne nos lares para compartilhar a vida, aprender e apoiar uns aos outros.",
      image: "https://i.postimg.cc/vHdBj8PX/725159316-1960375482032646-7561917714667721549-n.jpg",
      badge: "Crescimento"
    },
    {
      title: "Ministério Geração Santa",
      description: "Estilo e propósito alinhados. Viva a identidade e o poder do nosso ministério jovem!",
      image: "https://i.postimg.cc/8PV53kyb/725318273-3060397824170772-6348945460884155426-n.jpg",
      badge: "Geração Santa"
    }
  ];

  useEffect(() => {
    // 1. Fetch Today's Daily Verse or get first available from DB
    const versesRef = collection(db, "versiculos_diarios");
    const unsubscribeVerse = onSnapshot(versesRef, (snapshot) => {
      if (!snapshot.empty) {
        // Find if there is a verse matching today's date
        const today = new Date().toISOString().split("T")[0];
        const match = snapshot.docs.find(d => d.data().dateString === today);
        if (match) {
          setVerse({ id: match.id, ...match.data() } as DailyVerse);
        } else {
          // get the first available
          const first = snapshot.docs[0];
          setVerse({ id: first.id, ...first.data() } as DailyVerse);
        }
      }
    });

    // Auto rotate carousel every 6s
    const timer = setInterval(() => {
      setCarouselIndex((prev) => (prev + 1) % carouselItems.length);
    }, 6000);

    return () => {
      unsubscribeVerse();
      clearInterval(timer);
    };
  }, []);

  const handleNextCarousel = () => {
    setCarouselIndex((prev) => (prev + 1) % carouselItems.length);
  };

  const handlePrevCarousel = () => {
    setCarouselIndex((prev) => (prev - 1 + carouselItems.length) % carouselItems.length);
  };

  return (
    <section id="home" className="relative min-h-screen flex flex-col justify-between pt-24 overflow-hidden bg-sophisticated-dark select-none">
      
      {/* Sky Background Image Overlay matching the Design HTML */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-sophisticated-dark via-sophisticated-dark/70 to-transparent z-10"></div>
        <img 
          src={config.introCeuUrl || "https://i.postimg.cc/ZYPZW8c3/726838928-841485378789522-8854248702185838387-n.jpg"} 
          className="w-full h-full object-cover opacity-25" 
          alt="Céu"
          referrerPolicy="no-referrer"
        />
      </div>

      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:28px_28px] pointer-events-none z-10" />

      {/* Hero Content Grid */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-12 pb-16 w-full flex-grow flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Column 1: Core text & primary triggers */}
          <div className="lg:col-span-7 flex flex-col space-y-6 sm:space-y-8 text-left">
            
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex self-start items-center gap-2 mb-2"
            >
              <span className="w-12 h-[1px] bg-gold"></span>
              <span className="text-gold uppercase tracking-[0.3em] text-xs font-bold font-display">
                Bem-vindo à Casa / Vila Velha
              </span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="space-y-4"
            >
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif text-white leading-none tracking-tight uppercase">
                UM LUGAR PARA <br />
                <span className="text-gold font-sans font-black tracking-tight not-italic">PERTENCER.</span>
              </h1>
              
              <p className="text-white/70 text-base sm:text-lg leading-relaxed max-w-xl font-serif italic">
                "Pois eu sei os planos que tenho para vocês", diz o Senhor, "planos de fazê-los prosperar e não de lhes causar dano, planos de dar a vocês esperança e um futuro." — Jeremias 29:11
              </p>
            </motion.div>

            {/* CTAs with custom-shaped buttons from Sophisticated design */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-wrap gap-4 pt-2"
            >
              <button
                onClick={() => onNavigate("membros")}
                className="px-8 py-4 bg-gradient-to-r from-gold to-gold-dark text-black font-bold uppercase text-xs tracking-widest rounded-sm transition-all hover:brightness-110 shadow-lg active:scale-95 cursor-pointer flex items-center gap-2 group font-display"
              >
                Faça Seu Cadastro
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <button
                onClick={() => onNavigate("eventos")}
                className="px-8 py-4 bg-white/5 border border-white/20 text-white font-bold uppercase text-xs tracking-widest rounded-sm hover:bg-white/10 transition-all flex items-center gap-2 cursor-pointer font-display"
              >
                <Calendar className="w-3.5 h-3.5 text-gold" />
                Ver Programação
              </button>
            </motion.div>

            {/* Quick stats with gold styling */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="grid grid-cols-2 sm:grid-cols-3 gap-6 pt-6 border-t border-white/10"
            >
              <div className="flex flex-col">
                <span className="text-2xl sm:text-3xl font-black text-gold font-display">18:00h</span>
                <span className="text-[10px] font-display text-zinc-400 uppercase tracking-[0.2em] mt-1">Culto Domingo</span>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl sm:text-3xl font-black text-white/90 font-display">19:30h</span>
                <span className="text-[10px] font-display text-zinc-400 uppercase tracking-[0.2em] mt-1">Sábado (Jovem)</span>
              </div>
              <div className="flex flex-col col-span-2 sm:col-span-1">
                <span className="text-2xl sm:text-3xl font-black text-gold-dark font-display">Barramares</span>
                <span className="text-[10px] font-display text-zinc-400 uppercase tracking-[0.2em] mt-1">Vila Velha - ES</span>
              </div>
            </motion.div>

          </div>

          {/* Column 2: Interactive Verse of the Day Card & Rotating Visualizer */}
          <div className="lg:col-span-5 flex flex-col space-y-8 z-10">
            
            {/* Real-time Daily Verse Card with Sophisticated borders */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative p-6 bg-white/5 border-l-2 border-gold border-y border-r border-[#ffffff0a] overflow-hidden shadow-2xl rounded-sm"
            >
              {/* Background glowing ring */}
              <div className="absolute -right-16 -top-16 w-36 h-36 rounded-full bg-gold/5 blur-2xl pointer-events-none" />

              <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/5">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-3.5 h-3.5 text-gold" />
                  <span className="text-[10px] font-display font-bold uppercase tracking-widest text-[#D4AF37]">
                    Versículo do Dia
                  </span>
                </div>
                <span className="text-[9px] font-display font-medium bg-[#D4AF37]/10 text-gold px-2 py-0.5 rounded-sm">
                  Palavra Viva
                </span>
              </div>

              <blockquote className="text-white/80 text-sm sm:text-base italic leading-relaxed text-left font-serif">
                "{verse.text}"
              </blockquote>
              
              <div className="mt-4 flex justify-between items-center">
                <span className="text-gold font-display text-xs font-bold tracking-widest uppercase">
                  — {verse.reference}
                </span>
                <div className="h-[1px] flex-grow bg-gradient-to-r from-transparent via-white/5 to-transparent mx-4" />
                <button 
                  onClick={() => onNavigate("membros")}
                  className="text-[10px] font-display text-zinc-400 hover:text-gold flex items-center gap-1 transition duration-200 cursor-pointer uppercase tracking-wider font-semibold"
                >
                  Ler Mais <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </motion.div>

            {/* Rotating Hero Carousel (Events & Ministry Shirts/Camisas) */}
            <div className="relative overflow-hidden group border border-white/10 bg-[#0A0C14] shadow-2xl rounded-sm">
              
              <div className="relative h-80 sm:h-96 md:h-[420px] overflow-hidden">
                <AnimatePresence mode="popLayout">
                  <motion.div
                    key={carouselIndex}
                    initial={{ opacity: 0, scale: 1.03 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.97 }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0 flex items-center justify-center bg-[#05070A]/95"
                  >
                    {/* Soft blurred background matching the photo */}
                    <div 
                      className="absolute inset-0 bg-cover bg-center filter blur-2xl opacity-40 select-none pointer-events-none scale-110"
                      style={{ backgroundImage: `url('${carouselItems[carouselIndex].image}')` }}
                    />
                    
                    {/* Fully contained high-quality photo that never cuts off */}
                    <img 
                      src={carouselItems[carouselIndex].image} 
                      alt={carouselItems[carouselIndex].title}
                      className="w-full h-full object-contain relative z-10 select-none"
                      referrerPolicy="no-referrer"
                    />

                    {/* Dark gradient overlay at the base for elegant readable text */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-transparent pointer-events-none z-10" />
                  </motion.div>
                </AnimatePresence>

                {/* Badge overlay */}
                <div className="absolute top-4 left-4 z-20">
                  <span className="text-[9px] font-display font-bold tracking-widest uppercase bg-gold text-black px-2.5 py-1 rounded-sm shadow-md">
                    {carouselItems[carouselIndex].badge}
                  </span>
                </div>

                {/* Left/Right controls */}
                <button 
                  onClick={handlePrevCarousel}
                  className="absolute left-3 top-1/2 -translate-y-1/2 z-25 p-2 rounded-sm bg-black/60 hover:bg-black text-white pointer border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <button 
                  onClick={handleNextCarousel}
                  className="absolute right-3 top-1/2 -translate-y-1/2 z-25 p-3 rounded-sm bg-black/60 hover:bg-black text-white pointer border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>

                {/* Dots indicator */}
                <div className="absolute bottom-4 right-4 z-20 flex gap-1.5">
                  {carouselItems.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCarouselIndex(i)}
                      className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                        carouselIndex === i ? "w-4 bg-gold" : "w-1.5 bg-zinc-650 hover:bg-zinc-500"
                      }`}
                    />
                  ))}
                </div>

                {/* Content text inside image with high shadow/contrast styling */}
                <div className="absolute bottom-0 left-0 right-0 p-5 text-left z-20">
                  <h3 className="text-base font-bold text-white tracking-widest font-display uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                    {carouselItems[carouselIndex].title}
                  </h3>
                  <p className="text-xs text-zinc-200 mt-1 line-clamp-2 leading-relaxed font-medium drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                    {carouselItems[carouselIndex].description}
                  </p>
                  
                  {carouselItems[carouselIndex].badge === "Geração Santa" && (
                    <button 
                      onClick={() => onNavigate("geracao-santa")} 
                      className="mt-2.5 inline-flex items-center gap-1.5 text-[9px] text-gold hover:text-white font-display tracking-[0.15em] uppercase transition-colors font-bold drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]"
                    >
                      <Shirt className="w-3.5 h-3.5" /> Ver Coleção e Detalhes
                    </button>
                  )}
                </div>
              </div>

            </div>

          </div>

        </div>
      </div>

      {/* Quick Access Anchor links layout */}
      <div className="bg-sophisticated-dark border-t border-white/10 py-6 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <p className="text-[10px] font-display text-zinc-400 tracking-widest flex items-center gap-2 uppercase">
              <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              Cultos Presenciais: {config.address || "Avenida Presidente Kennedy, 99 — Vila Velha, ES"}
            </p>
            <div className="flex gap-4">
              <button 
                onClick={() => onNavigate("sobre-nos")}
                className="text-[10px] text-zinc-300 hover:text-gold font-bold tracking-widest uppercase transition-colors flex items-center gap-1.5 cursor-pointer font-display"
              >
                Conheça Nossa História <ArrowRight className="w-3.5 h-3.5 text-gold" />
              </button>
            </div>
          </div>
        </div>
      </div>

    </section>
  );
}
