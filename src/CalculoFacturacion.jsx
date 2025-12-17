import React, { useState } from "react";

// ====== Estilos reutilizables ======
const TD = "border border-slate-300 px-2 py-0 whitespace-normal break-words";
const TD_RIGHT = TD + " text-right tabular-nums";
const TH = TD + " bg-slate-100 font-semibold text-slate-700";

// ====== Encabezado de empresa ======
const COMPANY = {
  name: "AYNA INGENIERIA Y SOLUCIONES AMBIENTALES SAC",
  tagline: "Tratamiento de aguas residuales comerciales e industriales",
  phone: "905 629 167",
  waNumberRaw: "51905629167", // para wa.me se usa sin '+' ni espacios
  // Usa el enlace directo del logo (termina en .png/.jpg/.svg). Este es tu i.ibb.co con extensión:
  logoSrc: "https://i.ibb.co/XZpNpmyt/Logo.png",
};

const CalculoFacturacion = () => {
  const [tipoUsuario, setTipoUsuario] = useState("Comercial y Otros");
  const [consumo, setConsumo] = useState("");
  const [dbo, setDbo] = useState("");
  const [dqo, setDqo] = useState("");
  const [sst, setSst] = useState("");
  const [ayg, setAyg] = useState("");
  const [facturacion, setFacturacion] = useState(null);

  // Control de logo con fallback (JS puro, sin TS)
  const [logoUrl, setLogoUrl] = useState(COMPANY.logoSrc);

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

    const costoAnalisis =
      (vDbo > 500 ? 14.0433 : 0) +
      (vDqo > 1000 ? 20.0619 : 0) +
      (vSst > 500 ? 3.0614 : 0) +
      (vAyg > 100 ? 6.1488 : 0);

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
        {/* ====== Encabezado de empresa (mismo estilo que la otra app) ====== */}
        <section className="border-b border-slate-300 pb-3">
          <div className="flex items-center gap-3 flex-wrap">
            <img
              src={logoUrl}
              alt={COMPANY.name}
              className="w-14 h-14 object-contain bg-white rounded"
              referrerPolicy="no-referrer"
              onError={(e) => {
                if (logoUrl !== "/logo.svg") {
                  setLogoUrl("/logo.svg");
                } else {
                  e.currentTarget.style.display = "none";
                }
              }}
            />
            <div className="flex-1 min-w-[220px]">
              <h2 className="text-base sm:text-lg font-semibold leading-tight">{COMPANY.name}</h2>
              <div className="text-xs sm:text-sm text-slate-700 leading-tight">{COMPANY.tagline}</div>
              <div className="text-xs text-slate-500 leading-tight">Contacto: {COMPANY.phone}</div>
            </div>
            <a
              href={`https://wa.me/${COMPANY.waNumberRaw}?text=${encodeURIComponent(
                "Hola, me gustaría una cotización de levantamientos y soluciones para VMA."
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 rounded-md bg-[#25D366] hover:bg-[#1ebe5a] text-white px-2.5 py-1.5 text-xs shadow-sm"
              aria-label="Escribir por WhatsApp"
              title="Escribir por WhatsApp"
            >
              <svg aria-hidden="true" viewBox="0 0 32 32" width="14" height="14" className="fill-current">
                <path d="M19.11 17.56c-.3-.15-1.78-.88-2.06-.98-.28-.1-.48-.15-.68.15-.2.3-.78.98-.96 1.18-.18.2-.35.23-.65.08-.3-.15-1.25-.46-2.38-1.46-.88-.79-1.47-1.77-1.64-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.46-.53.15-.18.2-.3.3-.5.1-.2.05-.38-.03-.53-.08-.15-.68-1.63-.93-2.23-.24-.58-.49-.5-.68-.5-.17-.01-.38-.01-.58-.01-.2 0-.53.08-.81.38-.28.3-1.07 1.05-1.07 2.55 0 1.5 1.1 2.95 1.26 3.15.16.2 2.16 3.3 5.23 4.52.73.31 1.3.49 1.74.63.73.23 1.4.2 1.93.12.59-.09 1.78-.73 2.03-1.44.25-.71.25-1.31.17-1.44-.08-.13-.27-.2-.57-.35zM16.02 5C10.51 5 6 9.5 6 15c0 1.77.46 3.43 1.27 4.88L6 27l7.24-1.9c1.39.76 2.98 1.2 4.78 1.2 5.51 0 10.02-4.5 10.02-10.02C28.04 9.5 21.54 5 16.02 5z"></path>
              </svg>
              <span>WhatsApp</span>
            </a>
          </div>
        </section>

        {/* ====== Header propio de la herramienta ====== */}
        <header className="border-b border-slate-200 pb-1">
          <h1 className="text-xl sm:text-2xl font-semibold">Calculadora de Facturación VMA</h1>
          <div className="text-xs sm:text-sm text-slate-600">
            Basado en el D.S. 010-2019-VIVIENDA, la R.C.D. 011-2020-SUNASS-CD y la estructura tarifaria vigente para Lima y Callao.
          </div>
        </header>

        {/* ====== Datos de entrada (tabla) ====== */}
        <section className="border border-slate-300 rounded-md overflow-hidden">
          <div className={TH + " h-8 leading-none flex items-center text-xs sm:text-sm"}>Datos de entrada</div>
          <div className="bg-white">
            <table className="w-full table-fixed border-collapse text-xs sm:text-sm">
              <colgroup>
                <col style={{ width: "50%" }} />
                <col style={{ width: "50%" }} />
              </colgroup>
              <tbody>
                <tr>
                  <td className={TD}><div className="h-8 leading-none flex items-center">Tipo de usuario</div></td>
                  <td className={TD}>
                    <div className="h-8 leading-none flex items-center w-full">
                      <label htmlFor="tipoUsuario" className="sr-only">Tipo de usuario</label>
                      <select
                        id="tipoUsuario"
                        className="w-full px-2 h-8 leading-none rounded-md bg-white border border-slate-300 outline-none focus-visible:ring-2 focus-visible:ring-blue-500/30 focus-visible:border-blue-500"
                        value={tipoUsuario}
                        onChange={(e) => setTipoUsuario(e.target.value)}
                      >
                        <option value="Comercial y Otros">Comercial y Otros</option>
                        <option value="Industrial">Industrial</option>
                      </select>
                    </div>
                  </td>
                </tr>

                <tr>
                  <td className={TD}><div className="h-8 leading-none flex items-center">Consumo de agua (m³)</div></td>
                  <td className={TD}>
                    <div className="h-8 leading-none flex items-center w-full">
                      <label htmlFor="consumo" className="sr-only">Consumo de agua (m³)</label>
                      <input
                        id="consumo"
                        type="number"
                        inputMode="decimal"
                        placeholder="Ingresa consumo de agua"
                        className="w-full px-2 h-8 leading-none rounded-md bg-white border border-slate-300 outline-none focus-visible:ring-2 focus-visible:ring-blue-500/30 focus-visible:border-blue-500"
                        value={consumo}
                        onChange={(e) => setConsumo(e.target.value)}
                      />
                    </div>
                  </td>
                </tr>

                <tr>
                  <td className={TD}><div className="h-8 leading-none flex items-center">DBO₅ (mg/L)</div></td>
                  <td className={TD}>
                    <div className="h-8 leading-none flex items-center w-full">
                      <label htmlFor="dbo" className="sr-only">DBO₅ (mg/L)</label>
                      <input
                        id="dbo"
                        type="number"
                        inputMode="decimal"
                        placeholder="VMA: 500 mg/L"
                        className="w-full px-2 h-8 leading-none rounded-md bg-white border border-slate-300 outline-none focus-visible:ring-2 focus-visible:ring-blue-500/30 focus-visible:border-blue-500"
                        value={dbo}
                        onChange={(e) => setDbo(e.target.value)}
                      />
                    </div>
                  </td>
                </tr>

                <tr>
                  <td className={TD}><div className="h-8 leading-none flex items-center">DQO (mg/L)</div></td>
                  <td className={TD}>
                    <div className="h-8 leading-none flex items-center w-full">
                      <label htmlFor="dqo" className="sr-only">DQO (mg/L)</label>
                      <input
                        id="dqo"
                        type="number"
                        inputMode="decimal"
                        placeholder="VMA: 1000 mg/L"
                        className="w-full px-2 h-8 leading-none rounded-md bg-white border border-slate-300 outline-none focus-visible:ring-2 focus-visible:ring-blue-500/30 focus-visible:border-blue-500"
                        value={dqo}
                        onChange={(e) => setDqo(e.target.value)}
                      />
                    </div>
                  </td>
                </tr>

                <tr>
                  <td className={TD}><div className="h-8 leading-none flex items-center">SST (mg/L)</div></td>
                  <td className={TD}>
                    <div className="h-8 leading-none flex items-center w-full">
                      <label htmlFor="sst" className="sr-only">SST (mg/L)</label>
                      <input
                        id="sst"
                        type="number"
                        inputMode="decimal"
                        placeholder="VMA: 500 mg/L"
                        className="w-full px-2 h-8 leading-none rounded-md bg-white border border-slate-300 outline-none focus-visible:ring-2 focus-visible:ring-blue-500/30 focus-visible:border-blue-500"
                        value={sst}
                        onChange={(e) => setSst(e.target.value)}
                      />
                    </div>
                  </td>
                </tr>

                <tr>
                  <td className={TD}><div className="h-8 leading-none flex items-center">Aceites y grasas (mg/L)</div></td>
                  <td className={TD}>
                    <div className="h-8 leading-none flex items-center w-full">
                      <label htmlFor="ayg" className="sr-only">Aceites y grasas (mg/L)</label>
                      <input
                        id="ayg"
                        type="number"
                        inputMode="decimal"
                        placeholder="VMA: 100 mg/L"
                        className="w-full px-2 h-8 leading-none rounded-md bg-white border border-slate-300 outline-none focus-visible:ring-2 focus-visible:ring-blue-500/30 focus-visible:border-blue-500"
                        value={ayg}
                        onChange={(e) => setAyg(e.target.value)}
                      />
                    </div>
                  </td>
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
        {facturacion && (
          <section className="border border-slate-300 rounded-md overflow-hidden mt-4 sm:mt-5">
            <div className={TH + " h-8 leading-none flex items-center text-xs sm:text-sm"}>Detalle de facturación</div>
            <div className="bg-white">
              <table className="w-full table-fixed border-collapse text-xs sm:text-sm">
                <colgroup>
                  <col style={{ width: "70%" }} />
                  <col style={{ width: "30%" }} />
                </colgroup>
                <thead>
                  <tr>
                    <th className={TH + " h-8 text-left whitespace-nowrap text-xs sm:text-sm leading-none"}>Concepto</th>
                    <th className={TH + " h-8 text-center whitespace-nowrap text-xs sm:text-sm leading-none"}>Importe (S/)</th>
                  </tr>
                </thead>
                <tbody>
                  <>
                    <tr>
                      <td className={TD}><div className="h-8 leading-none flex items-center">Agua potable</div></td>
                      <td className={TD_RIGHT}><div className="h-8 leading-none flex items-center justify-end">{facturacion.costoAgua.toFixed(2)}</div></td>
                    </tr>
                    <tr>
                      <td className={TD}><div className="h-8 leading-none flex items-center">Servicio de alcantarillado</div></td>
                      <td className={TD_RIGHT}><div className="h-8 leading-none flex items-center justify-end">{facturacion.costoAlcantarillado.toFixed(2)}</div></td>
                    </tr>
                    <tr>
                      <td className={TD}><div className="h-8 leading-none flex items-center">Cargo fijo</div></td>
                      <td className={TD_RIGHT}><div className="h-8 leading-none flex items-center justify-end">{facturacion.cargoFijo.toFixed(2)}</div></td>
                    </tr>
                    <tr className="bg-red-100">
                      <td className={TD}><div className="h-8 leading-none flex items-center">Costo de análisis</div></td>
                      <td className={TD_RIGHT}><div className="h-8 leading-none flex items-center justify-end">{facturacion.costoAnalisis.toFixed(2)}</div></td>
                    </tr>
                    <tr className="bg-red-100">
                      <td className={TD}>
                        <div className="h-8 leading-none flex items-center justify-between gap-2">
                          <span>Pago por exceso de concentración</span>
                          <span className="ml-2 tabular-nums whitespace-nowrap">
                            {facturacion.costoAlcantarillado.toFixed(2)} × {(facturacion.factorAjusteTotal * 100).toFixed(0)}%
                          </span>
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
                </tbody>
              </table>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default CalculoFacturacion;
