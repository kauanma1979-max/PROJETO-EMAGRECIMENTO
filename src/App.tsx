import { useState, useEffect, ChangeEvent } from "react";
import { 
  Menu, 
  X, 
  LayoutDashboard, 
  TrendingUp, 
  History, 
  Settings, 
  PlusCircle, 
  Search,
  Dumbbell,
  Download,
  Upload,
  Database
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import ConfigPerfil from "./components/ConfigPerfil";
import DashboardStatus from "./components/DashboardStatus";
import GraficosDashboard from "./components/GraficosDashboard";
import RegistroForm from "./components/RegistroForm";
import HistoricoTabela from "./components/HistoricoTabela";
import { AppData, AppConfig, Registro } from "./types";

export default function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [searchTerm, setSearchTerm] = useState("");

  // Load initial data from localStorage
  const [appData, setAppData] = useState<AppData>(() => {
    const saved = localStorage.getItem("projetoEmagrecimentoFinal");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          config: {
            pesoInicial: parsed.config?.pesoInicial ?? 0,
            metaPerda: parsed.config?.metaPerda ?? 0,
            dataInicio: parsed.config?.dataInicio ?? "",
          },
          registros: Array.isArray(parsed.registros) ? parsed.registros : [],
        };
      } catch (e) {
        console.error("Erro ao carregar dados salvos:", e);
      }
    }
    return {
      config: { pesoInicial: 80, metaPerda: 10, dataInicio: "2026-06-01" },
      registros: [],
    };
  });

  // Save data to localStorage whenever appData state changes
  useEffect(() => {
    localStorage.setItem("projetoEmagrecimentoFinal", JSON.stringify(appData));
  }, [appData]);

  // Handler to export app data as a JSON backup file
  const handleExportBackup = () => {
    try {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(appData, null, 2));
      const downloadAnchor = document.createElement("a");
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `dieta_e_peso_backup_${new Date().toISOString().slice(0, 10)}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    } catch (err) {
      console.error("Erro ao gerar backup:", err);
      alert("Houve um erro ao gerar o arquivo de backup.");
    }
  };

  // Handler to import and restore app data from a JSON file
  const handleImportBackup = (e: ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], "UTF-8");
      fileReader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (parsed && typeof parsed === "object") {
            const pesoInicial = parseFloat(parsed.config?.pesoInicial) || 0;
            const metaPerda = parseFloat(parsed.config?.metaPerda) || 0;
            const dataInicio = parsed.config?.dataInicio || "";
            const registros = Array.isArray(parsed.registros) ? parsed.registros : [];
            
            setAppData({
              config: { pesoInicial, metaPerda, dataInicio },
              registros
            });
            alert("✅ Backup restaurado com sucesso!");
          } else {
            alert("❌ Erro: O arquivo selecionado não possui um formato de backup válido.");
          }
        } catch (error) {
          console.error(error);
          alert("❌ Erro ao decodificar arquivo. Certifique-se de que é um JSON de backup válido.");
        }
      };
    }
  };

  // Handler to update config values (pesoInicial, metaPerda, dataInicio)
  const handleConfigChange = (key: keyof AppConfig, value: string | number) => {
    setAppData((prev) => ({
      ...prev,
      config: {
        ...prev.config,
        [key]: value,
      },
    }));
  };

  // Handler to append a new log entry
  const handleAddRegistro = (novoReg: Omit<Registro, "id">) => {
    const regWithId: Registro = {
      ...novoReg,
      id: Date.now().toString(),
    };
    setAppData((prev) => ({
      ...prev,
      registros: [...prev.registros, regWithId],
    }));
  };

  // Handler to delete a log entry
  const handleDeleteRegistro = (id: string) => {
    setAppData((prev) => ({
      ...prev,
      registros: prev.registros.filter((reg) => reg.id !== id),
    }));
  };

  // Filter registrations based on search term (date or observations)
  const filteredRegistros = appData.registros.filter((reg) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    const formattedDate = reg.data.split("-").reverse().join("/");
    return (
      formattedDate.includes(term) || 
      (reg.obs && reg.obs.toLowerCase().includes(term)) ||
      reg.peso.toString().includes(term)
    );
  });

  const sidebarContent = (
    <div className="flex flex-col h-full bg-slate-900 text-slate-300">
      {/* Brand Header */}
      <div className="p-6 flex items-center gap-3 border-b border-slate-800">
        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/30">
          <Dumbbell className="w-4 h-4 text-white" />
        </div>
        <div>
          <span className="text-white font-extrabold text-lg tracking-tight block">EMAGRECER.IO</span>
          <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block -mt-1">PROJETO SAUDÁVEL</span>
        </div>
      </div>

      {/* Main Navigation links */}
      <nav className="px-4 py-6 space-y-1.5 flex-1 overflow-y-auto custom-scrollbar">
        <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-3 mb-2">
          Navegação
        </div>
        
        <button
          onClick={() => { setActiveTab("dashboard"); setMobileMenuOpen(false); }}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
            activeTab === "dashboard"
              ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/10"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Dashboard Principal</span>
        </button>

        <button
          onClick={() => { setActiveTab("perfil"); setMobileMenuOpen(false); }}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
            activeTab === "perfil"
              ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/10"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Configurar Perfil</span>
        </button>

        {/* Integrated Profile Inputs in the Sidebar */}
        <div className="pt-6 border-t border-slate-800 mt-6 space-y-4">
          <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-3">
            Atalho do Perfil
          </div>
          <div className="px-3">
            <ConfigPerfil
              config={appData.config}
              onChange={handleConfigChange}
              inSidebar={true}
            />
          </div>
        </div>

        {/* Backup & Restore controls in the Sidebar */}
        <div className="pt-6 border-t border-slate-800 mt-6 space-y-3">
          <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-3">
            Cópia de Segurança
          </div>
          <div className="grid grid-cols-2 gap-2 px-3">
            <button
              onClick={handleExportBackup}
              title="Exportar dados para um arquivo JSON local"
              className="flex items-center justify-center gap-1.5 bg-slate-850 hover:bg-slate-800 text-slate-200 py-2 px-2 rounded-xl text-xs font-bold transition-all border border-slate-800 hover:border-slate-700 active:scale-95 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-indigo-400" />
              <span>Backup</span>
            </button>
            <button
              onClick={() => document.getElementById("restore-input-sidebar")?.click()}
              title="Restaurar dados a partir de um arquivo JSON"
              className="flex items-center justify-center gap-1.5 bg-slate-850 hover:bg-slate-800 text-slate-200 py-2 px-2 rounded-xl text-xs font-bold transition-all border border-slate-800 hover:border-slate-700 active:scale-95 cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5 text-indigo-400" />
              <span>Restaurar</span>
            </button>
          </div>
          <input
            type="file"
            id="restore-input-sidebar"
            accept=".json"
            onChange={handleImportBackup}
            className="hidden"
          />
        </div>
      </nav>

      {/* Footer Profile Avatar */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/40">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center font-black text-sm">
            UF
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-xs text-white font-semibold truncate">Usuário Focado</p>
            <p className="text-[10px] text-slate-500 truncate">Jornada Saudável</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen w-full bg-slate-50 text-slate-900 font-sans overflow-hidden">
      {/* Desktop Sidebar (Permanent) */}
      <aside className="hidden lg:flex w-64 bg-slate-900 border-r border-slate-800 flex-col shrink-0">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer (Collapsible) */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 flex lg:hidden">
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black"
            />
            {/* Drawer Body */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", bounce: 0, duration: 0.3 }}
              className="relative w-64 max-w-xs h-full bg-slate-900 flex flex-col z-50"
            >
              <div className="absolute top-4 right-4 text-white">
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 rounded-full bg-slate-800 text-slate-300 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              {sidebarContent}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header Command Bar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-8 shrink-0">
          <div className="flex items-center gap-4">
            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 -ml-2 text-slate-500 hover:text-slate-800 focus:outline-none"
            >
              <Menu className="w-6 h-6" />
            </button>
            
            {/* Search inputs */}
            <div className="relative w-48 md:w-80">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-slate-400" />
              </span>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-9 pr-3 py-1.5 border border-slate-200 rounded-lg text-sm bg-slate-50 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-medium"
                placeholder="Pesquisar histórico..."
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => {
                const element = document.getElementById("registro-form-card");
                if (element) {
                  element.scrollIntoView({ behavior: "smooth", block: "center" });
                  // highlight effect animation
                  element.classList.add("ring-2", "ring-indigo-500");
                  setTimeout(() => {
                    element.classList.remove("ring-2", "ring-indigo-500");
                  }, 1500);
                }
              }}
              className="bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white px-4 py-1.5 rounded-lg text-xs md:text-sm font-bold transition-all flex items-center gap-2 shadow-sm cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Novo Registro</span>
            </button>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto bg-slate-50 custom-scrollbar p-4 md:p-8">
          <div className="max-w-6xl mx-auto space-y-6">
            
            {/* Quick alert helper for setting goals */}
            {(!appData.config.pesoInicial || !appData.config.metaPerda) && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-sm text-indigo-800"
              >
                <div>
                  <span className="font-bold">🎯 Defina seu perfil de emagrecimento!</span> Configure seu peso inicial e meta de perda de peso no painel lateral de configurações para liberar todos os indicadores.
                </div>
                <button
                  onClick={() => setActiveTab("perfil")}
                  className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-1 px-3 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
                >
                  Configurar Agora
                </button>
              </motion.div>
            )}

            {/* If Mobile Perfil View Active */}
            {activeTab === "perfil" ? (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                  <div className="mb-6">
                    <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">Configurações Gerais do Perfil</h2>
                    <p className="text-sm text-slate-500">Mantenha seu progresso sincronizado atualizando sua meta e peso de partida.</p>
                  </div>
                  <ConfigPerfil
                    config={appData.config}
                    onChange={handleConfigChange}
                    inSidebar={false}
                  />
                </div>

                {/* Database Backup & Restore Card */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                  <div className="mb-4">
                    <h3 className="text-lg font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
                      <Database className="w-5 h-5 text-indigo-500" />
                      Gerenciamento de Dados
                    </h3>
                    <p className="text-xs text-slate-500">
                      Exporte todos os seus dados e registros de peso para um arquivo JSON seguro ou restaure uma cópia anterior.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex flex-col justify-between">
                      <div>
                        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Criar Cópia de Segurança</h4>
                        <p className="text-[11px] text-slate-400 mb-4">Gera um arquivo .json para você guardar no computador ou celular.</p>
                      </div>
                      <button
                        onClick={handleExportBackup}
                        className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-black py-2.5 px-4 rounded-xl text-xs uppercase tracking-widest active:scale-95 transition-all cursor-pointer shadow-sm"
                      >
                        <Download className="w-4 h-4" />
                        <span>Fazer Backup JSON</span>
                      </button>
                    </div>

                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex flex-col justify-between">
                      <div>
                        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Restaurar de um Arquivo</h4>
                        <p className="text-[11px] text-slate-400 mb-4">Escolha um arquivo backup JSON gerado anteriormente para restaurar.</p>
                      </div>
                      <button
                        onClick={() => document.getElementById("restore-input-main")?.click()}
                        className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-black py-2.5 px-4 rounded-xl text-xs uppercase tracking-widest active:scale-95 transition-all cursor-pointer shadow-sm"
                      >
                        <Upload className="w-4 h-4" />
                        <span>Restaurar Backup JSON</span>
                      </button>
                      <input
                        type="file"
                        id="restore-input-main"
                        accept=".json"
                        onChange={handleImportBackup}
                        className="hidden"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <button
                    onClick={() => setActiveTab("dashboard")}
                    className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-colors cursor-pointer"
                  >
                    Voltar ao Dashboard
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {/* Stats row */}
                <div className="grid grid-cols-1 gap-6">
                  <DashboardStatus
                    config={appData.config}
                    registros={appData.registros}
                  />
                </div>

                {/* Charts row */}
                <GraficosDashboard registros={appData.registros} />

                {/* Grid for actions & history */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div id="registro-form-card" className="transition-all duration-300 rounded-2xl">
                    <RegistroForm onAddRegistro={handleAddRegistro} />
                  </div>
                  <HistoricoTabela
                    registros={filteredRegistros}
                    onDeleteRegistro={handleDeleteRegistro}
                  />
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
