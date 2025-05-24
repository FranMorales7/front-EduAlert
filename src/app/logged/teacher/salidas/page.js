import BlurBackground from "@/components/ui/BlurBackground";
import TripsTable from "@/components/tables/TripsTable";

export default function Trips() {
  return (
    <BlurBackground>
      <h2 className="text-xl font-bold mb-4">Panel de salidas</h2>
      <h2 className="text-md text-gray-600 ml-4 mb-4">Puedes gestionar las salidas creadas por tí.</h2>
      <TripsTable />
    </BlurBackground>
  );
}
