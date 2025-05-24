import BlurBackground from '@/components/BlurBackground';
import StudentsTable from '@/components/tables/StudentsTable';

export default function StudentssList() {
  return (
    <BlurBackground>
      <h2 className="text-xl font-bold mb-4">Panel de aulas</h2>
      <h2 className="text-md text-gray-600 ml-4 mb-4">Puedes gestionar todas las aulas.</h2>
      <StudentsTable />
    </BlurBackground>
  );
}
