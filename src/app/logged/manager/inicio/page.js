import BlurBackground from "@/components/BlurBackground";
import Header from "@/components/header";

export default function IndexPage() {
  return (
    <BlurBackground className="">
      <Header />
      <h2 className="text-md text-gray-600 ml-4">A continuación se muestra información de interés.</h2>
    </BlurBackground>
  );
}
