import BlurBackground from "@/components/BlurBackground";
import TablaIncidencias from "@/components/TablaIncidencias_admin";

export default function Incidents() {
  return (
    <BlurBackground>
      <h2 className="text-xl font-bold mb-4">Panel de incidencias</h2>
      <h2 className="text-md text-gray-600 ml-4 mb-4">Puedes gestionar todas las incidencias creadas.</h2>
      <TablaIncidencias />
    </BlurBackground>
  );
}
