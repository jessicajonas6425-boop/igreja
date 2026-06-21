import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Settings, Users, BookOpen, Calendar, Save, Trash2, 
  Plus, Edit, ShieldAlert, LogIn, ExternalLink, CheckCircle, Info 
} from "lucide-react";
import { collection, doc, onSnapshot, setDoc, deleteDoc, getDoc, updateDoc } from "firebase/firestore";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase";
import { Member, Event, DailyVerse, ChurchConfig } from "../types";

interface AdminPanelProps {
  config: ChurchConfig;
}

export default function AdminPanel({ config }: AdminPanelProps) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState<"config" | "events" | "verses" | "members">("config");

  // Admin credentials auth state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loading, setLoading] = useState(false);

  // Firestore state data collections
  const [members, setMembers] = useState<Member[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [verses, setVerses] = useState<DailyVerse[]>([]);

  // Config editor state variables
  const [cfgAddress, setCfgAddress] = useState("");
  const [cfgEmail, setCfgEmail] = useState("");
  const [cfgPhone, setCfgPhone] = useState("");
  const [cfgWhatsapp, setCfgWhatsapp] = useState("");
  const [cfgInstagram, setCfgInstagram] = useState("");
  const [cfgFacebook, setCfgFacebook] = useState("");
  const [cfgYoutube, setCfgYoutube] = useState("");
  const [cfgGsText, setCfgGsText] = useState("");
  const [cfgGsVision, setCfgGsVision] = useState("");

  // Event creator form state
  const [evTitle, setEvTitle] = useState("");
  const [evDesc, setEvDesc] = useState("");
  const [evDate, setEvDate] = useState("");
  const [evTime, setEvTime] = useState("");
  const [evLoc, setEvLoc] = useState("");
  const [evImg, setEvImg] = useState("");
  const [evCat, setEvCat] = useState("");
  const [editingEventId, setEditingEventId] = useState<string | null>(null);

  // Daily Verse creator form state
  const [veText, setVeText] = useState("");
  const [veRef, setVeRef] = useState("");
  const [veDate, setVeDate] = useState("");

  useEffect(() => {
    // 1. Monitor auth to see if the current user is pastor@x.com
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      if (user && user.email === "pastor@x.com") {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    });

    // Feed config editor on mount
    if (config) {
      setCfgAddress(config.address || "");
      setCfgEmail(config.email || "");
      setCfgPhone(config.phone || "");
      setCfgWhatsapp(config.whatsapp || "");
      setCfgInstagram(config.instagram || "");
      setCfgFacebook(config.facebook || "");
      setCfgYoutube(config.youtube || "");
      setCfgGsText(config.gsText || "");
      setCfgGsVision(config.gsVision || "");
    }

    return () => unsubscribeAuth();
  }, [config]);

  // Real-time queries load in when authorized as Admin
  useEffect(() => {
    if (!isAdmin) return;

    // A. Sub to members
    const unsubscribeMembers = onSnapshot(collection(db, "membros"), (snap) => {
      const list: Member[] = [];
      snap.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() } as Member);
      });
      setMembers(list);
    });

    // B. Sub to events
    const unsubscribeEvents = onSnapshot(collection(db, "eventos"), (snap) => {
      const list: Event[] = [];
      snap.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() } as Event);
      });
      setEvents(list);
    });

    // C. Sub to verses
    const unsubscribeVerses = onSnapshot(collection(db, "versiculos_diarios"), (snap) => {
      const list: DailyVerse[] = [];
      snap.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() } as DailyVerse);
      });
      setVerses(list);
    });

    return () => {
      unsubscribeMembers();
      unsubscribeEvents();
      unsubscribeVerses();
    };
  }, [isAdmin]);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setLoading(true);

    if (email !== "pastor@x.com" || password !== "pastor4321") {
      setLoginError("Credenciais exclusivas incorretas.");
      setLoading(false);
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      setIsAdmin(true);
    } catch (err: any) {
      console.error(err);
      setLoginError("Erro ao autenticar: favor conferir ou tentar novamente.");
    } finally {
      setLoading(false);
    }
  };

  // SAVE CORE CONFIG
  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await setDoc(doc(db, "config", "main"), {
        address: cfgAddress,
        email: cfgEmail,
        phone: cfgPhone,
        whatsapp: cfgWhatsapp,
        instagram: cfgInstagram,
        facebook: cfgFacebook,
        youtube: cfgYoutube,
        logoUrl: config.logoUrl,
        introCeuUrl: config.introCeuUrl,
        gsText: cfgGsText,
        gsVision: cfgGsVision
      });
      alert("Configurações atualizadas com sucesso e sincronizadas em tempo real!");
    } catch (err) {
      console.error(err);
      alert("Falha ao salvar as configurações.");
    } finally {
      setLoading(false);
    }
  };

  // ADD or EDIT EVENT
  const handleSaveEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!evTitle || !evDesc || !evDate || !evLoc) {
      alert("Complete os campos obrigatórios do evento!");
      return;
    }

    try {
      setLoading(true);
      const evId = editingEventId || "event-" + Date.now();
      const newEvent: Event = {
        id: evId,
        title: evTitle,
        description: evDesc,
        date: evDate,
        time: evTime || "19:30",
        location: evLoc,
        imageUrl: evImg || "https://i.postimg.cc/ZYPZW8c3/726838928-841485378789522-8854248702185838387-n.jpg",
        category: evCat || "Celebração"
      };

      await setDoc(doc(db, "eventos", evId), newEvent);
      
      // Reset state
      setEvTitle("");
      setEvDesc("");
      setEvDate("");
      setEvTime("");
      setEvLoc("");
      setEvImg("");
      setEvCat("");
      setEditingEventId(null);
      alert("Evento salvo e ativo no site!");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditEvent = (ev: Event) => {
    setEditingEventId(ev.id);
    setEvTitle(ev.title);
    setEvDesc(ev.description);
    setEvDate(ev.date);
    setEvTime(ev.time);
    setEvLoc(ev.location);
    setEvImg(ev.imageUrl);
    setEvCat(ev.category);
  };

  const handleDeleteEvent = async (evId: string) => {
    if (!confirm("Tem certeza que deseja excluir este evento?")) return;
    try {
      await deleteDoc(doc(db, "eventos", evId));
    } catch (err) {
      console.error(err);
    }
  };

  // ADD DAILY VERSE
  const handleAddVerse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!veText || !veRef || !veDate) {
      alert("Por favor preencha os dados do versículo.");
      return;
    }

    try {
      setLoading(true);
      const vId = "v-" + Date.now();
      const newVerse: DailyVerse = {
        id: vId,
        text: veText,
        reference: veRef,
        dateString: veDate // formats: YYYY-MM-DD
      };

      await setDoc(doc(db, "versiculos_diarios", vId), newVerse);
      setVeText("");
      setVeRef("");
      setVeDate("");
      alert("Versículo agendado com sucesso!");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteVerse = async (vId: string) => {
    if (!confirm("Remover este versículo da lista?")) return;
    try {
      await deleteDoc(doc(db, "versiculos_diarios", vId));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteMember = async (mId: string) => {
    if (!confirm("ATENÇÃO: Deseja realmente remover este membro do banco de dados?")) return;
    try {
      await deleteDoc(doc(db, "membros", mId));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <section id="admin" className="py-24 bg-sophisticated-dark relative overflow-hidden border-t border-white/5 min-h-[85vh]">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-left">
        
        {/* UNAUTHORIZED SPLASH VIEW */}
        {!isAdmin && (
          <div className="max-w-md mx-auto">
            
            <div className="text-center mb-10 space-y-3">
              <span className="text-gold font-display tracking-[0.25em] text-[10px] uppercase block font-bold">
                Restrito • Somente Liderança
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif text-white uppercase italic">
                PAINEL DE CONTROLE <span className="text-gold not-italic font-sans font-black tracking-tight">PASTORAL.</span>
              </h2>
              <div className="h-[1px] w-12 bg-gold mx-auto my-1" />
              <p className="text-zinc-500 text-xs sm:text-sm font-light leading-relaxed">
                Área reservada para edição das configurações operacionais, eventos, versículos e controle de membros.
              </p>
            </div>

            <div className="bg-[#0A2424]/80 backdrop-blur-sm border border-gold/15 rounded-sm p-6 sm:p-10 shadow-2xl relative">
              <ShieldAlert className="w-10 h-10 text-gold mx-auto mb-4" />
              
              {loginError && (
                <div className="p-3.5 mb-5 bg-[#5b1e1e]/15 border border-red-500/20 text-red-300 rounded-sm text-xs text-center font-display">
                  {loginError}
                </div>
              )}

              <form onSubmit={handleAdminLogin} className="space-y-5">
                <div>
                  <label className="text-[9px] font-display font-bold text-zinc-500 uppercase tracking-widest block mb-1.5">
                    Email Pastor
                  </label>
                  <input
                    type="email"
                    placeholder="pastor@x.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 focus:border-gold/50 rounded-sm py-3.5 px-4 text-white text-xs outline-none transition"
                    required
                  />
                </div>

                <div>
                  <label className="text-[9px] font-display font-bold text-zinc-500 uppercase tracking-widest block mb-1.5">
                    Senha Pastor
                  </label>
                  <input
                    type="password"
                    placeholder="Sua senha pastor"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 focus:border-gold/50 rounded-sm py-3.5 px-4 text-white text-xs outline-none transition"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 text-xs font-bold uppercase tracking-widest bg-gradient-to-r from-gold to-gold-dark text-black hover:brightness-110 rounded-sm shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer font-display"
                >
                  <LogIn className="w-4 h-4" />
                  {loading ? "Entrando..." : "Acessar Painel"}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* AUTHORIZED FULL ADMIN VIEW */}
        {isAdmin && (
          <div className="space-y-8">
            
            {/* Header control */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-white/10">
              <div>
                <span className="text-gold font-display text-[10px] uppercase tracking-[0.2em] font-bold">
                  Painel de Alta Liderança
                </span>
                <h2 className="text-2xl sm:text-3xl font-serif text-white uppercase mt-2 italic leading-tight">
                  GESTÃO DA IGREJA <span className="text-gold not-italic font-sans font-black tracking-tight font-display">MCI VILA VELHA.</span>
                </h2>
                <p className="text-[9px] text-zinc-500 font-mono uppercase tracking-wider mt-1">
                  Visualizando e salvando no Firestore Database
                </p>
              </div>

              {/* Tab selector */}
              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={() => setActiveTab("config")}
                  className={`px-3 py-2.5 text-[9px] font-bold uppercase tracking-wider rounded-sm border transition-all flex items-center gap-1.5 cursor-pointer font-display ${
                    activeTab === "config" 
                      ? "bg-gold/15 text-gold border-gold/40" 
                      : "bg-[#0A2424]/80 text-zinc-400 border-white/10 hover:text-white hover:border-gold/30"
                  }`}
                >
                  <Settings className="w-3.5 h-3.5" />
                  Contatos & Secretaria
                </button>

                <button
                  onClick={() => setActiveTab("events")}
                  className={`px-3 py-2.5 text-[9px] font-bold uppercase tracking-wider rounded-sm border transition-all flex items-center gap-1.5 cursor-pointer font-display ${
                    activeTab === "events" 
                      ? "bg-gold/15 text-gold border-gold/40" 
                      : "bg-[#0A2424]/80 text-zinc-400 border-white/10 hover:text-white hover:border-gold/30"
                  }`}
                >
                  <Calendar className="w-3.5 h-3.5" />
                  Mural Programação
                </button>

                <button
                  onClick={() => setActiveTab("verses")}
                  className={`px-3 py-2.5 text-[9px] font-bold uppercase tracking-wider rounded-sm border transition-all flex items-center gap-1.5 cursor-pointer font-display ${
                    activeTab === "verses" 
                      ? "bg-gold/15 text-gold border-gold/40" 
                      : "bg-[#0A2424]/80 text-zinc-400 border-white/10 hover:text-white hover:border-gold/30"
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  Versículos Diários
                </button>

                <button
                  onClick={() => setActiveTab("members")}
                  className={`px-3 py-2.5 text-[9px] font-bold uppercase tracking-wider rounded-sm border transition-all flex items-center gap-1.5 cursor-pointer font-display ${
                    activeTab === "members" 
                      ? "bg-gold/15 text-gold border-gold/40" 
                      : "bg-[#0A2424]/80 text-zinc-400 border-white/10 hover:text-white hover:border-gold/30"
                  }`}
                >
                  <Users className="w-3.5 h-3.5" />
                  Membros Cadastrados ({members.length})
                </button>
              </div>
            </div>

            {/* TAB PANELS RENDERS */}
            <div className="bg-[#0A2424]/80 backdrop-blur-sm border border-gold/15 rounded-sm p-6 sm:p-8 shadow-2xl">
              
              {/* TAB 1: EDIT CONFIGS */}
              {activeTab === "config" && (
                <form onSubmit={handleSaveConfig} className="space-y-6">
                  <div className="border-b border-white/10 pb-3 flex items-center gap-1.5">
                    <Settings className="w-5 h-5 text-gold animate-spin-slow" />
                    <h3 className="text-sm font-serif font-bold text-white uppercase tracking-wider italic flex items-center gap-1.5 text-left">
                      Secretaria & <span className="text-gold not-italic font-sans font-black tracking-tight font-display">Redes Sociais.</span>
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-[9px] font-display font-bold text-zinc-500 uppercase tracking-widest block mb-1.5">
                        Endereço Completo
                      </label>
                      <input
                        type="text"
                        value={cfgAddress}
                        onChange={(e) => setCfgAddress(e.target.value)}
                        className="w-full bg-black/40 border border-white/10 focus:border-gold/50 rounded-sm py-3 px-4 text-white text-xs outline-none transition"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-[9px] font-display font-bold text-zinc-500 uppercase tracking-widest block mb-1.5">
                        Email da Igreja
                      </label>
                      <input
                        type="email"
                        value={cfgEmail}
                        onChange={(e) => setCfgEmail(e.target.value)}
                        className="w-full bg-black/40 border border-white/10 focus:border-gold/50 rounded-sm py-3 px-4 text-white text-xs outline-none transition"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-[9px] font-display font-bold text-zinc-500 uppercase tracking-widest block mb-1.5">
                        Whatsapp Contato (Apenas números com DDD)
                      </label>
                      <input
                        type="text"
                        value={cfgWhatsapp}
                        onChange={(e) => setCfgWhatsapp(e.target.value)}
                        className="w-full bg-black/40 border border-white/10 focus:border-gold/50 rounded-sm py-3 px-4 text-white text-xs outline-none transition"
                        placeholder="Ex: 5527998887766"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-[9px] font-display font-bold text-zinc-500 uppercase tracking-widest block mb-1.5">
                        Telefone Fixo / Outro Contato
                      </label>
                      <input
                        type="text"
                        value={cfgPhone}
                        onChange={(e) => setCfgPhone(e.target.value)}
                        className="w-full bg-black/40 border border-white/10 focus:border-gold/50 rounded-sm py-3 px-4 text-white text-xs outline-none transition"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
                    <div>
                      <label className="text-[9px] font-display font-bold text-zinc-500 uppercase tracking-widest block mb-1.5">
                        Usuário Instagram
                      </label>
                      <input
                        type="text"
                        value={cfgInstagram}
                        onChange={(e) => setCfgInstagram(e.target.value)}
                        className="w-full bg-black/40 border border-white/10 focus:border-gold/50 rounded-sm py-3 px-4 text-white text-xs outline-none transition"
                        placeholder="igrejamcivilavelha"
                      />
                    </div>

                    <div>
                      <label className="text-[9px] font-display font-bold text-zinc-500 uppercase tracking-widest block mb-1.5">
                        Nome Página Facebook
                      </label>
                      <input
                        type="text"
                        value={cfgFacebook}
                        onChange={(e) => setCfgFacebook(e.target.value)}
                        className="w-full bg-black/40 border border-white/10 focus:border-gold/50 rounded-sm py-3 px-4 text-white text-xs outline-none transition"
                        placeholder="igrejamcivilavelha"
                      />
                    </div>

                    <div>
                      <label className="text-[9px] font-display font-bold text-zinc-500 uppercase tracking-widest block mb-1.5">
                        Handle Canal Youtube
                      </label>
                      <input
                        type="text"
                        value={cfgYoutube}
                        onChange={(e) => setCfgYoutube(e.target.value)}
                        className="w-full bg-black/40 border border-white/10 focus:border-gold/50 rounded-sm py-3 px-4 text-white text-xs outline-none transition"
                        placeholder="@igrejamcivilavelha"
                      />
                    </div>
                  </div>

                  {/* Youth Ministry Text Settings */}
                  <div className="space-y-4 pt-4 border-t border-white/10">
                    <h4 className="text-[10px] font-display font-bold text-gold uppercase tracking-wider text-left">
                      Geração Santa • Ministério de Jovens
                    </h4>
                    
                    <div>
                      <label className="text-[9px] font-display font-bold text-zinc-500 uppercase tracking-widest block mb-1.5">
                        Texto de Introdução GS
                      </label>
                      <textarea
                        rows={3}
                        value={cfgGsText}
                        onChange={(e) => setCfgGsText(e.target.value)}
                        className="w-full bg-black/40 border border-white/10 focus:border-gold/50 rounded-sm p-4 text-white text-xs outline-none transition"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-[9px] font-display font-bold text-zinc-500 uppercase tracking-widest block mb-1.5">
                        Texto da Visão Jovem
                      </label>
                      <textarea
                        rows={3}
                        value={cfgGsVision}
                        onChange={(e) => setCfgGsVision(e.target.value)}
                        className="w-full bg-black/40 border border-white/10 focus:border-gold/50 rounded-sm p-4 text-white text-xs outline-none transition"
                        required
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/10 flex justify-end">
                    <button
                      type="submit"
                      className="px-6 py-3.5 font-bold text-xs uppercase tracking-widest bg-gradient-to-r from-gold to-gold-dark text-black hover:brightness-110 rounded-sm shadow-md flex items-center gap-1.5 cursor-pointer font-display"
                    >
                      <Save className="w-4 h-4" />
                      Salvar Todas Configurações
                    </button>
                  </div>
                </form>
              )}

              {/* TAB 2: EDIT EVENTS */}
              {activeTab === "events" && (
                <div className="space-y-8">
                  
                  {/* Event form creator */}
                  <form onSubmit={handleSaveEvent} className="p-5 sm:p-6 bg-black/40 rounded-sm border border-white/10 space-y-4">
                    <div className="flex justify-between items-center pb-2.5 border-b border-white/10">
                      <span className="text-xs text-white font-bold uppercase tracking-wider flex items-center gap-1 font-display">
                        <Plus className="w-4 h-4 text-gold" />
                        {editingEventId ? "Editar Evento" : "Criar Novo Evento"} <span className="text-gold italic font-serif">/ Programação.</span>
                      </span>
                      {editingEventId && (
                        <button
                          type="button"
                          onClick={() => {
                            setEditingEventId(null);
                            setEvTitle("");
                            setEvDesc("");
                            setEvDate("");
                            setEvTime("");
                            setEvLoc("");
                            setEvImg("");
                            setEvCat("");
                          }}
                          className="text-[9px] uppercase font-display font-medium text-red-400 hover:text-red-300 tracking-wider cursor-pointer transition"
                        >
                          Cancelar Edição
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[9px] font-display font-bold text-zinc-550 uppercase tracking-widest block mb-1">Título do Evento *</label>
                        <input
                          type="text"
                          placeholder="Ex: Culto da Vitória"
                          value={evTitle}
                          onChange={(e) => setEvTitle(e.target.value)}
                          className="w-full bg-black/50 border border-white/10 rounded-sm p-2.5 text-white text-xs focus:border-gold/50 outline-none transition"
                          required
                        />
                      </div>

                      <div>
                        <label className="text-[9px] font-display font-bold text-zinc-550 uppercase tracking-widest block mb-1">Categoria (Filtro) *</label>
                        <input
                          type="text"
                          placeholder="Ex: Jovens, Mulheres, Cultos"
                          value={evCat}
                          onChange={(e) => setEvCat(e.target.value)}
                          className="w-full bg-black/50 border border-white/10 rounded-sm p-2.5 text-white text-xs focus:border-gold/50 outline-none transition"
                          required
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="text-[9px] font-display font-bold text-zinc-550 uppercase tracking-widest block mb-1">Breve Descrição do Evento *</label>
                        <textarea
                          placeholder="Descreva detalhes..."
                          rows={2}
                          value={evDesc}
                          onChange={(e) => setEvDesc(e.target.value)}
                          className="w-full bg-black/50 border border-white/10 rounded-sm p-2.5 text-white text-xs focus:border-gold/50 outline-none transition"
                          required
                        />
                      </div>

                      <div>
                        <label className="text-[9px] font-display font-bold text-zinc-550 uppercase tracking-widest block mb-1">Data / Frequência *</label>
                        <input
                          type="text"
                          placeholder="Ex: Todo Sábado ou 25 de Dezembro"
                          value={evDate}
                          onChange={(e) => setEvDate(e.target.value)}
                          className="w-full bg-black/50 border border-white/10 rounded-sm p-2.5 text-white text-xs focus:border-gold/50 outline-none transition"
                          required
                        />
                      </div>

                      <div>
                        <label className="text-[9px] font-display font-bold text-zinc-550 uppercase tracking-widest block mb-1">Hora do Início</label>
                        <input
                          type="text"
                          placeholder="Ex: 19:30"
                          value={evTime}
                          onChange={(e) => setEvTime(e.target.value)}
                          className="w-full bg-black/50 border border-white/10 rounded-sm p-2.5 text-white text-xs focus:border-gold/50 outline-none transition"
                        />
                      </div>

                      <div>
                        <label className="text-[9px] font-display font-bold text-zinc-550 uppercase tracking-widest block mb-1">Local / Endereço *</label>
                        <input
                          type="text"
                          placeholder="Ex: Auditório Principal"
                          value={evLoc}
                          onChange={(e) => setEvLoc(e.target.value)}
                          className="w-full bg-black/50 border border-white/10 rounded-sm p-2.5 text-white text-xs focus:border-gold/50 outline-none transition"
                          required
                        />
                      </div>

                      <div>
                        <label className="text-[9px] font-display font-bold text-zinc-550 uppercase tracking-widest block mb-1">URL Imagem Decorativa (Unsplash, etc.)</label>
                        <input
                          type="text"
                          placeholder="Ex: https://images.unsplash.com/..."
                          value={evImg}
                          onChange={(e) => setEvImg(e.target.value)}
                          className="w-full bg-black/50 border border-white/10 rounded-sm p-2.5 text-white text-xs focus:border-gold/50 outline-none transition"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="px-5 py-3 text-xs font-display font-bold uppercase tracking-widest bg-gradient-to-r from-gold to-gold-dark text-black hover:brightness-110 rounded-sm flex items-center gap-1 cursor-pointer transition shadow-md"
                    >
                      {editingEventId ? "Salvar Alterações" : "Ativar Novo Evento"}
                    </button>
                  </form>

                  {/* Event layout list with actions */}
                  <div className="space-y-3.5 pt-4">
                    <h4 className="text-[10px] font-display font-bold text-zinc-500 uppercase tracking-wider block text-left">Eventos Ativos Cadastrados ({events.length})</h4>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {events.map((ev) => (
                        <div key={ev.id} className="p-4 rounded-sm bg-black/40 border border-white/10 flex items-start gap-4 justify-between hover:border-gold/20 transition">
                          <img
                            src={ev.imageUrl}
                            alt=""
                            className="w-12 h-12 object-cover rounded-sm border border-white/10 shrink-0"
                          />
                          <div className="flex-grow text-left space-y-1">
                            <span className="text-[9px] font-display font-bold uppercase bg-gold/10 text-gold px-2.5 py-1 rounded-sm border border-gold/25">
                              {ev.category}
                            </span>
                            <h5 className="text-xs font-bold text-white block mt-2 font-display uppercase tracking-wider">{ev.title}</h5>
                            <span className="text-[10px] text-zinc-400 block font-mono font-medium">{ev.date} - {ev.time}h</span>
                          </div>
                          
                          <div className="flex gap-1.5">
                            <button
                              onClick={() => handleEditEvent(ev)}
                              title="Editar"
                              className="p-1.5 text-zinc-400 hover:text-gold bg-white/5 border border-white/10 rounded-sm cursor-pointer transition flex items-center justify-center"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteEvent(ev.id)}
                              title="Excluir"
                              className="p-1.5 text-zinc-400 hover:text-red-400 bg-white/5 border border-white/10 rounded-sm cursor-pointer transition flex items-center justify-center"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              )}

              {/* TAB 3: EDIT VERSES */}
              {activeTab === "verses" && (
                <div className="space-y-8">
                  
                  <form onSubmit={handleAddVerse} className="p-5 sm:p-6 bg-black/40 rounded-sm border border-white/10 space-y-4">
                    <span className="text-xs text-white font-bold uppercase tracking-wider flex items-center gap-1 pb-2 border-b border-white/10 font-display">
                      <Plus className="w-4 h-4 text-gold" />
                      Agendar Novo <span className="text-gold italic font-serif">Versículo do Dia.</span>
                    </span>

                    <div className="flex flex-col gap-4">
                      <div>
                        <label className="text-[9px] font-display font-bold text-zinc-555 uppercase tracking-widest block mb-1">Verso Bíblico Estilizado *</label>
                        <textarea
                          placeholder="Ex: Porque Deus amou o mundo de tal maneira..."
                          rows={2}
                          value={veText}
                          onChange={(e) => setVeText(e.target.value)}
                          className="w-full bg-black/50 border border-white/10 rounded-sm p-2.5 text-white text-xs focus:border-gold/50 outline-none transition animate-none"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-[9px] font-display font-bold text-zinc-555 uppercase tracking-widest block mb-1">Referência Bíblica *</label>
                          <input
                            type="text"
                            placeholder="Ex: João 3:16"
                            value={veRef}
                            onChange={(e) => setVeRef(e.target.value)}
                            className="w-full bg-black/50 border border-white/10 rounded-sm p-2.5 text-white text-xs focus:border-gold/50 outline-none transition"
                            required
                          />
                        </div>
                        <div>
                          <label className="text-[9px] font-display font-bold text-zinc-555 uppercase tracking-widest block mb-1">Data de Exibição (AAAA-MM-DD) *</label>
                          <input
                            type="date"
                            value={veDate}
                            onChange={(e) => setVeDate(e.target.value)}
                            className="w-full bg-black/50 border border-white/10 rounded-sm p-2.5 text-white text-xs focus:border-gold/50 outline-none transition"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="px-5 py-3 text-xs font-display font-bold uppercase tracking-widest bg-gradient-to-r from-gold to-gold-dark text-black hover:brightness-110 rounded-sm flex items-center gap-1 cursor-pointer transition shadow-md"
                    >
                      Agendar Versículo
                    </button>
                  </form>

                  {/* Verses layout collection */}
                  <div className="space-y-4 pt-4 border-t border-white/10">
                    <h4 className="text-[10px] font-display font-bold text-zinc-500 uppercase tracking-wider block text-left font-display">Lista de Versículos Agendados ({verses.length})</h4>
                    
                    <div className="space-y-3">
                      {verses.map((ver) => (
                        <div key={ver.id} className="p-4 rounded-sm bg-black/40 border border-white/10 flex items-center justify-between text-left hover:border-gold/20 transition">
                          <div className="space-y-1 overflow-hidden pr-4">
                            <span className="text-[9px] font-mono text-gold font-bold uppercase block">
                              Data: {ver.dateString}
                            </span>
                            <p className="text-xs italic text-zinc-200 line-clamp-1 font-serif">"{ver.text}"</p>
                            <span className="text-[10px] font-bold text-gold font-display mt-1 block uppercase tracking-wider">— {ver.reference}</span>
                          </div>

                          <button
                            onClick={() => handleDeleteVerse(ver.id)}
                            className="p-1.5 text-zinc-400 hover:text-red-400 bg-white/5 border border-white/10 rounded-sm cursor-pointer transition"
                            title="Excluir Versículo"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              )}

              {/* TAB 4: MANAGE MEMBERS */}
              {activeTab === "members" && (
                <div className="space-y-6">
                  <div className="border-b border-white/10 pb-4 flex justify-between items-center text-left">
                    <div>
                      <h3 className="text-sm font-serif font-bold text-white uppercase tracking-wider italic">
                        Lista de Membros <span className="text-gold not-italic font-sans font-black tracking-tight font-display">Ativos Na Igreja.</span>
                      </h3>
                      <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-wider mt-1">
                        Membros cadastrados em tempo real sincronizados via Firestore
                      </p>
                    </div>
                    <span className="text-[10px] bg-gold/10 text-gold font-display tracking-wider uppercase font-bold px-3 py-1.5 rounded-sm border border-gold/25">
                      Total: {members.length}
                    </span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-zinc-350 text-left border-collapse">
                      <thead>
                        <tr className="border-b border-white/10 bg-[#0A2424]/60 font-serif lowercase italic text-gold text-xs font-normal text-[11px]">
                          <th className="p-3 text-left">Nome</th>
                          <th className="p-3 text-left">Idade</th>
                          <th className="p-3 text-left">Nascimento</th>
                          <th className="p-3 text-left">Aniversário</th>
                          <th className="p-3 text-left">Célula</th>
                          <th className="p-3 text-left">Atua em</th>
                          <th className="p-3 text-left">Senha / PIN</th>
                          <th className="p-3 text-right">Ação</th>
                        </tr>
                      </thead>
                      <tbody>
                        {members.length === 0 ? (
                          <tr>
                            <td colSpan={8} className="p-6 text-center text-zinc-500">
                              Nenhum membro cadastrado até o momento.
                            </td>
                          </tr>
                        ) : (
                          members.map((mem) => (
                            <tr key={mem.id} className="border-b border-white/5 hover:bg-white/5 transition duration-155">
                              <td className="p-3 truncate max-w-[150px] font-bold text-white uppercase font-display tracking-wide">
                                {mem.name}
                              </td>
                              <td className="p-3 font-mono font-medium">{mem.age}</td>
                              <td className="p-3 font-mono text-zinc-400">{mem.birthYear}</td>
                              <td className="p-3 font-mono font-bold text-gold">
                                {String(mem.birthDay).padStart(2, '0')}/{String(mem.birthMonth).padStart(2, '0')}
                              </td>
                              <td className="p-3 text-gold font-bold uppercase tracking-wider text-[10px] font-display">{mem.cellGroup || "Visitante"}</td>
                              <td className="p-3 text-white font-medium uppercase tracking-wider text-[10px] font-display">{mem.ministry || "Membro"}</td>
                              <td className="p-3 font-mono text-zinc-300 font-bold bg-white/5 px-2 py-1 rounded-sm">{mem.pin || `Ano: ${mem.birthYear}`}</td>
                              <td className="p-3 text-right">
                                <button
                                  onClick={() => handleDeleteMember(mem.id)}
                                  className="p-1 px-2.5 text-[9px] uppercase font-bold tracking-wider text-red-400 hover:text-red-300 bg-red-950/10 hover:bg-red-950/20 rounded-sm border border-red-500/20 cursor-pointer transition"
                                  title="Remover Membro"
                                >
                                  Remover
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>

                </div>
              )}

            </div>

          </div>
        )}

      </div>

    </section>
  );
}
