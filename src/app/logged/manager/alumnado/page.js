import BlurBackground from '@/components/BlurBackground';
import TablaAlumnos from '@/components/TablaAlumnos';

export default function StudentssList() {
  return (
    <BlurBackground>
      <h2 className="text-xl font-bold mb-4">Panel de alumnado</h2>
      <h2 className="text-md text-gray-600 ml-4 mb-4">Puedes gestionar todos los alumnos.</h2>
      <TablaAlumnos />
    </BlurBackground>
  );
}
