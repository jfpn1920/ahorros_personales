/*------------------------------------*/
/*--|elementos_del_dom|---------------*/
/*------------------------------------*/

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

/*------------------------------------*/
/*--|obtener_datos|-------------------*/
/*------------------------------------*/

function obtenerDatos() {
    const datos = localStorage.getItem("ahorros_personales");

    if (datos) {
        return JSON.parse(datos);
    }

    return {
        meta: "",
        ahorroActual: "",
        ahorroMensual: "",
        resultado: null
    };
}

/*------------------------------------*/
/*--|guardar_datos|-------------------*/
/*------------------------------------*/

function guardarDatos(resultado = null) {
    const datos = {
        meta: meta.value,
        ahorroActual: ahorroActual.value,
        ahorroMensual: ahorroMensual.value,
        resultado: resultado
    };

    localStorage.setItem(
        "ahorros_personales",
        JSON.stringify(datos)
    );
}

/*------------------------------------*/
/*--|calcular_ahorro|-----------------*/
/*------------------------------------*/

function calcularAhorro() {
    const valorMeta = Number(meta.value);
    const valorActual = Number(ahorroActual.value);
    const valorMensual = Number(ahorroMensual.value);

    if (valorMeta <= 0) {
        mensaje.textContent =
            "Ingresa una meta de ahorro válida.";
        meta.focus();
        return;
    }

    if (valorActual < 0 || valorMensual <= 0) {
        mensaje.textContent =
            "Ingresa valores de ahorro válidos.";
        return;
    }

    if (valorActual >= valorMeta) {
        mostrarResultado(0, 0, 100);

        resultadoTexto.textContent =
            "¡Felicitaciones! Ya alcanzaste tu meta de ahorro.";

        guardarDatos({
            falta: 0,
            meses: 0,
            porcentaje: 100
        });

        mensaje.textContent =
            "Ya alcanzaste tu objetivo.";
        return;
    }

    const dineroFaltante = valorMeta - valorActual;

    const mesesNecesarios =
        Math.ceil(dineroFaltante / valorMensual);

    const progresoActual =
        (valorActual / valorMeta) * 100;

    const porcentajeFinal =
        Math.min(progresoActual, 100);

    mostrarResultado(
        dineroFaltante,
        mesesNecesarios,
        porcentajeFinal
    );

    resultadoTexto.textContent =
        `Si ahorras ${formatearMoneda(valorMensual)} cada mes, ` +
        `necesitarás aproximadamente ${mesesNecesarios} mes(es) ` +
        `para alcanzar tu meta.`;

    guardarDatos({
        falta: dineroFaltante,
        meses: mesesNecesarios,
        porcentaje: porcentajeFinal
    });

    mensaje.textContent =
        "El cálculo fue realizado correctamente.";
}

/*------------------------------------*/
/*--|mostrar_resultado|---------------*/
/*------------------------------------*/

function mostrarResultado(dineroFaltante, cantidadMeses, porcentajeFinal) {
    falta.textContent = formatearMoneda(dineroFaltante);

    meses.textContent =
        cantidadMeses;

    metaResultado.textContent =
        formatearMoneda(Number(meta.value));

    const porcentajeRedondeado =
        Math.round(porcentajeFinal);

    porcentaje.textContent =
        `${porcentajeRedondeado}%`;

    progreso.style.width =
        `${porcentajeFinal}%`;
}

/*------------------------------------*/
/*--|formatear_moneda|----------------*/
/*------------------------------------*/

function formatearMoneda(valor) {
    return new Intl.NumberFormat(
        "es-CO",
        {
            style: "currency",
            currency: "COP",
            maximumFractionDigits: 0
        }
    ).format(valor);
}

/*------------------------------------*/
/*--|restaurar_datos|-----------------*/
/*------------------------------------*/

function restaurarDatos() {
    const datos = obtenerDatos();

    meta.value = datos.meta;
    ahorroActual.value = datos.ahorroActual;
    ahorroMensual.value = datos.ahorroMensual;

    if (datos.resultado) {
        mostrarResultado(
            datos.resultado.falta,
            datos.resultado.meses,
            datos.resultado.porcentaje
        );

        resultadoTexto.textContent =
            `Tu progreso actual es del ` +
            `${Math.round(datos.resultado.porcentaje)}%.`;
    }
}

/*------------------------------------*/
/*--|limpiar_campos|------------------*/
/*------------------------------------*/

function limpiarCampos() {
    meta.value = "";
    ahorroActual.value = "";
    ahorroMensual.value = "";

    mensaje.textContent =
        "Los campos fueron limpiados.";
}

/*------------------------------------*/
/*--|restablecer_todo|----------------*/
/*------------------------------------*/

function restablecerTodo() {
    localStorage.removeItem("ahorros_personales");

    limpiarCampos();

    falta.textContent = "$0";
    meses.textContent = "0";
    metaResultado.textContent = "$0";
    porcentaje.textContent = "0%";

    progreso.style.width = "0%";

    resultadoTexto.textContent =
        "Ingresa tus datos para comenzar.";

    mensaje.textContent =
        "Todos los datos fueron restablecidos.";
}

/*------------------------------------*/
/*--|eventos|-------------------------*/
/*------------------------------------*/

calcular.addEventListener("click", calcularAhorro);

limpiar.addEventListener("click", limpiarCampos);

restablecer.addEventListener("click", restablecerTodo);

/*------------------------------------*/
/*--|guardar_al_escribir|-------------*/
/*------------------------------------*/

meta.addEventListener("input", function() {
    guardarDatos();
});

ahorroActual.addEventListener("input", function() {
    guardarDatos();
});

ahorroMensual.addEventListener("input", function() {
    guardarDatos();
});

/*------------------------------------*/
/*--|cargar_datos|--------------------*/
/*------------------------------------*/

restaurarDatos();