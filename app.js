// ==========================================
// VARIABLES GLOBALES
// ==========================================
let operaciones = [];
let cotizacionFinal = {};
let planoUrl = "";

document.addEventListener("DOMContentLoaded", () => {
  // Inicialización (Simulando que el usuario ya pasó el login para pruebas rápidas)
  // Quita estas 2 líneas si usas tu lógica de login real.
  document.getElementById("secLogin").classList.add("d-none");
  document.getElementById("secApp").classList.remove("d-none");
});

// ==========================================
// NAVEGACIÓN ENTRE PASOS PRINCIPALES
// ==========================================
function avanzarPaso(actualId, siguienteId) {
  document.getElementById(actualId).classList.remove("active");
  document.getElementById(siguienteId).classList.add("active");
}

function avanzarSubPaso(actualClase, siguienteClase) {
  document.querySelector("." + actualClase).classList.add("d-none");
  document.querySelector("." + siguienteClase).classList.remove("d-none");
}

// ==========================================
// LÓGICA DE INTERFAZ Y CÁLCULOS
// ==========================================
function cargarImagenPlano(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      planoUrl = e.target.result;
    };
    reader.readAsDataURL(file);
  }
}

function calcPromedioRendimiento() {
  const f1 = parseFloat(document.getElementById("opF1").value) || 0;
  const f2 = parseFloat(document.getElementById("opF2").value) || 0;
  const f3 = parseFloat(document.getElementById("opF3").value) || 0;

  let sum = 0,
    count = 0;
  if (f1 > 0) {
    sum += f1;
    count++;
  }
  if (f2 > 0) {
    sum += f2;
    count++;
  }
  if (f3 > 0) {
    sum += f3;
    count++;
  }

  const avg = count > 0 ? sum / count : 0;
  document.getElementById("opPromedio").value = avg.toFixed(2);
}

// Generador del Wizard Interno para Operaciones
function renderFormOperacion() {
  const tipo = document.getElementById("tipoOperacion").value;
  const container = document.getElementById("formOperacion");
  let html = "";

  if (tipo === "torneado") {
    html = `
      <!-- SUB-PASO 1: HERRAMIENTA -->
      <div class="subpaso-1 active">
        <h5 class="text-primary border-bottom pb-2">1. Información de Herramienta</h5>
        <div class="row g-3">
          <div class="col-md-4"><label class="form-label">Portaherramienta</label><input type="text" id="opPorta" class="form-control"></div>
          <div class="col-md-4"><label class="form-label">Inserto</label><input type="text" id="opInserto" class="form-control"></div>
          <div class="col-md-4"><label class="form-label">Cantidad de Filos</label><input type="number" id="opFilos" class="form-control" value="2"></div>
        </div>
        <div class="text-end mt-3">
          <button type="button" class="btn btn-outline-primary" onclick="avanzarSubPaso('subpaso-1', 'subpaso-2')">Siguiente (Condiciones) <i class="fa-solid fa-arrow-right"></i></button>
        </div>
      </div>

      <!-- SUB-PASO 2: CONDICIONES DE CORTE -->
      <div class="subpaso-2 d-none">
        <h5 class="text-primary border-bottom pb-2">2. Condiciones de Corte</h5>
        <div class="row g-3">
          <div class="col-md-4"><label class="form-label">Diámetro Operación (mm)</label><input type="number" id="opDiametro" class="form-control" value="50"></div>
          <div class="col-md-4"><label class="form-label">Velocidad Corte Vc (m/min)</label><input type="number" id="opVc" class="form-control" value="150"></div>
          <div class="col-md-4"><label class="form-label">Avance (mm/rev)</label><input type="number" id="opAvance" class="form-control" step="0.01" value="0.2"></div>
          <div class="col-md-4"><label class="form-label">Largo del torneado (mm)</label><input type="number" id="opLargo" class="form-control" value="100"></div>
          <div class="col-md-4"><label class="form-label">Cantidad de Pasadas</label><input type="number" id="opPasadas" class="form-control" value="1"></div>
          <div class="col-md-4"><label class="form-label">Prof. de Corte Ap (mm)</label><input type="number" id="opAp" class="form-control" step="0.1"></div>
        </div>
        <div class="d-flex justify-content-between mt-3">
          <button type="button" class="btn btn-outline-secondary" onclick="avanzarSubPaso('subpaso-2', 'subpaso-1')"><i class="fa-solid fa-arrow-left"></i> Atrás</button>
          <button type="button" class="btn btn-outline-primary" onclick="avanzarSubPaso('subpaso-2', 'subpaso-3')">Siguiente (Económicos) <i class="fa-solid fa-arrow-right"></i></button>
        </div>
      </div>

      <!-- SUB-PASO 3: DATOS ECONÓMICOS -->
      <div class="subpaso-3 d-none">
        <h5 class="text-primary border-bottom pb-2">3. Datos Económicos</h5>
        <div class="row g-3">
          <div class="col-md-6"><label class="form-label">Precio Inserto Unitario (USD)</label><input type="number" id="opPrecioInserto" class="form-control" value="10"></div>
          <div class="col-md-6"><label class="form-label">Precio Portaherramienta Unitario (USD)</label><input type="number" id="opPrecioPorta" class="form-control" value="80"></div>
        </div>
        <div class="d-flex justify-content-between mt-3">
          <button type="button" class="btn btn-outline-secondary" onclick="avanzarSubPaso('subpaso-3', 'subpaso-2')"><i class="fa-solid fa-arrow-left"></i> Atrás</button>
          <button type="button" class="btn btn-outline-primary" onclick="avanzarSubPaso('subpaso-3', 'subpaso-4')">Siguiente (Rendimiento) <i class="fa-solid fa-arrow-right"></i></button>
        </div>
      </div>

      <!-- SUB-PASO 4: RENDIMIENTO -->
      <div class="subpaso-4 d-none">
        <h5 class="text-primary border-bottom pb-2">4. Rendimiento y Cierre</h5>
        <div class="row g-3">
          <div class="col-md-3"><label class="form-label">Piezas Filo 1</label><input type="number" id="opF1" class="form-control" oninput="calcPromedioRendimiento()"></div>
          <div class="col-md-3"><label class="form-label">Piezas Filo 2</label><input type="number" id="opF2" class="form-control" oninput="calcPromedioRendimiento()"></div>
          <div class="col-md-3"><label class="form-label">Piezas Filo 3</label><input type="number" id="opF3" class="form-control" oninput="calcPromedioRendimiento()"></div>
          <div class="col-md-3"><label class="form-label bg-light">Promedio (Auto)</label><input type="number" id="opPromedio" class="form-control fw-bold border-primary text-primary" readonly></div>
          <div class="col-md-12"><label class="form-label">Observaciones</label><input type="text" id="opObs" class="form-control"></div>
        </div>
        <div class="d-flex justify-content-between mt-4">
          <button type="button" class="btn btn-outline-secondary" onclick="avanzarSubPaso('subpaso-4', 'subpaso-3')"><i class="fa-solid fa-arrow-left"></i> Atrás</button>
          <button type="button" class="btn btn-success fw-bold px-4" onclick="agregarOperacion()">+ Guardar Operación a la Lista</button>
        </div>
      </div>
    `;
  } else {
    // Para fresado, perforado, etc. (Diseño Simplificado en 1 paso)
    html = `
      <div class="row g-3">
        <div class="col-md-4"><label class="form-label">Herramienta</label><input type="text" id="opHta" class="form-control" required></div>
        <div class="col-md-4"><label class="form-label">Vc (m/min)</label><input type="number" id="opVc" class="form-control" value="150"></div>
        <div class="col-md-4"><label class="form-label">Avance (mm/rev)</label><input type="number" id="opAvance" class="form-control" step="0.01" value="0.2"></div>
        <div class="col-md-4"><label class="form-label">Largo (mm)</label><input type="number" id="opLargo" class="form-control" value="50"></div>
        <div class="col-md-4"><label class="form-label">Diámetro (mm)</label><input type="number" id="opDiametro" class="form-control" value="10"></div>
        <div class="col-md-4"><label class="form-label">Costo Hta (USD)</label><input type="number" id="opPrecioHta" class="form-control" value="15"></div>
      </div>
      <div class="text-end mt-4">
        <button type="button" class="btn btn-success fw-bold px-4" onclick="agregarOperacion()">+ Guardar Operación a la Lista</button>
      </div>
    `;
  }
  container.innerHTML = html;
}

function agregarOperacion() {
  const tipo = document.getElementById("tipoOperacion").value;
  const lote = parseFloat(document.getElementById("piezasLote").value) || 1;
  const costoHoraMaq =
    parseFloat(document.getElementById("costoHora").value) || 0;
  let op = { tipo, lote };

  if (tipo === "torneado") {
    const diametro =
      parseFloat(document.getElementById("opDiametro").value) || 1;
    const vc = parseFloat(document.getElementById("opVc").value) || 0;
    const avance = parseFloat(document.getElementById("opAvance").value) || 0;
    const largo = parseFloat(document.getElementById("opLargo").value) || 0;
    const pasadas = parseFloat(document.getElementById("opPasadas").value) || 1;

    const precioInserto =
      parseFloat(document.getElementById("opPrecioInserto").value) || 0;
    const filos = parseFloat(document.getElementById("opFilos").value) || 1;
    const promedioRendimiento =
      parseFloat(document.getElementById("opPromedio").value) || 1;

    // Fórmulas Matemáticas
    const rpm = (vc * 1000) / 3.14 / diametro;
    const avanceTotal = rpm * avance;
    const tiempoPiezaSeg =
      avanceTotal > 0 ? ((largo * pasadas) / avanceTotal) * 60 : 0;
    const tiempoLoteHs = (tiempoPiezaSeg * lote) / 3600;

    const filosConsumidosLote = lote / promedioRendimiento;
    const costoHtaLote = (precioInserto / filos) * filosConsumidosLote;
    const costoHtaPieza = costoHtaLote / lote;
    const costoMaqLote = costoHoraMaq * tiempoLoteHs;

    op = {
      ...op,
      herramienta: document.getElementById("opInserto").value || "Inserto N/D",
      rpm: Math.round(rpm),
      avanceTotal: avanceTotal.toFixed(2),
      tiempoPiezaSeg: tiempoPiezaSeg,
      tiempoLoteHs: tiempoLoteHs,
      costoHtaLote: costoHtaLote,
      costoHtaPieza: costoHtaPieza,
      costoMaqLote: costoMaqLote,
      filosConsumidos: filosConsumidosLote,
      obs: document.getElementById("opObs").value,
    };
  } else {
    // Fórmulas Operaciones Básicas
    const vc = parseFloat(document.getElementById("opVc").value) || 0;
    const diametro =
      parseFloat(document.getElementById("opDiametro").value) || 1;
    const rpm = (vc * 1000) / 3.14 / diametro;
    const avance = parseFloat(document.getElementById("opAvance").value) || 0.1;
    const avanceTotal = rpm * avance;
    const largo = parseFloat(document.getElementById("opLargo").value) || 10;

    const tiempoPiezaSeg = avanceTotal > 0 ? (largo / avanceTotal) * 60 : 0;
    const tiempoLoteHs = (tiempoPiezaSeg * lote) / 3600;
    const costoHtaPieza =
      parseFloat(document.getElementById("opPrecioHta").value) / 100 || 0;

    op = {
      ...op,
      herramienta: document.getElementById("opHta").value || "N/D",
      rpm: Math.round(rpm),
      avanceTotal: avanceTotal.toFixed(2),
      tiempoPiezaSeg: tiempoPiezaSeg,
      tiempoLoteHs: tiempoLoteHs,
      costoHtaPieza: costoHtaPieza,
      costoHtaLote: costoHtaPieza * lote,
      costoMaqLote: costoHoraMaq * tiempoLoteHs,
    };
  }

  operaciones.push(op);
  actualizarLista();

  // Reiniciamos el form visualmente al paso 1
  renderFormOperacion();

  // Mostramos el botón de "Ir al Reporte" ya que hay al menos 1 operación
  document.getElementById("btnFinalizarOp").classList.remove("d-none");
}

function actualizarLista() {
  const ul = document.getElementById("listaOperaciones");
  ul.innerHTML = operaciones
    .map(
      (o, index) => `
    <li class="list-group-item d-flex justify-content-between align-items-center">
        <div>
          <strong>${index + 1}. ${o.tipo.toUpperCase()}</strong> - ${o.herramienta} 
          <br><small class="text-muted">Tiempo/Pz: ${o.tiempoPiezaSeg.toFixed(1)} seg | Costo Hta/Pz: $${o.costoHtaPieza.toFixed(3)}</small>
        </div>
        <button class="btn btn-sm btn-outline-danger" onclick="eliminarOperacion(${index})"><i class="fa-solid fa-trash"></i></button>
    </li>
  `,
    )
    .join("");
}

function eliminarOperacion(index) {
  operaciones.splice(index, 1);
  actualizarLista();
  if (operaciones.length === 0) {
    document.getElementById("btnFinalizarOp").classList.add("d-none");
  } else {
    calcularTotal();
  }
}

function calcularTotal() {
  if (operaciones.length === 0) return;

  const lote = parseFloat(document.getElementById("piezasLote").value) || 1;
  let tiempoLoteHsTotal = 0;
  let costoHtaLoteTotal = 0;
  let costoMaqLoteTotal = 0;

  operaciones.forEach((o) => {
    tiempoLoteHsTotal += o.tiempoLoteHs;
    costoHtaLoteTotal += o.costoHtaLote;
    costoMaqLoteTotal += o.costoMaqLote;
  });

  const costoTotalLote = costoHtaLoteTotal + costoMaqLoteTotal;
  const costoTotalPieza = costoTotalLote / lote;

  // Insertar datos en el contenedor del PDF
  document.getElementById("resumenCliente").innerHTML = `
      <div class="row">
        <div class="col-6"><p class="mb-1"><strong>Razón Social:</strong> ${document.getElementById("razonSocial").value}</p></div>
        <div class="col-6"><p class="mb-1"><strong>Pieza:</strong> ${document.getElementById("nombrePieza").value || "S/N"} (N° ${document.getElementById("numPieza").value || "S/N"})</p></div>
        <div class="col-6"><p class="mb-1"><strong>Comercial:</strong> ${document.getElementById("encargadoComercial").value}</p></div>
        <div class="col-6"><p class="mb-1"><strong>Lote de Producción:</strong> ${lote} unidades</p></div>
      </div>
  `;

  document.getElementById("tablaResultados").innerHTML = operaciones
    .map(
      (o) => `
      <tr>
          <td class="text-uppercase">${o.tipo}</td>
          <td>${o.herramienta}</td>
          <td>${o.tiempoPiezaSeg.toFixed(2)}</td>
          <td>${o.tiempoLoteHs.toFixed(2)}</td>
          <td>$${o.costoHtaPieza.toFixed(3)}</td>
      </tr>
  `,
    )
    .join("");

  document.getElementById("resumenEconomico").innerHTML = `
      <div class="row text-center">
        <div class="col-md-6 border-end border-success">
          <h5 class="text-secondary">Totales por Lote (${lote} u)</h5>
          <p class="mb-1">Tiempo de Mecanizado: <strong>${tiempoLoteHsTotal.toFixed(2)} Horas</strong></p>
          <p class="mb-1">Costo Herramental: <strong>$${costoHtaLoteTotal.toFixed(2)} USD</strong></p>
          <p class="mb-1">Costo Hora Máquina Lote: <strong>$${costoMaqLoteTotal.toFixed(2)} USD</strong></p>
          <h4 class="mt-3 text-dark border-top border-success pt-2">Costo Lote: $${costoTotalLote.toFixed(2)}</h4>
        </div>
        <div class="col-md-6 d-flex flex-column justify-content-center">
          <h5 class="text-secondary">Costo Unitario por Pieza</h5>
          <h1 class="text-success fw-bold mt-2">$${costoTotalPieza.toFixed(2)}</h1>
          <small class="text-muted">(Expresado en USD)</small>
        </div>
      </div>
  `;
  renderVistaReporte();
}

function renderVistaReporte() {
  const secPlano = document.getElementById("reporteSeccionPlano");
  const secCodigoG = document.getElementById("reporteSeccionCodigoG");
  const chkPlano = document.getElementById("chkIncluirPlano").checked;
  const chkCodigoG = document.getElementById("chkIncluirCodigoG").checked;

  if (chkPlano && planoUrl !== "") {
    document.getElementById("imgPlanoPreview").src = planoUrl;
    secPlano.classList.remove("d-none");
  } else {
    secPlano.classList.add("d-none");
  }

  if (chkCodigoG && document.getElementById("codigoG").value.trim() !== "") {
    document.getElementById("preCodigoG").textContent =
      document.getElementById("codigoG").value;
    secCodigoG.classList.remove("d-none");
  } else {
    secCodigoG.classList.add("d-none");
  }
}

// ==========================================
// FIX: EXPORTACIÓN PDF
// ==========================================
function exportarPDF() {
  const element = document.getElementById("reportePDF");
  const nombrePieza =
    document.getElementById("nombrePieza").value || "Mecanizado";

  // Opciones explícitas para forzar que html2pdf renderice correctamente
  const opt = {
    margin: 10, // Margen en mm
    filename: `Cotizacion_${nombrePieza}.pdf`,
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: {
      scale: 2,
      useCORS: true, // Permite renderizar imágenes cargadas
      backgroundColor: "#ffffff", // Fuerza el fondo blanco
    },
    jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
  };

  html2pdf().set(opt).from(element).save();
}

// ==========================================
// FUNCIONES DE BD / API (COMPLETAR CON TU CÓDIGO)
// ==========================================
async function ejecutarLogin(event) {
  // Tu código fetch original para login
}
function cerrarSesion() {
  // Tu código original para logout
}
function seleccionarMaquina() {
  // Tu código original para poblar los datos de la máquina
}
async function guardarNuevaMaquina(event) {
  event.preventDefault();
  // Tu código fetch original incluyendo el campo año de fabricación
}
async function guardarEnBaseDeDatos() {
  // Tu código fetch original a api.php?action=save_cotizacion
  alert("Datos listos para enviar a Base de Datos.");
}
