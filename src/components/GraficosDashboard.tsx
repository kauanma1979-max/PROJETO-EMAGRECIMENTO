import { useMemo } from "react";
import { LineChart as LucideLineChart, BarChart3 } from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  CartesianGrid,
} from "recharts";
import { Registro } from "../types";

interface GraficosDashboardProps {
  registros: Registro[];
}

export default function GraficosDashboard({ registros }: GraficosDashboardProps) {
  // Process and sort records ascendingly by date (oldest to newest) for chronological progress
  const chartData = useMemo(() => {
    const sorted = [...registros].sort(
      (a, b) => new Date(a.data).getTime() - new Date(b.data).getTime()
    );
    return sorted.map((reg, index) => ({
      name: `#${index + 1}`,
      peso: reg.peso,
      fome: reg.fome,
      data: reg.data,
      obs: reg.obs,
    }));
  }, [registros]);

  // Determine minimum and maximum weight to auto-focus the Y axis beautifully
  const weightDomain = useMemo(() => {
    if (chartData.length === 0) return [0, 100];
    const weights = chartData.map((d) => d.peso);
    const min = Math.min(...weights);
    const max = Math.max(...weights);
    const padding = (max - min) * 0.1 || 2; // avoid min=max issue
    return [Math.floor(min - padding), Math.ceil(max + padding)];
  }, [chartData]);

  // Custom Tooltip component for weight
  const CustomWeightTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const [year, month, day] = data.data.split("-");
      return (
        <div className="bg-white p-3 border border-slate-200 rounded-xl shadow-md text-xs">
          <p className="font-black text-slate-700 mb-1">{`${day}/${month}/${year}`}</p>
          <p className="text-indigo-600 font-bold">{`Peso: ${data.peso.toFixed(1)} kg`}</p>
          {data.obs && (
            <p className="text-slate-400 italic mt-1 max-w-[200px] text-[10px] break-words">
              &quot;{data.obs}&quot;
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  // Custom Tooltip component for hunger
  const CustomHungerTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const [year, month, day] = data.data.split("-");
      return (
        <div className="bg-white p-3 border border-slate-200 rounded-xl shadow-md text-xs">
          <p className="font-black text-slate-700 mb-1">{`${day}/${month}/${year}`}</p>
          <p className="text-indigo-600 font-bold">{`Fome: ${data.fome}/10`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {/* Chart 1: Progresso de Peso */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <h2 className="text-lg font-bold mb-4 text-slate-700 uppercase tracking-wider flex items-center">
          <LucideLineChart className="w-5 h-5 mr-2 text-indigo-500" />
          Progresso de Peso
        </h2>
        <div className="h-[280px] w-full">
          {chartData.length === 0 ? (
            <div className="h-full w-full flex items-center justify-center text-sm text-slate-400 font-medium">
              Sem dados de peso para exibir
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorPeso" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="name"
                  stroke="#94a3b8"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  domain={weightDomain}
                  stroke="#94a3b8"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip content={<CustomWeightTooltip />} />
                <Area
                  type="monotone"
                  dataKey="peso"
                  stroke="#4f46e5"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorPeso)"
                  dot={{ r: 4, fill: "#4f46e5", strokeWidth: 0 }}
                  activeDot={{ r: 6 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Chart 2: Análise de Fome */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <h2 className="text-lg font-bold mb-4 text-slate-700 uppercase tracking-wider flex items-center">
          <BarChart3 className="w-5 h-5 mr-2 text-indigo-500" />
          Análise de Fome
        </h2>
        <div className="h-[280px] w-full">
          {chartData.length === 0 ? (
            <div className="h-full w-full flex items-center justify-center text-sm text-slate-400 font-medium">
              Sem dados de fome para exibir
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="name"
                  stroke="#94a3b8"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  domain={[0, 10]}
                  stroke="#94a3b8"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip content={<CustomHungerTooltip />} />
                <Bar
                  dataKey="fome"
                  fill="#6366f1"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}
