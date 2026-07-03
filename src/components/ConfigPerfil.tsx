import { User } from "lucide-react";
import { AppConfig } from "../types";

interface ConfigPerfilProps {
  config: AppConfig;
  onChange: (key: keyof AppConfig, value: string | number) => void;
  inSidebar?: boolean;
}

export default function ConfigPerfil({ config, onChange, inSidebar = false }: ConfigPerfilProps) {
  if (inSidebar) {
    return (
      <div className="space-y-4">
        <div>
          <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest">
            Peso Inicial (kg)
          </label>
          <input
            type="number"
            step="0.1"
            value={config.pesoInicial || ""}
            onChange={(e) =>
              onChange("pesoInicial", parseFloat(e.target.value) || 0)
            }
            className="mt-1 block w-full rounded-lg bg-slate-800 border-slate-700 text-slate-100 placeholder-slate-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 p-2 border font-bold text-sm outline-none transition-all"
            placeholder="0.0"
          />
        </div>
        <div>
          <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest">
            Meta de Perda (kg)
          </label>
          <input
            type="number"
            step="0.1"
            value={config.metaPerda || ""}
            onChange={(e) =>
              onChange("metaPerda", parseFloat(e.target.value) || 0)
            }
            className="mt-1 block w-full rounded-lg bg-slate-800 border-slate-700 text-slate-100 placeholder-slate-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 p-2 border font-bold text-sm outline-none transition-all"
            placeholder="0.0"
          />
        </div>
        <div>
          <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest">
            Data de Início
          </label>
          <input
            type="date"
            value={config.dataInicio}
            onChange={(e) => onChange("dataInicio", e.target.value)}
            className="mt-1 block w-full rounded-lg bg-slate-800 border-slate-700 text-slate-100 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 p-2 border font-bold text-sm outline-none transition-all"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
      <h2 className="text-lg font-bold mb-4 text-slate-700 flex items-center uppercase tracking-wider">
        <User className="w-5 h-5 mr-2 text-indigo-500" />
        Configurações do Perfil
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">
            Peso Inicial (kg)
          </label>
          <input
            type="number"
            step="0.1"
            value={config.pesoInicial || ""}
            onChange={(e) =>
              onChange("pesoInicial", parseFloat(e.target.value) || 0)
            }
            className="mt-1.5 block w-full rounded-lg border-slate-200 focus:border-indigo-500 focus:ring-indigo-500 p-2.5 border font-bold text-slate-700 outline-none transition-all"
            placeholder="0.0"
          />
        </div>
        <div>
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">
            Meta de Perda (kg)
          </label>
          <input
            type="number"
            step="0.1"
            value={config.metaPerda || ""}
            onChange={(e) =>
              onChange("metaPerda", parseFloat(e.target.value) || 0)
            }
            className="mt-1.5 block w-full rounded-lg border-slate-200 focus:border-indigo-500 focus:ring-indigo-500 p-2.5 border font-bold text-slate-700 outline-none transition-all"
            placeholder="0.0"
          />
        </div>
        <div>
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">
            Data de Início
          </label>
          <input
            type="date"
            value={config.dataInicio}
            onChange={(e) => onChange("dataInicio", e.target.value)}
            className="mt-1.5 block w-full rounded-lg border-slate-200 focus:border-indigo-500 focus:ring-indigo-500 p-2.5 border font-bold text-slate-700 outline-none transition-all"
          />
        </div>
      </div>
    </div>
  );
}
