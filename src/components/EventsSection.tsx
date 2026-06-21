import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Calendar, MapPin, Clock, X, Info, Tag } from "lucide-react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { Event } from "../types";

export default function EventsSection() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [activeCategory, setActiveCategory] = useState("Todos");

  // Local/Fallback events if Firestore events are empty
  const defaultEvents: Event[] = [
    {
      id: "culto-domingo",
      title: "Culto de Celebração",
      description: "Nosso encontro semanal de adoração em família. Venha receber uma palavra inspiradora, louvar com excelência e sentir a presença e o poder de Deus.",
      date: "Todo Domingo",
      time: "18:00",
      location: "Templo Principal - MCI Vila Velha",
      imageUrl: "https://i.postimg.cc/ZYPZW8c3/726838928-841485378789522-8854248702185838387-n.jpg",
      category: "Celebração"
    },
    {
      id: "culto-jovens",
      title: "Culto Geração Santa",
      description: "O encontro oficial dos jovens da MCI Vila Velha. Louvor elétrico, palavra direta e um pós-culto inesquecível com muita resenha e amizade. Vista sua camisa!",
      date: "Sábados Alternados",
      time: "19:30",
      location: "Auditório dos Jovens",
      imageUrl: "https://i.postimg.cc/8PV53kyb/725318273-3060397824170772-6348945460884155426-n.jpg",
      category: "Jovens"
    },
    {
      id: "celulas-semanais",
      title: "Células nos Lares",
      description: "Nossa comunidade reunida em pequenos grupos em Vila Velha. Compartilhar a vida, orar uns pelos outros e crescer juntos na fé cristã.",
      date: "Quartas e Quintas",
      time: "20:00",
      location: "Casas e Apartamentos em Vila Velha",
      imageUrl: "https://i.postimg.cc/VLc6Ts7W/726948247-1005898895177912-798875860879382165-n.jpg",
      category: "Células"
    }
  ];

  useEffect(() => {
    // Read from Firestore custom database
    const eventsRef = collection(db, "eventos");
    const unsubscribe = onSnapshot(eventsRef, (snapshot) => {
      if (!snapshot.empty) {
        const eventsList: Event[] = [];
        snapshot.forEach((doc) => {
          eventsList.push({ id: doc.id, ...doc.data() } as Event);
        });
        setEvents(eventsList);
      } else {
        setEvents(defaultEvents);
      }
      setLoading(false);
    }, (error) => {
      console.error("Firestore events subscription failed: ", error);
      setEvents(defaultEvents);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Filter unique categories
  const categories = ["Todos", ...Array.from(new Set(events.map((e) => e.category)))];

  const filteredEvents = activeCategory === "Todos" 
    ? events 
    : events.filter(e => e.category === activeCategory);

  return (
    <section id="eventos" className="py-24 bg-sophisticated-dark relative overflow-hidden border-t border-white/5 text-left">
      
      {/* Decorative accent shadows */}
      <div className="absolute top-0 left-10 w-80 h-80 bg-gold/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-gold/3 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-gold font-display tracking-[0.3em] text-xs font-bold uppercase block">
            Nossa Programação
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-white uppercase italic">
            CULTOS E <span className="text-gold not-italic font-sans font-black tracking-tight">EVENTOS.</span>
          </h2>
          <div className="h-[1px] w-24 bg-gold mx-auto" />
          <p className="text-zinc-400 text-sm sm:text-base leading-relaxed font-light">
            Participe dos nossos encontros. Temos uma programação completa desenhada para todas as idades, focada na edificação e adoração genuína.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2.5 text-[10px] font-bold uppercase tracking-widest rounded-sm border transition-all cursor-pointer font-display ${
                activeCategory === cat
                  ? "bg-gold text-black border-gold shadow-md"
                  : "bg-white/5 text-zinc-400 border-white/10 hover:text-white hover:border-white/20"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Events Masonry Grid */}
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin h-6 w-6 border-2 border-gold border-t-transparent rounded-full mb-4" />
            <p className="text-zinc-400 font-display text-[10px] uppercase tracking-[0.2em] font-semibold">Carregando Eventos...</p>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="text-center py-16 bg-[#0A2424]/80 backdrop-blur-sm rounded-sm border border-gold/15 max-w-lg mx-auto">
            <Info className="w-8 h-8 text-gold/60 mx-auto mb-3" />
            <p className="text-zinc-300 font-bold font-display text-sm uppercase tracking-wider">Nenhum evento neste filtro</p>
            <p className="text-zinc-505 text-xs mt-1">Selecione outra categoria ou aguarde novidades.</p>
          </div>
        ) : (
          <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
            {filteredEvents.map((ev) => (
              <motion.div
                key={ev.id}
                layout
                whileHover={{ y: -4 }}
                onClick={() => setSelectedEvent(ev)}
                className="break-inside-avoid relative rounded-sm overflow-hidden bg-[#0A2424]/80 backdrop-blur-sm border border-gold/15 hover:border-gold/35 hover:shadow-2xl group cursor-pointer transition-all duration-300 flex flex-col pt-1"
              >
                {/* Photo Header */}
                <div className="relative overflow-hidden aspect-video">
                  <img
                    src={ev.imageUrl || "https://images.unsplash.com/photo-1438032005730-c779502df39b?auto=format&fit=crop&w=600&q=80"}
                    alt={ev.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transform scale-100 group-hover:scale-[1.03] transition-transform duration-500 blur-[0.3px]"
                  />
                  {/* Category label */}
                  <span className="absolute top-3 left-3 text-[9px] font-display font-bold uppercase tracking-widest bg-black/80 text-gold border border-gold/20 px-2.5 py-1 rounded-sm">
                    {ev.category}
                  </span>
                </div>

                {/* Info Content Box */}
                <div className="p-5 flex flex-col space-y-3.5 text-left">
                  <h3 className="text-base font-bold text-white tracking-widest font-display uppercase group-hover:text-gold transition-colors">
                    {ev.title}
                  </h3>
                  
                  <p className="text-xs text-zinc-400 leading-relaxed font-light line-clamp-3">
                    {ev.description}
                  </p>

                  <div className="pt-3 border-t border-white/5 flex flex-col gap-2 font-display text-[11px] text-zinc-300">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-gold" />
                      <span className="font-semibold uppercase tracking-wider">{ev.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-gold" />
                      <span className="font-semibold uppercase tracking-wider">{ev.time}h</span>
                    </div>
                    <div className="flex items-center gap-2 text-zinc-400 truncate">
                      <MapPin className="w-3.5 h-3.5 text-gold" />
                      <span className="truncate italic font-serif">{ev.location}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

      </div>

      {/* Expanded Click-to-Detail modal */}
      <AnimatePresence>
        {selectedEvent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.8 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedEvent(null)}
              className="absolute inset-0 bg-black backdrop-blur-sm"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="relative w-full max-w-2xl bg-[#0A2424]/95 backdrop-blur-md border border-gold/15 rounded-sm overflow-hidden shadow-2xl z-10"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedEvent(null)}
                className="absolute top-4 right-4 z-20 p-2.5 text-zinc-450 hover:text-white bg-black/60 rounded-sm border border-gold/10 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Banner Image */}
              <div className="relative h-60 sm:h-72 w-full">
                <img
                  src={selectedEvent.imageUrl}
                  alt={selectedEvent.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#051414] via-transparent to-transparent pointer-events-none" />
                <span className="absolute bottom-4 left-4 text-[9px] font-display font-bold uppercase tracking-widest bg-gold text-black px-3 py-1.5 rounded-sm shadow-lg">
                  {selectedEvent.category}
                </span>
              </div>

              {/* Content text */}
              <div className="p-6 text-left flex flex-col space-y-4">
                <h3 className="text-lg sm:text-xl font-bold text-white uppercase tracking-widest font-display">
                  {selectedEvent.title}
                </h3>

                <p className="text-sm text-zinc-350 leading-relaxed font-light font-serif italic">
                  {selectedEvent.description}
                </p>

                {/* Details layout */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-white/5">
                  <div className="flex items-center gap-2.5 p-3.5 rounded-sm bg-white/5 border border-white/10">
                    <Calendar className="w-4 h-4 text-gold shrink-0" />
                    <div>
                      <span className="text-[9px] font-display text-zinc-500 uppercase tracking-wider block">Data</span>
                      <span className="text-xs text-white font-bold font-display uppercase tracking-widest">{selectedEvent.date}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2.5 p-3.5 rounded-sm bg-white/5 border border-white/10">
                    <Clock className="w-4 h-4 text-gold shrink-0" />
                    <div>
                      <span className="text-[9px] font-display text-zinc-500 uppercase tracking-wider block">Horário</span>
                      <span className="text-xs text-white font-bold font-display uppercase tracking-widest">{selectedEvent.time}h</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 p-3.5 rounded-sm bg-white/5 border border-white/10 overflow-hidden">
                    <MapPin className="w-4 h-4 text-gold shrink-0" />
                    <div className="overflow-hidden">
                      <span className="text-[9px] font-display text-zinc-500 uppercase tracking-wider block">Local</span>
                      <span className="text-xs text-white font-serif italic block truncate" title={selectedEvent.location}>
                        {selectedEvent.location}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-2.5 flex justify-end">
                  <button
                    onClick={() => setSelectedEvent(null)}
                    className="px-6 py-3 font-bold text-xs uppercase tracking-widest bg-white/5 border border-white/10 text-white hover:bg-white/10 rounded-sm cursor-pointer transition-all font-display"
                  >
                    Fechar Detalhes
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </section>
  );
}
