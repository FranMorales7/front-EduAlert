import BlurBackground from '@/components/ui/BlurBackground';
import StudentsTable from '@/components/tables/StudentsTable';

export default function StudentssList() {
  return (
    <BlurBackground>
      <h2 className="text-xl font-bold mb-4">Panel de alumnado</h2>
      <h2 className="text-md text-gray-600 ml-4 mb-4">Puedes gestionar todos los alumnos.</h2>
      <StudentsTable />
    </BlurBackground>
  );
}
