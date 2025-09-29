import { useEffect, useState } from "react";
import client from "@/api";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Pie } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

// Componentes reutilizables
const StatCard = ({ title, value }) => (
  <div className="bg-white p-4 rounded-lg shadow">
    <h3 className="text-gray-500 text-sm">{title}</h3>
    <p className="text-2xl font-bold">{value}</p>
  </div>
);

const ChartCard = ({ title, children }) => (
  <div className="bg-white p-4 rounded-lg shadow h-full">
    <h3 className="font-semibold mb-4">{title}</h3>
    <div className="h-64">{children}</div>
  </div>
);

export default function PetStatsDashboard() {
  const [stats, setStats] = useState({
    total: 0,
    porEspecie: {},
    porGenero: {},
    especieGenero: {},
    topRazas: {},
    filtroEspecie: "Todas",
    loading: true,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await client.post("/mascota/list", { query: { find: {} } });
        const mascotas = res.data.list || [];

        const porEspecie = {};
        const porGenero = {};
        const especieGenero = {};
        const razaCounter = {};

        mascotas.forEach((m) => {
          // Especie
          porEspecie[m.especie] = (porEspecie[m.especie] || 0) + 1;

          // Género
          porGenero[m.genero] = (porGenero[m.genero] || 0) + 1;

          // Especie-Género
          const key = `${m.especie}-${m.genero}`;
          especieGenero[key] = (especieGenero[key] || 0) + 1;

          // Raza
          razaCounter[m.raza] = (razaCounter[m.raza] || 0) + 1;
        });

        const topRazas = Object.entries(razaCounter)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)
          .reduce((obj, [k, v]) => ({ ...obj, [k]: v }), {});

        setStats({
          total: mascotas.length,
          porEspecie,
          porGenero,
          especieGenero,
          topRazas,
          filtroEspecie: "Todas",
          loading: false,
        });
      } catch (error) {
        console.error("Error al cargar estadísticas:", error);
        setStats((s) => ({ ...s, loading: false }));
      }
    };

    fetchData();
  }, []);

  const especies = Object.keys(stats.porEspecie);
  const generos = ["Macho", "Hembra"];

  const especieFiltro = stats.filtroEspecie;
  const especieGeneroData = generos.map((gen) =>
    especies.map((esp) => stats.especieGenero[`${esp}-${gen}`] || 0)
  );

  if (stats.loading)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center py-10">Cargando estadísticas...</div>
      </div>
    );

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Estadísticas de Mascotas</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <StatCard title="Total Registradas" value={stats.total} />
          <StatCard title="Especies distintas" value={especies.length} />
          <StatCard title="Razas más comunes" value={Object.keys(stats.topRazas).length} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartCard title="Distribución por Género">
            <Pie
              data={{
                labels: Object.keys(stats.porGenero),
                datasets: [
                  {
                    data: Object.values(stats.porGenero),
                    backgroundColor: ["#60A5FA", "#FBBF24"],
                  },
                ],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { position: "bottom" },
                },
              }}
            />
          </ChartCard>

          <ChartCard title="Razas Más Comunes (Top 5)">
            <Bar
              data={{
                labels: Object.keys(stats.topRazas),
                datasets: [
                  {
                    label: "Cantidad",
                    data: Object.values(stats.topRazas),
                    backgroundColor: "#34D399",
                  },
                ],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { display: false },
                },
                scales: {
                  y: { beginAtZero: true, ticks: { stepSize: 1 } },
                },
              }}
            />
          </ChartCard>
        </div>

        <div className="mt-6">
          <ChartCard title="Comparación Especie vs Género">
            <Bar
              data={{
                labels: especies,
                datasets: generos.map((gen, i) => ({
                  label: gen,
                  data: especieGeneroData[i],
                  backgroundColor: i === 0 ? "#93C5FD" : "#FBCFE8",
                })),
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { position: "bottom" },
                },
                scales: {
                  y: { beginAtZero: true, ticks: { stepSize: 1 } },
                },
              }}
            />
          </ChartCard>
        </div>
      </div>
    </div>
  );
}
