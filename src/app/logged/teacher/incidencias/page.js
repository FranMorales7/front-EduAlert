import BlurBackground from "@/components/BlurBackground";
import IncidentsTable from "@/components/tables/IncidentsTable";

export default function Incidents() {
  return (
    <BlurBackground>
      <h2 className="text-xl font-bold mb-4">Panel de incidencias</h2>
      <h2 className="text-md text-gray-600 ml-4 mb-4">Puedes gestionar las incidencias creadas por tí.</h2>
      <IncidentsTable />
    </BlurBackground>
  );
}
