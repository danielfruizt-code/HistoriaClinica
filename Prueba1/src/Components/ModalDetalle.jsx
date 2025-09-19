import { useState } from "react";
import Select from "react-select";

function ModalDetalle({ historia, onClose, onGuardar }) {
  // Lista de doctores
  const doctores = [
    { value: "Juan Pérez", label: "Dr. Juan Pérez - Medicina General" },
    { value: "Ana Gómez", label: "Dra. Ana Gómez - Pediatría" },
    { value: "Carlos Ruiz", label: "Dr. Carlos Ruiz - Cardiología" },
    { value: "Laura Torres", label: "Dra. Laura Torres - Neurología" },
  ];

  const [formData, setFormData] = useState({ ...historia });

  // Manejo de inputs normales
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Manejo del doctor seleccionado
  const handleDoctorChange = (selectedOption) => {
    setFormData((prev) => ({
      ...prev,
      medico: selectedOption ? selectedOption.value : "",
    }));
  };

  const handleGuardar = () => {
    onGuardar(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 px-4">
      <div
        className="bg-white rounded-lg shadow-lg w-full max-w-3xl relative flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b bg-white sticky top-0 z-10">
          <h2 className="text-2xl font-bold text-blue-600 text-center">
            Historia Clínica
          </h2>
        </div>

        {/* Contenido */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Identificación (no editable) */}
          <div className="border rounded-lg p-4 bg-gray-50 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">
              Identificación del Paciente
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                value={formData.id}
                readOnly
                className="w-full border rounded p-2 bg-gray-200 text-gray-600 cursor-not-allowed"
              />
              <input
                type="text"
                value={formData.nombre}
                readOnly
                className="w-full border rounded p-2 bg-gray-200 text-gray-600 cursor-not-allowed"
              />
              <input
                type="text"
                value={formData.documento}
                readOnly
                className="w-full border rounded p-2 bg-gray-200 text-gray-600 cursor-not-allowed"
              />
              <input
                type="number"
                value={formData.edad}
                readOnly
                className="w-full border rounded p-2 bg-gray-200 text-gray-600 cursor-not-allowed"
              />
            </div>
          </div>

          {/* Consulta Actual */}
          <div className="border rounded-lg p-4 bg-gray-50 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">
              Consulta Actual
            </h3>
            <textarea
              name="motivoConsulta"
              value={formData.motivoConsulta}
              onChange={handleChange}
              className="w-full border rounded p-2 mb-2"
              placeholder="Motivo de la consulta"
            />
            <input
              type="date"
              name="fechaConsulta"
              value={formData.fechaConsulta}
              onChange={handleChange}
              className="w-full border rounded p-2"
            />
          </div>

          {/* Diagnóstico y Manejo */}
          <div className="border rounded-lg p-4 bg-gray-50 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">
              Diagnóstico y Manejo
            </h3>
            <textarea
              name="diagnostico"
              value={formData.diagnostico}
              onChange={handleChange}
              className="w-full border rounded p-2 mb-2"
              placeholder="Diagnóstico"
            />
            <textarea
              name="tratamiento"
              value={formData.tratamiento}
              onChange={handleChange}
              className="w-full border rounded p-2 mb-2"
              placeholder="Tratamiento"
            />
            <textarea
              name="observaciones"
              value={formData.observaciones}
              onChange={handleChange}
              className="w-full border rounded p-2"
              placeholder="Observaciones"
            />
          </div>

          {/* Profesional Responsable */}
          <div className="border rounded-lg p-4 bg-gray-50 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">
              Profesional Responsable
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Select con buscador */}
              <div>
                <label className="block text-sm text-gray-500 mb-1">
                  Médico
                </label>
                <Select
                  options={doctores}
                  value={
                    doctores.find((d) => d.value === formData.medico) || null
                  }
                  onChange={handleDoctorChange}
                  placeholder="Selecciona un médico..."
                  isClearable
                />
              </div>
              <div>
                <label className="block text-sm text-gray-500 mb-1">
                  Registro Médico
                </label>
                <input
                  type="text"
                  name="registroMedico"
                  value={formData.registroMedico}
                  onChange={handleChange}
                  className="w-full border rounded p-2"
                  placeholder="Ej: CMP-12345"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-gray-50 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            Cerrar
          </button>
          <button
            onClick={handleGuardar}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Guardar Cambios
          </button>
        </div>
      </div>
    </div>
  );
}

export default ModalDetalle;
