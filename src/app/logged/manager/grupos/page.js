import BlurBackground from '@/components/BlurBackground';
import TablaGrupos from '@/components/tables/GroupsTable';

export default function GroupsPage() {

  return (
    <BlurBackground>
      <h2 className="text-xl font-bold mb-4">Panel de grupos</h2>
      <h2 className="text-md text-gray-600 ml-4 mb-4">Puedes gestionar todos los grupos.</h2>
      <TablaGrupos />
    </BlurBackground>
  );
}
