'use client';

import { useEffect, useState } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import useAuthUser from "@/hooks/useAuthUser";
import { getAllStudents } from "@/requests/students";
import { getAllTeachers } from "@/requests/teachers";
import { getAllGroups } from "@/requests/groups";
import { getAllIncidents } from "@/requests/incidents";
import { getAllTrips } from "@/requests/trips";
import toast from 'react-hot-toast';

const COLORS = ['#6366f1', '#60a5fa', '#34d399', '#facc15', '#f87171'];

export default function IndexGraphic() {
  const [data, setData] = useState([]);
  const { session } = useAuthUser();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = session?.accessToken;
        console.log('Token: ', token)
        const [
          teachersRes,
          studentsRes,
          groupsRes,
          incidentsRes,
          tripsRes,
        ] = await Promise.all([
          getAllTeachers(token),
          getAllStudents(token),
          getAllGroups(token),
          getAllIncidents(token),
          getAllTrips(token),
        ]);

        setData([
          { name: 'Profesores', value: teachersRes.data.length },
          { name: 'Alumnos', value: studentsRes.data.length },
          { name: 'Grupos', value: groupsRes.data.length },
          { name: 'Incidencias', value: incidentsRes.data.length },
          { name: 'Salidas baño', value: tripsRes.data.length },
        ]);
      } catch (error) {
        console.error('Error cargando datos del dashboard:', error.message);
        toast.error('Error al mostrar datos de la gráfica');
      }
    };

    if (session?.accessToken) fetchData();
  }, [session]);

  return (
    <div className="w-full h-full -ml-10">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={70}
            outerRadius={100}
            fill="#8884d8"
            paddingAngle={3}
            label
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend layout="vertical" verticalAlign="middle" align="right" />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
