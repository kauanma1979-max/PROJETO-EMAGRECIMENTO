import { useMemo } from "react";
import { History, Trash2 } from "lucide-react";
import { Registro } from "../types";

interface HistoricoTabelaProps {
  registros: Registro[];
  onDeleteRegistro: (id: string) => void;
}

export default function HistoricoTabela({
  registros,
  onDeleteRegistro,
}: HistoricoTabelaProps) {
  // Compute ordered and sorted list
  const sortedRegistros = useMemo(() => {
    const withOriginalIndex = registros.map((r, index) => ({
      ...r,
      originalIndex: index + 1,
    }));
    return withOriginalIndex.sort(
      (a, b) => new Date(b.data).getTime() - new Date(a.data).getTime()
    );
  }, [registros]);

  const handleDelete = (id: string) => {
    if (window.confirm("Excluir este registro?")) {
      onDeleteRegistro(id);
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    const [year, month, day] = dateStr.split("-");
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 lg:col-span-2 flex flex-col">
      <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
        <h2 className="text-lg font-bold text-slate-700 uppercase tracking-wider flex items-center">
          <History className="w-5 h-5 mr-2 text-indigo-500" />
          Histórico Detalhado
        </h2>
        <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-md font-bold">
          {sortedRegistros.length} registros
        </span>
      </div>

      <div className="overflow-x-auto custom-scrollbar max-h-[500px]">
        <table className="min-w-full divide-y divide-slate-100 text-sm">
          <thead className="bg-slate-50 sticky top-0 z-10">
            <tr className="text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              <th className="px-6 py-3">Avaliação</th>
              <th className="px-6 py-3">Data</th>
              <th className="px-6 py-3">Peso</th>
              <th className="px-6 py-3">Nível Fome</th>
              <th className="px-6 py-3">Obs.</th>
              <th className="px-6 py-3 text-center">Ações</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-100">
            {sortedRegistros.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-12 text-center text-sm text-slate-400 font-medium"
                >
                  Nenhum registro encontrado. Comece adicionando um ao lado!
                </td>
              </tr>
            ) : (
              sortedRegistros.map((reg) => {
                // Determine Hunger Badge style
                let hungerBadgeClass = "bg-emerald-100 text-emerald-800";
                if (reg.fome > 7) {
                  hungerBadgeClass = "bg-rose-100 text-rose-800";
                } else if (reg.fome > 4) {
                  hungerBadgeClass = "bg-amber-100 text-amber-800";
                }

                return (
                  <tr key={reg.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4 text-xs font-black text-indigo-600 uppercase">
                      #{reg.originalIndex}
                    </td>
                    <td className="px-6 py-4 text-xs font-bold text-slate-500">
                      {formatDate(reg.data)}
                    </td>
                    <td className="px-6 py-4 text-sm font-black text-slate-800">
                      {reg.peso.toFixed(1)} kg
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${hungerBadgeClass}`}>
                          {reg.fome}/10
                        </span>
                        <div className="w-12 bg-slate-100 rounded-full h-1.5 hidden sm:block">
                          <div
                            className={`h-1.5 rounded-full ${
                              reg.fome > 7 ? "bg-rose-500" : reg.fome > 4 ? "bg-amber-500" : "bg-emerald-500"
                            }`}
                            style={{ width: `${reg.fome * 10}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td
                      className="px-6 py-4 text-xs text-slate-500 italic max-w-[150px] truncate"
                      title={reg.obs || "Sem observações"}
                    >
                      {reg.obs || "---"}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleDelete(reg.id)}
                        className="p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all cursor-pointer"
                        title="Excluir Registro"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
