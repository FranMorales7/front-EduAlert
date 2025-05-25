import IndexGraphic from "@/components/graphics/GeneralGraphics";
import GroupGraphics from "@/components/graphics/GroupGraphics";
import BlurBackground from "@/components/ui/BlurBackground";
import Header from "@/components/ui/header";

export default function IndexPage() {
 // Página de renderizado de datos de la plataforma
 
  return (
    <BlurBackground>
      <Header />
      <h2 className="text-md text-gray-600 ml-4 mb-4">Estadísticas generales de la plataforma</h2>
      <div className="flex grid grid-cols-2 gap-5">
        <IndexGraphic />
        <GroupGraphics />
      </div>
      
    </BlurBackground>
  );
}
