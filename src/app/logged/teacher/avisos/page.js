import BlurBackground from "@/components/BlurBackground";
import CardAvisos from "@/components/card-avisos";

export default function Avisos() {
  return (
    <BlurBackground>
      <h2 className="text-xl font-semibold mb-4"> Avisos </h2>
      <CardAvisos />
    </BlurBackground>
  );
}
