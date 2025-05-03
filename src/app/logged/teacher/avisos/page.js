import BlurBackground from "@/components/BlurBackground";
import CardAvisos from "@/components/card-avisos";

export default function Avisos() {
  return (
    <BlurBackground>
      <div className="flex">  
        <div className="w-1/2 mx-4">
          <h2 className="text-xl font-semibold mb-4"> Avisos </h2>
          <CardAvisos />
        </div>
        <div className="border-l-4 border-black w-1/2 h-screen ml-4">
          <div className="bg-gray-200 border-b-4 border-black h-1/2">
            <h2 className="text-xl font-semibold mb-4"> Crear incidencia </h2>
            <p>Botón MODAL</p>
          </div>
          <div className="bg-gray-200 h-1/2">
            <h2 className="text-xl font-semibold mb-4"> Crear salida al baño </h2>
            <p>Botón MODAL</p>
          </div>
        </div>
      </div>
    </BlurBackground>
  );
}
