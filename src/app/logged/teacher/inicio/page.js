import BlurBackground from "@/components/BlurBackground";
import Header from "@/components/header";

export default function Configuration() {
  const nombre = 'Manollo';
  return (
    <BlurBackground className="">
      <Header />A continuación se muestra tu horario para hoy.
    </BlurBackground>
  );
}
