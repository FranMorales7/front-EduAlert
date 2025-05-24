'use client';

import { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer,
} from 'recharts';
import useAuthUser from "@/hooks/useAuthUser";
import { getAllStudents } from "@/requests/students";
import { getAllGroups } from "@/requests/groups";
import { getAllIncidents } from "@/requests/incidents";
import toast from 'react-hot-toast';

export default function GroupGraphics() {
  const [alumnosPorGrupo, setAlumnosPorGrupo] = useState([]);
  const [incidenciasPorGrupo, setIncidenciasPorGrupo] = useState([]);
  const { session } = useAuthUser();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = session?.user?.accessToken;

        const [groupsRes, studentsRes, incidentsRes] = await Promise.all([
          getAllGroups(token),
          getAllStudents(token),
          getAllIncidents(token),
        ]);

        const groups = groupsRes.data;
        const students = studentsRes.data;
        const incidents = incidentsRes.data;

        // Contar alumnos por grupo
        const alumnosGroupMap = groups.map((group) => {
          const count = students.filter((al) => al.group_id === group.id).length;
          return { name: group.name, cantidad: count };
        });

        // Contar incidencias por grupo (desde las lecciones)
        const incidentesGroupMap = groups.map((group) => {
          const count = incidents.filter((inc) =>
            inc.lesson?.group_id === group.id
          ).length;
          return { name: group.name, cantidad: count };
        });

        setAlumnosPorGrupo(alumnosGroupMap);
        setIncidenciasPorGrupo(incidentesGroupMap);

      } catch (error) {
        console.error('Error cargando datos por grupo:', error.message);
        toast.error('Error al mostrar datos de la gráfica');
      }
    };

    if (session?.user?.accessToken) fetchData();
  }, [session]);

  return (
    <div className="px-4">
        <h2 className="text-lg font-semibold mb-2">Alumnos por grupo</h2>
        <div className="h-72 w-full mb-8">
            <ResponsiveContainer width="100%" height="100%">
            <BarChart data={alumnosPorGrupo}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis className='text-xs' dataKey="name" />
                <YAxis className='text-xs' allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="cantidad" fill="#4ade80" />
            </BarChart>
            </ResponsiveContainer>
        </div>

        <h2 className="text-lg font-semibold mb-2">Incidencias por grupo</h2>
        <div className="h-72 w-">
            <ResponsiveContainer width="100%" height="100%">
            <BarChart data={incidenciasPorGrupo}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis className='text-xs' dataKey="name" />
                <YAxis className='text-xs' allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="cantidad" fill="#f97316" />
            </BarChart>
            </ResponsiveContainer>
        </div>
    </div>
  );
}
