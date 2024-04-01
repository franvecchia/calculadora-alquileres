let fechaInicio = document.getElementById("fechaInicio");
let fechaFinalizacion = document.getElementById("fechaFinal");
let boton = document.getElementById('boton');
let monto = document.getElementById('monto');
let valorFechaInicio;
let valorFechaFinal;
let valorMonto;
let fechaInicial;


boton.addEventListener('click', (e) => {
    e.preventDefault();

    valorFechaInicio = fechaInicio.value;
    valorFechaFinal = fechaFinalizacion.value;
    valorMonto = monto.value;
    let fechaInicialEntero = fechaAEntero(valorFechaInicio);
    let fechaFinalEntero = fechaAEntero(valorFechaFinal);
    console.log("La fecha de inicio es: ", fechaInicialEntero);
    console.log("La fecha de finalizacion es: ", fechaFinalEntero);
    console.log(fechaInicial);
})

function fechaAEntero(fecha) {
    // Eliminar los guiones de la fecha
    let fechaSinGuiones = fecha.replace(/-/g, "");

    // Convertir la cadena resultante a un número entero
    let fechaComoEntero = parseInt(fechaSinGuiones, 10);

    return fechaComoEntero;
}

const apiUrl = "inflacion_mensual_oficial";
const proxyUrl = "https://bcra-proxy-cors.vercel.app";

fetch(`${proxyUrl}/${apiUrl}`, {
    headers: {
        Authorization: "BEARER eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NDM1NDM3NDQsInR5cGUiOiJleHRlcm5hbCIsInVzZXIiOiJmcmFudmVjY2hpYTAwQGdtYWlsLmNvbSJ9.hYSveqvheMmxxyMzT5GVSzrCqFWl3AAutve1EE_yWyOG7kR4uVv4E9n0hiysMgg_eEdPXgXDi1-mP7Jib_pzYg",
    },
})
    .then((response) => response.json())
    .then((data) => {
        console.log(data)
        fechaInicial=buscarFechaInicial(data);

        console.log(fechaInicial)
    })

function buscarFechaInicial(data) {
    let i = 0;
    let fechaBuscada = null;
    let fechaInicioSinDia=fechaAAnioMes(valorFechaInicio);
    while (i < data.length && fechaBuscada == null) {
        let fecha = fechaAAnioMes(data[i])
        if (fecha == fechaInicioSinDia) {
            fechaBuscada = data[i];
        } else {
            i++;
        }
    }
}

function fechaAAnioMes(fecha) {
    let anioYMes = fecha.substring(0, 7);
    return anioYMes;
}

function realizarCalculos(f) {

}