import React, { useState } from "react";

// ====== Estilos reutilizables ======
const TD = "border border-slate-300 px-2 py-0 whitespace-normal break-words";
const TD_RIGHT = TD + " text-right tabular-nums";
const TH = TD + " bg-slate-100 font-semibold text-slate-700";

const CalculoFacturacion = () => {
  const [tipoUsuario, setTipoUsuario] = useState("Comercial y Otros");
  const [consumo, setConsumo] = useState("");
  const [dbo, setDbo] = useState("");
  const [dqo, setDqo] = useState("");
  const [sst, setSst] = useState("");
  const [ayg, setAyg] = useState("");
  const [facturacion, setFacturacion] = useState(null);

  const calcularFacturacion = () => {
    const c = parseFloat(consumo || "0");
    const vDbo = parseFloat(dbo || "0");
    const vDqo = parseFloat(dqo || "0");
    const vSst = parseFloat(sst || "0");
    const vAyg = parseFloat(ayg || "0");

    const costoAgua = tipoUsuario === "Comercial y Otros" ? c * 7.314 : c * 7.846;
    const costoAlcantarillado = tipoUsuario === "Comercial y Otros" ? c * 3.486 : c * 3.738;
    const cargoFijo = 6.26;

    // Factores por tramos (para % y cálculo)
    const fDBO = vDbo > 500 ? (vDbo <= 600 ? 0.6 : vDbo <= 1000 ? 1.55 : vDbo <= 2500 ? 3.5 : 5.0) : 0;
    const fDQO = vDqo > 1000 ? (vDqo <= 1200 ? 0.84 : vDqo <= 2500 ? 2.17 : vDqo <= 4500 ? 4.9 : 7.0) : 0;
    const fSST = vSst > 500 ? (vSst <= 600 ? 0.48 : vSst <= 1000 ? 1.24 : vSst <= 3500 ? 2.8 : 4.0) : 0;
    const fAyG = vAyg > 100 ? (vAyg <= 200 ? 0.48 : vAyg <= 350 ? 1.24 : vAyg <= 600 ? 2.8 : 4.0) : 0;

    const costoAnalisis = (vDbo > 500 ? 14.0433 : 0) + (vDqo > 1000 ? 20.0619 : 0) + (vSst > 500 ? 3.0614 : 0) + (vAyg > 100 ? 6.1488 : 0);
    const factorAjusteTotal = fDBO + fDQO + fSST + fAyG;
    const pagoExcesoConcentracion = costoAlcantarillado * factorAjusteTotal;
    const baseIgv = costoAgua + costoAlcantarillado + cargoFijo + costoAnalisis + pagoExcesoConcentracion;
    const igv = baseIgv * 0.18;
    const total = baseIgv + igv;

    setFacturacion({
      costoAgua,
      costoAlcantarillado,
      cargoFijo,
      costoAnalisis,
      pagoExcesoConcentracion,
      factorAjusteTotal,
      igv,
      total,
      baseIgv,
    });
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col items-center justify-start py-3 px-3">
      <div className="mx-auto max-w-7xl p-4 space-y-3">
        {/* ====== Header (igual al modelo) ====== */}
        <header className="border-b border-slate-200 pb-1">
          <h1 className="text-xl sm:text-2xl font-semibold">Calculadora de Facturación VMA</h1>
          <div className="text-xs sm:text-sm text-slate-600">
            Basado en el D.S. 010-2019-VIVIENDA, la R.C.D. 011-2020-SUNASS-CD y la estructura tarifaria vigente para Lima y Callao.
          </div>
        </header>

        {/* ====== Datos de entrada (tabla) ====== */}
        <section className="border border-slate-300 rounded-md overflow-hidden">
          <div className={TH + " h-8 leading-none flex items-center text-sm"}>Datos de entrada</div>
          <div className="bg-white">
            <table className="w-full table-fixed border-collapse text-sm">
              <colgroup>
                <col style={{ width: "50%" }} />
                <col style={{ width: "50%" }} />
              </colgroup>
              <tbody>
                <tr className="">
                  <td className={TD}><div className="h-8 leading-none flex items-center">Tipo de usuario</div></td>
                  <td className={TD}><div className="h-8 leading-none flex items-center w-full"><label htmlFor="tipoUsuario" className="sr-only">Tipo de usuario</label><select
                      id="tipoUsuario"
                      className="w-full px-2 h-8 leading-none rounded-md bg-white border border-slate-300 outline-none focus-visible:ring-2 focus-visible:ring-blue-500/30 focus-visible:border-blue-500"
                      value={tipoUsuario}
                      onChange={(e) =>setTipoUsuario(e.target.value)}
                    >
                      <option value="Comercial y Otros">Comercial y Otros</option>
                      <option value="Industrial">Industrial</option></select></div></td>
                </tr>
                <tr className="">
                  <td className={TD}><div className="h-8 leading-none flex items-center">Consumo de agua (m³)</div></td>
                  <td className={TD}><div className="h-8 leading-none flex items-center w-full"><label htmlFor="consumo" className="sr-only">Consumo de agua (m³)</label><input
                      id="consumo"
                      type="number"
                      inputMode="decimal"
                      placeholder="Ingresa consumo de agua"
                      className="w-full px-2 h-8 leading-none rounded-md bg-white border border-slate-300 outline-none focus-visible:ring-2 focus-visible:ring-blue-500/30 focus-visible:border-blue-500"
                      value={consumo}
                      onChange={(e) => setConsumo(e.target.value)}
                    /></div></td>
                </tr>
                <tr className="">
                  <td className={TD}><div className="h-8 leading-none flex items-center">DBO₅ (mg/L)</div></td>
                  <td className={TD}><div className="h-8 leading-none flex items-center w-full"><label htmlFor="dbo" className="sr-only">DBO₅ (mg/L)</label><input
                      id="dbo"
                      type="number"
                      inputMode="decimal"
                      placeholder="VMA: 500 mg/L"
                      className="w-full px-2 h-8 leading-none rounded-md bg-white border border-slate-300 outline-none focus-visible:ring-2 focus-visible:ring-blue-500/30 focus-visible:border-blue-500"
                      value={dbo}
                      onChange={(e) => setDbo(e.target.value)}
                    /></div></td>
                </tr>
                <tr className="">
                  <td className={TD}><div className="h-8 leading-none flex items-center">DQO (mg/L)</div></td>
                  <td className={TD}><div className="h-8 leading-none flex items-center w-full"><label htmlFor="dqo" className="sr-only">DQO (mg/L)</label><input
                      id="dqo"
                      type="number"
                      inputMode="decimal"
                      placeholder="VMA: 1000 mg/L"
                      className="w-full px-2 h-8 leading-none rounded-md bg-white border border-slate-300 outline-none focus-visible:ring-2 focus-visible:ring-blue-500/30 focus-visible:border-blue-500"
                      value={dqo}
                      onChange={(e) => setDqo(e.target.value)}
                    /></div></td>
                </tr>
                <tr className="">
                  <td className={TD}><div className="h-8 leading-none flex items-center">SST (mg/L)</div></td>
                  <td className={TD}><div className="h-8 leading-none flex items-center w-full"><label htmlFor="sst" className="sr-only">SST (mg/L)</label><input
                      id="sst"
                      type="number"
                      inputMode="decimal"
                      placeholder="VMA: 500 mg/L"
                      className="w-full px-2 h-8 leading-none rounded-md bg-white border border-slate-300 outline-none focus-visible:ring-2 focus-visible:ring-blue-500/30 focus-visible:border-blue-500"
                      value={sst}
                      onChange={(e) => setSst(e.target.value)}
                    /></div></td>
                </tr>
                <tr className="">
                  <td className={TD}><div className="h-8 leading-none flex items-center">Aceites y grasas (mg/L)</div></td>
                  <td className={TD}><div className="h-8 leading-none flex items-center w-full"><label htmlFor="ayg" className="sr-only">Aceites y grasas (mg/L)</label><input
                      id="ayg"
                      type="number"
                      inputMode="decimal"
                      placeholder="VMA: 100 mg/L"
                      className="w-full px-2 h-8 leading-none rounded-md bg-white border border-slate-300 outline-none focus-visible:ring-2 focus-visible:ring-blue-500/30 focus-visible:border-blue-500"
                      value={ayg}
                      onChange={(e) => setAyg(e.target.value)}
                    /></div></td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>


        {/* Botón fuera del cuadro de datos de entrada */}
        <div className="mt-3">
          <button
            type="button"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-md font-semibold transition duration-300 text-sm"
            onClick={calcularFacturacion}
          >
            Calcular Facturación
          </button>
        </div>

        {/* ====== Detalle de facturación (dos columnas) ====== */}
        <section className="border border-slate-300 rounded-md overflow-hidden mt-4 sm:mt-5"><div className={TH + " h-8 leading-none flex items-center text-[clamp(11px,2.6vw,14px)] sm:text-sm"}>Detalle de facturación</div>
          <div className="bg-white">
            <table className="w-full table-fixed border-collapse text-[clamp(12px,2.8vw,14px)] sm:text-sm">
              <colgroup>
                <col style={{ width: "70%" }} />
                <col style={{ width: "30%" }} />
              </colgroup>
              <thead>
                <tr>
                  <th className={TH + " h-8 text-left whitespace-nowrap text-[clamp(11px,2.6vw,14px)] sm:text-sm leading-none"}>Concepto</th>
                  <th className={TH + " h-8 text-center whitespace-nowrap text-[clamp(11px,2.6vw,14px)] sm:text-sm leading-none"}>Importe (S/)</th>
                </tr>
              </thead>
              <tbody>
                {facturacion ? (
                  <>
                    <tr className="">
                      <td className={TD}><div className="h-8 leading-none flex items-center">Agua potable</div></td>
                      <td className={TD_RIGHT}><div className="h-8 leading-none flex items-center justify-end">{facturacion.costoAgua.toFixed(2)}</div></td>
                    </tr>
                    <tr className="">
                      <td className={TD}><div className="h-8 leading-none flex items-center">Servicio de alcantarillado</div></td>
                      <td className={TD_RIGHT}><div className="h-8 leading-none flex items-center justify-end">{facturacion.costoAlcantarillado.toFixed(2)}</div></td>
                    </tr>
                    <tr className="">
                      <td className={TD}><div className="h-8 leading-none flex items-center">Cargo fijo</div></td>
                      <td className={TD_RIGHT}><div className="h-8 leading-none flex items-center justify-end">{facturacion.cargoFijo.toFixed(2)}</div></td>
                    </tr>
                    <tr className="bg-red-100">
                      <td className={TD}>
                        <div className="h-8 leading-none flex items-center">
                          <span>Costo de análisis</span>
                        </div>
                      </td>
                      <td className={TD_RIGHT}><div className="h-8 leading-none flex items-center justify-end">{facturacion.costoAnalisis.toFixed(2)}</div></td>
                    </tr>
                    <tr className="bg-red-100">
                      <td className={TD}>
                        <div className="h-8 leading-none flex items-center justify-between gap-2">
                          <span>Pago por exceso de concentración</span>
                          <span className="ml-2 tabular-nums whitespace-nowrap">{facturacion.costoAlcantarillado.toFixed(2)} × {(facturacion.factorAjusteTotal * 100).toFixed(0)}%</span>
                        </div>
                      </td>
                      <td className={TD_RIGHT}><div className="h-8 leading-none flex items-center justify-end">{facturacion.pagoExcesoConcentracion.toFixed(2)}</div></td>
                    </tr>
                    <tr className="bg-white">
                      <td className={TD}>
                        <div className="h-8 leading-none flex items-center justify-between gap-2">
                          <span>IGV</span>
                          <span className="ml-2 tabular-nums whitespace-nowrap">{facturacion.baseIgv.toFixed(2)} × 18%</span>
                        </div>
                      </td>
                      <td className={TD_RIGHT}><div className="h-8 leading-none flex items-center justify-end">{facturacion.igv.toFixed(2)}</div></td>
                    </tr>
                    <tr>
                      <td className={TD + " font-semibold"}><div className="h-8 leading-none flex items-center">TOTAL</div></td>
                      <td className={TD_RIGHT + " font-semibold"}><div className="h-8 leading-none flex items-center justify-end">{facturacion.total.toFixed(2)}</div></td>
                    </tr>
                  </>
                ) : (
                  <tr>
                    <td className={TD + " text-slate-500"} colSpan={2}>Ingresa los datos y presiona "Calcular Facturación" para ver el detalle.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* ====== Pie ====== */}
        <footer className="text-center text-[11px] text-slate-600 flex flex-col items-center gap-1">
          <div>Desarrollado por Sergio Gonzales Espinoza</div>
          <a
            href="https://www.linkedin.com/in/sergioage"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1"
            aria-label="LinkedIn"
            title="LinkedIn"
          >
            {/* Logo inline, sin depender de internet */}
            <svg className="h-4 w-4" viewBox="0 0 24 24" role="img" aria-label="LinkedIn" focusable="false">
              <rect x="0" y="0" width="24" height="24" rx="4" fill="#0A66C2"/>
              <path fill="#FFFFFF" d="M6.55 9.1h2.4v8.3h-2.4V9.1zm1.2-4.0c.82 0 1.48.67 1.48 1.49s-.66 1.49-1.48 1.49c-.83 0-1.49-.67-1.49-1.49S6.92 5.1 7.75 5.1zM10.6 9.1h2.24v1.06h.03c.33-.6 1.14-1.27 2.38-1.27 2.55 0 3.02 1.68 3.02 3.86v4.65h-2.62v-4.13c0-.99-.02-2.26-1.49-2.26-1.5 0-1.73 1.07-1.73 2.18v4.21H10.6V9.1z"/>
            </svg>
          </a>
        </footer>
      </div>
    </div>
  );
};

export default CalculoFacturacion;
