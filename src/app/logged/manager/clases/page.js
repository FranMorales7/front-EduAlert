import BlurBackground from '@/components/ui/BlurBackground';
import LessonsTable from '@/components/tables/LessonsTable';

export default function ClassesPage() {

  return (
    <BlurBackground>
      <h2 className="text-xl font-bold mb-4">Panel de clases</h2>
      <h2 className="text-md text-gray-600 ml-4 mb-4">Puedes gestionar todas las clases.</h2>
      <LessonsTable />
    </BlurBackground>
  );
}
