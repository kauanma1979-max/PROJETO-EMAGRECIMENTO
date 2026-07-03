import { useState, FormEvent } from "react";
import { PlusCircle } from "lucide-react";
import { Registro } from "../types";

interface RegistroFormProps {
  onAddRegistro: (registro: Omit<Registro, "id">) => void;
}

export default function RegistroForm({ onAddRegistro }: RegistroFormProps) {
  // Use local date format YYYY-MM-DD
  const getTodayString = () => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const [data, setData] = useState(getTodayString());
  const [peso, setPeso] = useState("");
  const [fome, setFome] = useState(5);
  const [obs, setObs] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!data || !peso) return;

    onAddRegistro({
      data,
      peso: parseFloat(peso),
      fome,
      obs,
    });

    // Reset inputs
    setPeso("");
    setFome(5);
    setObs("");
    setData(getTodayString());
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 h-fit">
      <h2 className="text-lg font-bold mb-4 text-slate-700 uppercase tracking-wider flex items-center">
        <PlusCircle className="w-5 h-5 mr-2 text-indigo-500" />
        Novo Registro
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Data
            </label>
            <input
              type="date"
              required
              value={data}
              onChange={(e) => setData(e.target.value)}
              className="mt-1.5 block w-full rounded-lg border-slate-200 p-2 border text-sm font-bold text-slate-700 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
            />
          </div>
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Peso (kg)
            </label>
            <input
              type="number"
              step="0.1"
              required
              value={peso}
              onChange={(e) => setPeso(e.target.value)}
              placeholder="0.0"
              className="mt-1.5 block w-full rounded-lg border-slate-200 p-2 border text-sm font-bold text-slate-700 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">
            Nível de Fome
          </label>
          <input
            type="range"
            min="0"
            max="10"
            value={fome}
            onChange={(e) => setFome(parseInt(e.target.value))}
            className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-500 focus:outline-none mt-3"
          />
          <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-bold">
            <span>POUCA</span>
            <span className="text-indigo-600 text-sm font-black">{fome}</span>
            <span>MUITA</span>
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">
            Observações
          </label>
          <textarea
            rows={3}
            value={obs}
            onChange={(e) => setObs(e.target.value)}
            placeholder="Como foi seu dia? Alimentação, treinos..."
            className="mt-1.5 block w-full rounded-lg border-slate-200 p-2 border text-sm text-slate-700 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-slate-400"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white py-3 rounded-xl transition-all font-black shadow-sm uppercase tracking-widest text-xs"
        >
          Registrar Agora
        </button>
      </form>
    </div>
  );
}
