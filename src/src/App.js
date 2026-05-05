import React, { useState } from 'react';

const App = () => {
  // Datos que ingresa el conductor
  const [recogida, setRecogida] = useState('');
  const [viaje, setViaje] = useState('');
  const [pago, setPago] = useState('');
  
  // Configuración interna
  const [costoGasolina, setCostoGasolina] = useState(0.10);
  const [minimoPorKm, setMinimoPorKm] = useState(0.60);
  const [showConfig, setShowConfig] = useState(false);

  // Cálculos automáticos
  const kmTotales = (parseFloat(recogida) || 0) + (parseFloat(viaje) || 0);
  const gananciaReal = (parseFloat(pago) || 0) - (kmTotales * costoGasolina);
  const pagoPorKm = kmTotales > 0 ? (parseFloat(pago) || 0) / kmTotales : 0;

  // Lógica para decidir si el viaje sirve
  const decidir = () => {
    if (!recogida || !viaje || !pago) return { texto: "ESPERANDO DATOS", color: "bg-gray-100 text-gray-400" };
    
    const esRecogidaLarga = parseFloat(recogida) > 2;
    const cumpleMinimo = pagoPorKm >= minimoPorKm;
    
    if (gananciaReal > 0 && cumpleMinimo && !esRecogidaLarga) {
      return { texto: "ACEPTAR ✅", color: "bg-green-500 text-white" };
    } else if (gananciaReal > 0 && cumpleMinimo && esRecogidaLarga) {
      return { texto: "ACEPTAR (Recogida Larga ⚠️)", color: "bg-yellow-500 text-white" };
    } else {
      return { texto: "RECHAZAR ❌", color: "bg-red-500 text-white" };
    }
  };

  const decision = decidir();

  const limpiar = () => {
    setRecogida('');
    setViaje('');
    setPago('');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-200">
        
        {/* Título y Ajustes */}
        <div className="bg-black p-5 text-white flex justify-between items-center">
          <h1 className="text-lg font-bold tracking-tight">RUTA RENTABLE</h1>
          <button onClick={() => setShowConfig(!showConfig)} className="text-[10px] bg-gray-800 px-3 py-1 rounded-full uppercase">
            {showConfig ? 'Cerrar' : 'Ajustes'}
          </button>
        </div>

        {/* Panel de Configuración Oculto */}
        {showConfig && (
          <div className="p-4 bg-gray-50 border-b space-y-3">
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase">Costo Gasolina x KM</label>
              <input type="number" value={costoGasolina} onChange={(e) => setCostoGasolina(e.target.value)} className="w-full p-2 rounded-lg border border-gray-300"/>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase">Pago mínimo x KM</label>
              <input type="number" value={minimoPorKm} onChange={(e) => setMinimoPorKm(e.target.value)} className="w-full p-2 rounded-lg border border-gray-300"/>
            </div>
          </div>
        )}

        {/* Formulario de Entrada */}
        <div className="p-6 space-y-5">
          <div>
            <label className="text-xs font-bold text-gray-400 uppercase">KM Recogida (Ir por él)</label>
            <input type="number" inputMode="decimal" value={recogida} onChange={(e) => setRecogida(e.target.value)} placeholder="0.0" className="w-full text-3xl p-3 bg-gray-50 border-b-4 border-gray-200 focus:border-black outline-none transition-all"/>
          </div>
          <div>
            <label className="text-xs font-bold text-gray-400 uppercase">KM Viaje (Llevarlo)</label>
            <input type="number" inputMode="decimal" value={viaje} onChange={(e) => setViaje(e.target.value)} placeholder="0.0" className="w-full text-3xl p-3 bg-gray-50 border-b-4 border-gray-200 focus:border-black outline-none transition-all"/>
          </div>
          <div>
            <label className="text-xs font-bold text-gray-400 uppercase">Pago del Viaje ($)</label>
            <input type="number" inputMode="decimal" value={pago} onChange={(e) => setPago(e.target.value)} placeholder="0.00" className="w-full text-3xl p-3 bg-gray-50 border-b-4 border-gray-200 focus:border-black outline-none transition-all"/>
          </div>

          {/* Resumen de números */}
          <div className="grid grid-cols-3 gap-2 py-4 bg-gray-50 rounded-2xl border border-gray-100">
            <div className="text-center border-r">
              <p className="text-[9px] text-gray-400 font-bold uppercase">Total KM</p>
              <p className="text-lg font-bold">{kmTotales.toFixed(1)}</p>
            </div>
            <div className="text-center border-r">
              <p className="text-[9px] text-gray-400 font-bold uppercase">$/KM</p>
              <p className="text-lg font-bold text-blue-600">${pagoPorKm.toFixed(2)}</p>
            </div>
            <div className="text-center">
              <p className="text-[9px] text-gray-400 font-bold uppercase">Limpio</p>
              <p className={`text-lg font-bold ${gananciaReal > 0 ? 'text-green-600' : 'text-red-600'}`}>
                ${gananciaReal.toFixed(2)}
              </p>
            </div>
          </div>

          {/* Resultado Visual Principal */}
          <div className={`w-full py-8 rounded-3xl text-center font-black text-3xl shadow-lg transition-all ${decision.color}`}>
            {decision.texto}
          </div>

          <button onClick={limpiar} className="w-full py-2 text-xs font-bold text-gray-300 hover:text-red-400 transition-colors uppercase tracking-widest">
            Borrar Datos
          </button>
        </div>
      </div>
      
      <p className="mt-8 text-gray-400 text-[10px] font-medium tracking-[0.2em] uppercase">
        Calculadora de Rendimiento
      </p>
    </div>
  );
};

export default App;
