import BlurBackground from "@/components/BlurBackground";
import IncidentsCard from "@/components/incidentsCard";
import TripsCard from "@/components/tripsCard";

export default function Notices() {
  return (
    <BlurBackground>
      <h2 className="text-xl font-bold mb-4">Panel de avisos</h2>
      <h2 className="text-md text-gray-600 ml-4">Aquí verás los últimos avisos.</h2>
      <div className="flex justify-center items-start gap-12 px-6 py-10 h-full">
        <div className="w-1/2 bg-gray-100 rounded p-5 shadow-md">
          <h2 className="text-xl font-semibold mb-8">Últimas incidencias</h2>
          <IncidentsCard/>
        </div>
        <div className="w-1/2 bg-gray-100 rounded p-5 shadow-md">
          <h2 className="text-xl font-semibold mb-4">Últimas salidas</h2>
          <TripsCard />
        </div>
      </div>
    </BlurBackground>
  );
}
