//--------------------------------------//
//--|funcionalidad_ahorros_personales|--//
//--------------------------------------//
const meta = document.getElementById("meta");
const ahorroActual = document.getElementById("ahorroActual");
const ahorroMensual = document.getElementById("ahorroMensual");
const calcular = document.getElementById("calcular");
const limpiar = document.getElementById("limpiar");
const restablecer = document.getElementById("restablecer");
const falta = document.getElementById("falta");
const meses = document.getElementById("meses");
const metaResultado = document.getElementById("metaResultado");
const porcentaje = document.getElementById("porcentaje");
const progreso = document.getElementById("progreso");
const resultadoTexto = document.getElementById("resultadoTexto");
const mensaje = document.getElementById("mensaje");
//-------------------//
//--|obtener_datos|--//
//-------------------//
function obtenerDatos() {
    try {
        const datos = localStorage.getItem("ahorros_personales");
        if (datos) {
            const datosGuardados = JSON.parse(datos);
            if (
                datosGuardados &&
                typeof datosGuardados.meta === "string" &&
                typeof datosGuardados.ahorroActual === "string" &&
                typeof datosGuardados.ahorroMensual === "string"
            ) {
                return datosGuardados;
            }
        }
    } catch (error) {
        console.error("No se pudieron recuperar los datos:", error);
    }
    return {
        meta: "",
        ahorroActual: "",
        ahorroMensual: "",
        resultado: null
    };
}
function guardarDatos(resultado = null) {
    const datos = {
        meta: meta.value,
        ahorroActual: ahorroActual.value,
        ahorroMensual: ahorroMensual.value,
        resultado: resultado
    };
    try {
        localStorage.setItem("ahorros_personales", JSON.stringify(datos));
    } catch (error) {
        console.error("No se pudieron guardar los datos:", error);
        mensaje.textContent = "No fue posible guardar los datos.";
    }
}
function validarDatos() {
    const valorMeta = meta.value.trim();
    const valorActual = ahorroActual.value.trim();
    const valorMensual = ahorroMensual.value.trim();
    if (valorMeta === "" || !Number.isFinite(Number(valorMeta)) || Number(valorMeta) <= 0) {
        mensaje.textContent = "Ingresa una meta de ahorro válida.";
        meta.focus();
        return false;
    }
    if (valorActual === "" || !Number.isFinite(Number(valorActual)) || Number(valorActual) < 0) {
        mensaje.textContent = "Ingresa un ahorro actual válido.";
        ahorroActual.focus();
        return false;
    }
    if (valorMensual === "" || !Number.isFinite(Number(valorMensual)) || Number(valorMensual) <= 0) {
        mensaje.textContent = "Ingresa un ahorro mensual válido.";
        ahorroMensual.focus();
        return false;
    }
    return true;
}
//---------------------//
//--|calcular_ahorro|--//
//---------------------//
function calcularAhorro() {
    mensaje.textContent = "";
    if (!validarDatos()) {
        return;
    }
    const valorMeta = Number(meta.value);
    const valorActual = Number(ahorroActual.value);
    const valorMensual = Number(ahorroMensual.value);
    if (valorActual >= valorMeta) {
        mostrarResultado(0, 0, 100);
        resultadoTexto.textContent = "¡Felicitaciones! Ya alcanzaste tu meta de ahorro.";
        guardarDatos({
            falta: 0,
            meses: 0,
            porcentaje: 100
        });
        mensaje.textContent = "Ya alcanzaste tu objetivo.";
        return;
    }
    const dineroFaltante = valorMeta - valorActual;
    const mesesNecesarios = Math.ceil(dineroFaltante / valorMensual);
    const progresoActual = (valorActual / valorMeta) * 100;
    const porcentajeFinal = Math.min(progresoActual, 100);
    mostrarResultado(dineroFaltante, mesesNecesarios, porcentajeFinal);
    resultadoTexto.textContent =
        `Si ahorras ${formatearMoneda(valorMensual)} cada mes, ` +
        `necesitarás aproximadamente ${mesesNecesarios} mes(es) ` +
        `para alcanzar tu meta.`;
    guardarDatos({
        falta: dineroFaltante,
        meses: mesesNecesarios,
        porcentaje: porcentajeFinal
    });
    mensaje.textContent = "El cálculo fue realizado correctamente.";
}
//-----------------------//
//--|mostrar_resultado|--//
//-----------------------//
function mostrarResultado(dineroFaltante, cantidadMeses, porcentajeFinal) {
    falta.textContent = formatearMoneda(dineroFaltante);
    meses.textContent = cantidadMeses;
    metaResultado.textContent = formatearMoneda(Number(meta.value));
    const porcentajeRedondeado = Math.round(porcentajeFinal);
    porcentaje.textContent = `${porcentajeRedondeado}%`;
    progreso.style.width = `${porcentajeFinal}%`;
    progreso.setAttribute("role", "progressbar");
    progreso.setAttribute("aria-label", "Progreso de ahorro");
    progreso.setAttribute("aria-valuemin", "0");
    progreso.setAttribute("aria-valuemax", "100");
    progreso.setAttribute("aria-valuenow", String(porcentajeRedondeado));
}
function formatearMoneda(valor) {
    return new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP",
        maximumFractionDigits: 0
    }).format(valor);
}
//---------------------//
//--|restaurar_datos|--//
//---------------------//
function restaurarDatos() {
    const datos = obtenerDatos();
    meta.value = datos.meta;
    ahorroActual.value = datos.ahorroActual;
    ahorroMensual.value = datos.ahorroMensual;
    if (datos.resultado && Number.isFinite(datos.resultado.falta) && Number.isFinite(datos.resultado.meses) && Number.isFinite(datos.resultado.porcentaje)) {
        mostrarResultado(
            datos.resultado.falta,
            datos.resultado.meses,
            Math.max(0, Math.min(datos.resultado.porcentaje, 100))
        );
        if (Number(datos.meta) > 0 && Number(datos.ahorroActual) >= Number(datos.meta)) {
            resultadoTexto.textContent = "¡Felicitaciones! Ya alcanzaste tu meta de ahorro.";
        } else {
            resultadoTexto.textContent = `Tu progreso actual es del ${Math.round(datos.resultado.porcentaje)}%.`;
        }
    } else {
        reiniciarResultados();
    }
}
function limpiarCampos() {
    meta.value = "";
    ahorroActual.value = "";
    ahorroMensual.value = "";
    mensaje.textContent = "Los campos fueron limpiados.";
    resultadoTexto.textContent = "Ingresa tus datos para comenzar.";
    reiniciarResultados();
    guardarDatos();
}
function reiniciarResultados() {
    falta.textContent = "$0";
    meses.textContent = "0";
    metaResultado.textContent = "$0";
    porcentaje.textContent = "0%";
    progreso.style.width = "0%";
    progreso.setAttribute("aria-valuenow", "0");
}
//----------------------//
//--|restablecer_todo|--//
//----------------------//
function restablecerTodo() {
    const confirmar = confirm("¿Deseas restablecer todos tus datos de ahorro?");
    if (!confirmar) {
        return;
    }
    try {
        localStorage.removeItem("ahorros_personales");
        limpiarCampos();
        reiniciarResultados();
        resultadoTexto.textContent = "Ingresa tus datos para comenzar.";
        mensaje.textContent = "Todos los datos fueron restablecidos.";
    } catch (error) {
        console.error("No se pudieron restablecer los datos:", error);
        mensaje.textContent = "No fue posible restablecer los datos.";
    }
}
//-------------//
//--|eventos|--//
//-------------//
calcular.addEventListener("click", calcularAhorro);
limpiar.addEventListener("click", limpiarCampos);
restablecer.addEventListener("click", restablecerTodo);
function guardarCampos() {
    guardarDatos();
}
meta.addEventListener("input", guardarCampos);
ahorroActual.addEventListener("input", guardarCampos);
ahorroMensual.addEventListener("input", guardarCampos);
restaurarDatos();