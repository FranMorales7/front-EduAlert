import BlurBackground from "@/components/ui/BlurBackground";
import FormularioUsuario from "@/components/formulario-usuario";

export default function Configuration() {
  return (
    <BlurBackground className="">
      <h2 className="text-xl font-bold mb-4">Panel de configuración</h2>
      <h2 className="text-md text-gray-600 ml-4 mb-4">Puedes editar tus datos.</h2>
      <FormularioUsuario />
    </BlurBackground>
  );
}
