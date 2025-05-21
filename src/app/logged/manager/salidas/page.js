import BlurBackground from "@/components/BlurBackground";
import TablaSalidas from "@/components/TablaSalidas_admin";

export default function Trips() {
  return (
    <BlurBackground>
      <h2 className="text-xl font-bold mb-4">Panel de salidas</h2>
      <h2 className="text-md text-gray-600 ml-4 mb-4">Puedes gestionar todas las salidas creadas.</h2>
      <TablaSalidas />
    </BlurBackground>
  );
}