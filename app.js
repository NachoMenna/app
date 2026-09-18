let operaciones = [];
let cotizacionFinal = {};

document.addEventListener("DOMContentLoaded", () => {
  renderFormOperacion();
});

function renderFormOperacion() {
  const tipo = document.getElementById("tipoOperacion").value;
  const container = document.getElementById("formOperacion");

  let html = `
        <div class="col-md-3"><label class="form-label">Herramienta</label><input type="text" id="opHta" class="form-control" required></div>
        <div class="col-md-3"><label class="form-label">Velocidad Corte (Vc m/min)</label><input type="number" id="opVc" class="form-control" value="150"></div>
        <div class="col-md-3"><label class="form-label">Precio Unitario Hta (USD)</label><input type="number" id="opPrecioHta" class="form-control" value="15"></div>
        <div class="col-md-3"><label class="form-label">Filos de Hta</label><input type="number" id="opFilos" class="form-control" value="4"></div>
        <div class="col-md-3"><label class="form-label">Rendimiento filo (piezas)</label><input type="number" id="opRendimiento" class="form-control" value="50"></div>
        <div class="col-md-3"><label class="form-label">Piezas por Lote</label><input type="number" id="opLote" class="form-control" value="100"></div>
    `;

  if (tipo === "torneado" || tipo === "ranurado") {
    html += `
            <div class="col-md-3"><label class="form-label">Diámetro (mm)</label><input type="number" id="opDiametro" class="form-control"></div>
            <div class="col-md-3"><label class="form-label">Largo (mm)</label><input type="number" id="opLargo" class="form-control"></div>
            <div class="col-md-3"><label class="form-label">N° Pasadas</label><input type="number" id="opPasadas" class="form-control" value="1"></div>
            <div class="col-md-3"><label class="form-label">Avance (mm/rev)</label><input type="number" id="opAvance" class="form-control" step="0.01" value="0.2"></div>
        `;
  } else if (tipo === "fresado") {
    html += `
            <div class="col-md-3"><label class="form-label">Diámetro Fresa (mm)</label><input type="number" id="opDiametro" class="form-control"></div>
            <div class="col-md-3"><label class="form-label">Largo Fresado (mm)</label><input type="number" id="opLargo" class="form-control"></div>
            <div class="col-md-3"><label class="form-label">Ancho Corte (Ae mm)</label><input type="number" id="opAe" class="form-control"></div>
            <div class="col-md-3"><label class="form-label">Prof. Corte (Ap mm)</label><input type="number" id="opAp" class="form-control"></div>
            <div class="col-md-3"><label class="form-label">Cortes Z</label><input type="number" id="opZ" class="form-control" value="4"></div>
            <div class="col-md-3"><label class="form-label">Avance/diente Fz (mm/z)</label><input type="number" id="opFz" class="form-control" step="0.01" value="0.05"></div>
        `;
  } else if (tipo === "perforado" || tipo === "roscado") {
    html += `
            <div class="col-md-3"><label class="form-label">Diámetro (mm)</label><input type="number" id="opDiametro" class="form-control"></div>
            <div class="col-md-3"><label class="form-label">Profundidad (mm)</label><input type="number" id="opLargo" class="form-control"></div>
            <div class="col-md-3"><label class="form-label">Cantidad (unidades)</label><input type="number" id="opCant" class="form-control" value="1"></div>
            <div class="col-md-3"><label class="form-label">Avance/Paso (mm/rev)</label><input type="number" id="opAvance" class="form-control" step="0.01" value="1.5"></div>
        `;
  }

  container.innerHTML = html;
}

function agregarOperacion() {
  const tipo = document.getElementById("tipoOperacion").value;
  const vc = parseFloat(document.getElementById("opVc").value) || 0;
  const diametro = parseFloat(document.getElementById("opDiametro").value) || 1;
  const largo = parseFloat(document.getElementById("opLargo").value) || 0;
  const pasadas = parseFloat(
    document.getElementById("opPasadas")?.value ||
      document.getElementById("opCant")?.value ||
      1,
  );

  // Cálculo técnico
  const rpm = (vc * 1000) / 3.14159 / diametro;
  let avanceRev = parseFloat(document.getElementById("opAvance")?.value || 0);

  if (tipo === "fresado") {
    const fz = parseFloat(document.getElementById("opFz").value) || 0;
    const z = parseFloat(document.getElementById("opZ").value) || 1;
    avanceRev = fz * z;
  }

  const avanceTotalVf = rpm * avanceRev; // mm/min
  const mmTotales = largo * pasadas;
  const tiempoMinutos = avanceTotalVf > 0 ? mmTotales / avanceTotalVf : 0;

  // Cálculo económico por pieza
  const precioHta =
    parseFloat(document.getElementById("opPrecioHta").value) || 0;
  const filos = parseFloat(document.getElementById("opFilos").value) || 1;
  const rendimiento =
    parseFloat(document.getElementById("opRendimiento").value) || 1;
  const costoHtaPieza = precioHta / (filos * rendimiento);

  const op = {
    tipo,
    herramienta: document.getElementById("opHta").value,
    rpm: Math.round(rpm),
    vf: avanceTotalVf.toFixed(2),
    mmTotales,
    tiempoMinutos,
    costoHtaPieza,
    lote: parseFloat(document.getElementById("opLote").value) || 1,
  };

  operaciones.push(op);
  actualizarLista();
}

function actualizarLista() {
  const ul = document.getElementById("listaOperaciones");
  ul.innerHTML = operaciones
    .map(
      (o, index) =>
        `<li class="list-group-item d-flex justify-content-between align-items-center">
            ${index + 1}. <strong>${o.tipo.toUpperCase()}</strong> - ${o.herramienta} (${o.tiempoMinutos.toFixed(2)} min/pieza)
            <span class="badge bg-primary">$${o.costoHtaPieza.toFixed(3)} USD hta/pieza</span>
        </li>`,
    )
    .join("");
}

function calcularTotal() {
  if (operaciones.length === 0) {
    alert("Debe agregar al menos una operación antes de calcular.");
    return;
  }

  const costoHora = parseFloat(document.getElementById("costoHora").value) || 0;
  const lote = operaciones[0]?.lote || 1;

  let tiempoMecanizadoTotalMin = operaciones.reduce(
    (acc, curr) => acc + curr.tiempoMinutos,
    0,
  );
  const tiempoCambioHtaSec = operaciones.length * 2; // 2 segundos por herramienta
  tiempoMecanizadoTotalMin += tiempoCambioHtaSec / 60;

  const tiempoTotalHorasLote = (tiempoMecanizadoTotalMin * lote) / 60;
  const costoHerramientasTotalPieza = operaciones.reduce(
    (acc, curr) => acc + curr.costoHtaPieza,
    0,
  );
  const costoMecanizadoPieza = (tiempoMecanizadoTotalMin / 60) * costoHora;
  const costoTotalPiezaUSD = costoHerramientasTotalPieza + costoMecanizadoPieza;

  // Renderizar Reporte
  document.getElementById("reporteContenedor").classList.remove("d-none");
  document.getElementById("resumenCliente").innerHTML = `
        <p><strong>Razón Social:</strong> ${document.getElementById("razonSocial").value} | <strong>Pieza:</strong> ${document.getElementById("nombrePieza").value} (N° ${document.getElementById("numPieza").value})</p>
        <p><strong>Comercial:</strong> ${document.getElementById("encargadoComercial").value} | <strong>Técnico:</strong> ${document.getElementById("encargadoTecnico").value}</p>
    `;

  document.getElementById("tablaResultados").innerHTML = operaciones
    .map(
      (o) => `
        <tr>
            <td>${o.tipo.toUpperCase()}</td>
            <td>RPM: ${o.rpm} | Avance total (Vf): ${o.vf} mm/min</td>
            <td>${o.tiempoMinutos.toFixed(2)} min</td>
            <td>$${o.costoHtaPieza.toFixed(3)} USD</td>
        </tr>
    `,
    )
    .join("");

  document.getElementById("resumenEconomico").innerHTML = `
        <p class="mb-1"><strong>Tiempo Total por Pieza:</strong> ${tiempoMecanizadoTotalMin.toFixed(2)} minutos</p>
        <p class="mb-1"><strong>Tiempo Total de Mecanizado Lote (${lote} u):</strong> ${tiempoTotalHorasLote.toFixed(2)} hs</p>
        <p class="mb-1"><strong>Costo Herramientas por Pieza:</strong> $${costoHerramientasTotalPieza.toFixed(2)} USD</p>
        <h4 class="mt-2 text-dark"><strong>Costo Total Estimado por Pieza:</strong> $${costoTotalPiezaUSD.toFixed(2)} USD (sin IVA)</h4>
    `;

  cotizacionFinal = {
    razonSocial: document.getElementById("razonSocial").value,
    pieza: document.getElementById("nombrePieza").value,
    numPieza: document.getElementById("numPieza").value,
    tiempoMinutosPieza: tiempoMecanizadoTotalMin.toFixed(2),
    costoUSD: costoTotalPiezaUSD.toFixed(2),
    lote,
  };
}

function exportarPDF() {
  const element = document.getElementById("reportePDF");
  html2pdf()
    .from(element)
    .save(`Cotizacion_${document.getElementById("nombrePieza").value}.pdf`);
}

async function enviarAGoogleSheets() {
  try {
    const response = await fetch("api.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(cotizacionFinal),
    });
    const result = await response.json();
    alert(result.message);
  } catch (e) {
    alert("Error al conectar con la API de envío a Sheets.");
  }
}
