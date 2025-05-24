import BlurBackground from '@/components/ui/BlurBackground';
import TeachersTable from '@/components/tables/TeachersTable';

export default function TeacherPage() {

  return (
    <BlurBackground>
      <h2 className="text-xl font-bold mb-4">Panel de profesorado</h2>
      <h2 className="text-md text-gray-600 ml-4 mb-4">Puedes gestionar todos los profesores.</h2>
      <TeachersTable />
    </BlurBackground>
  );
}
