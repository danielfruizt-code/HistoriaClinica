import { useState } from "react";
import "./App.css";
import Tablas from "./Components/Tablas";
import ModalDetalle from "./Components/ModalDetalle";

function App() {
  const [historiaSeleccionada, setHistoriaSeleccionada] = useState(null);

  const [historiasClinicas, setHistoriasClinicas] = useState([
    {
      id: "HC-001",
      nombre: "Juan Pérez",
      documento: "CC 123456789",
      edad: 40,
      direccion: "Calle 123 #45-67",
      telefono: "3001234567",
      antecedentesFamiliares: "Hipertensión",
      antecedentesPersonales: "Ninguno",
      alergias: "Penicilina",
      motivoConsulta: "Dolor de cabeza persistente",
      fechaConsulta: "2025-09-16",
      diagnostico: "Cefalea tensional",
      tratamiento: "Analgésicos y reposo",
      observaciones:
        "Paciente refiere dolor de cabeza recurrente desde hace 2 semanas.",
      medico: "Dr. Carlos Gómez",
      registroMedico: "RM-98765",
    },
    {
      id: "HC-002",
      nombre: "Ana López",
      documento: "CC 987654321",
      edad: 35,
      direccion: "Av. Principal 45",
      telefono: "3019876543",
      antecedentesFamiliares: "Asma en madre",
      antecedentesPersonales: "Rinitis alérgica",
      alergias: "Polvo y pólenes",
      motivoConsulta: "Dificultad respiratoria y tos nocturna",
      fechaConsulta: "2025-09-14",
      diagnostico: "Asma bronquial",
      tratamiento: "Inhalador de rescate y control ambiental",
      observaciones: "Crisis asmática controlada con inhalador.",
      medico: "Dra. Laura Martínez",
      registroMedico: "RM-54321",
    },
    {
      id: "HC-003",
      nombre: "Carlos Ruiz",
      documento: "CC 456789123",
      edad: 50,
      direccion: "Carrera 56 #78-90",
      telefono: "3021122334",
      antecedentesFamiliares: "Diabetes en padre",
      antecedentesPersonales: "Cirugía de rodilla en 2018",
      alergias: "Ninguna conocida",
      motivoConsulta: "Dolor lumbar tras esfuerzo físico",
      fechaConsulta: "2025-09-10",
      diagnostico: "Lumbalgia aguda",
      tratamiento: "Reposo, analgésicos y fisioterapia",
      observaciones: "Dolor lumbar intenso tras esfuerzo físico.",
      medico: "Dr. Andrés Ramírez",
      registroMedico: "RM-11223",
    },
  ]);

  // 🔹 Guardar como NUEVA historia
  const handleGuardar = (nuevaHistoria) => {
    const nuevoId = `HC-${String(historiasClinicas.length + 1).padStart(
      3,
      "0"
    )}`;
    const historiaConId = { ...nuevaHistoria, id: nuevoId };

    setHistoriasClinicas((prev) => [...prev, historiaConId]);
    setHistoriaSeleccionada(null); // cerrar modal
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-start p-8">
      <h1 className="text-4xl font-bold text-blue-600 mb-8">
        Consulta de Historias Clínicas
      </h1>

      <Tablas
        data={historiasClinicas}
        onVerDetalle={(historia) => setHistoriaSeleccionada(historia)}
      />

      {historiaSeleccionada && (
        <ModalDetalle
          historia={historiaSeleccionada}
          onClose={() => setHistoriaSeleccionada(null)}
          onGuardar={handleGuardar}
        />
      )}
    </div>
  );
}

export default App;
