const boton = document.getElementById('boton')

boton.addEventListener('click', (e) => {
    e.preventDefault()

    const fechaInicio = document.getElementById('fechaInicio').value
    const fechaFinalizacion = document.getElementById('fechaFinal').value
    const monto = document.getElementById('monto').value

    if (fechaInicio != "" && fechaFinalizacion != "" && monto != "" && fechaInicio<fechaFinalizacion && monto>0) {
        calcularDatos(fechaAlReves(fechaInicio), fechaAlReves(fechaFinalizacion), monto)
    } else {
        Swal.fire({
            title: "Ingrese los datos correctamente.",
            icon: "error",
            confirmButtonColor: '#003256'
        })
    }
})

async function obtenerDatos() {
    const url = "https://api.bcra.gob.ar/estadisticas/v3.0/Monetarias/27"
    const peticion = await fetch(url)
    .then((response) => {return response.json()})
    .then((data) => {return data.results})
    .catch((err) => {return err})

    return peticion
}

async function calcularDatos(fechaInicial, fechaFinalizacion, monto) {
    let arrayFechas = await obtenerDatos()
    let inflacion=0
    let acumInflacion=1
    let montoAcum=monto
   
    arrayFechas.forEach(element => {element.fecha = fechaAAnioMes(element.fecha)})

    let indexFechaInicial = arrayFechas.findIndex(element => element.fecha === fechaAAnioMes(fechaInicial))
    let indexFechaFinal = arrayFechas.findIndex(element => element.fecha === fechaAAnioMes(fechaFinalizacion))

    for (let i=indexFechaInicial;i>=indexFechaFinal;i--) {
        inflacion=parseFloat(arrayFechas[i].valor)
        acumInflacion*=(1+(inflacion/100))
        montoAcum*=(1+(inflacion/100))
    }

    acumInflacion=(acumInflacion-1)*100
    mostrarResultado(montoAcum, acumInflacion)
}

function mostrarResultado (montoAcum, acumInflacion) {
    let contenidoResultado=document.getElementById('resultado')
    contenidoResultado.innerHTML=`<p class="resultado">Monto Actualizado: ${montoAcum.toFixed(2)}</p>
    <p class="resultado-numero">(+${acumInflacion.toFixed(1)}%)</p>`
}

function fechaAAnioMes(fecha) {
    return fecha.substring(0, 7)
} 

function fechaAlReves(fecha) {
    const partes = fecha.split('-')
    return `${partes[2]}-${partes[1]}-${partes[0]}`
}

$(async () => {
    let arrayFechas = await obtenerDatos()
    let fechaMinConvertida = fechaAlReves(arrayFechas[arrayFechas.length-1].fecha)
    let fechaMaxConvertida = fechaAlReves(arrayFechas[0].fecha)

    $( "#fechaInicio" ).datepicker({ 
        dateFormat: "dd-mm-yy",
        dayNamesMin: ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sa"],
        monthNames: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", 
        "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
        maxDate: fechaMaxConvertida,
        minDate: fechaMinConvertida
    })

    $( "#fechaFinal" ).datepicker({ 
        dateFormat: "dd-mm-yy",
        dayNamesMin: ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sa"],
        monthNames: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", 
        "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
        maxDate: fechaMaxConvertida,
        minDate: fechaMinConvertida
    })
})