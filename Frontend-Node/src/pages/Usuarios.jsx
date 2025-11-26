// src/pages/Usuarios.jsx
import { useEffect, useState } from "react";
import { api } from "@/api/axios";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    const fetchUsers = async () => {

      try {
        // Llamada al backend - obtener lista de usuarios
        const res = await api.get("/users/list"); // -> http://localhost:3000/api/users/list
        if (!mounted) return;
        // adapta según la forma en que tu backend responde:
        // puede venir en res.data.users o res.data.data etc.
        const usersData = res.data.users ?? res.data;
        setUsuarios(Array.isArray(usersData) ? usersData : []);
      } catch (err) {
        console.error("Error cargando usuarios:", err);
        setError(err.response?.data?.msg || err.message || "Error al cargar usuarios");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchUsers();
    return () => { mounted = false; };
  }, []);

  if (loading) return <p className="p-4">Cargando usuarios...</p>;
  if (error) return <p className="p-4 text-red-500">Error: {error}</p>;

  return (
    <div className="p-4">
      <Card>
        <CardHeader>
          <CardTitle>Lista de Usuarios ({usuarios.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="py-2 text-left">ID</th>
                  <th className="py-2 text-left">Nombre</th>
                  <th className="py-2 text-left">Email</th>
                </tr>
              </thead>

              <tbody>
                {usuarios.map((u) => (
                  <tr key={u.id ?? u.user_id} className="border-b">
                    <td className="py-2">{u.id ?? u.user_id}</td>
                    <td className="py-2">{u.name ?? u.nombre ?? u.fullname ?? "-"}</td>
                    <td className="py-2">{u.email ?? u.correo ?? "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
