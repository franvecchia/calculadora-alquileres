const boton = document.getElementById('boton')

boton.addEventListener('click', (e) => {
    e.preventDefault()

    const fechaInicio = document.getElementById("fechaInicio").value
    const fechaFinalizacion = document.getElementById("fechaFinal").value
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

async function obtenerDatos () {
    const apiUrl = "inflacion_mensual_oficial"
    const proxyUrl = "https://bcra-proxy-cors.vercel.app"

    const peticion = await fetch(`${proxyUrl}/${apiUrl}`, {
        headers: {
            Authorization: "BEARER eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NDQ0MzMwNTgsInR5cGUiOiJleHRlcm5hbCIsInVzZXIiOiJmcmFudmVjY2hpYTAwQGdtYWlsLmNvbSJ9.LxijwX08kVJGZ5iJv6T8kS3kOO7q6z7r-16gB8TFTaIa8K7zVEcpUmrKRphC4JGq6YlhAZLzy3dldOfr5zT4vQ",
            // 11/4/25
        },
    })
    .then((response) => {return response.json()})
    .then((data) => {return data})
    .catch((err) => {return err})

    return peticion
}

async function arrayNuevo () {
    let arrViejo=await obtenerDatos()
    let arrNuevo=[
        {d: "2024-03-31", v: 11.0}
    ]

    let arrResultado=arrViejo.concat(arrNuevo);
    return arrResultado;
}

async function calcularDatos(fechaInicial, fechaFinalizacion, monto) {
    let arr = await arrayNuevo()
    let i=0
    let fechaBuscada=null
    let inflacion=0
    let acumInflacion=1
    let montoAcum=monto
    
    while (i<arr.length && fechaBuscada==null) {
        if (fechaAAnioMes(arr[i].d) === fechaAAnioMes(fechaInicial)) {
            fechaBuscada=arr[i]
            let FechaFinal= arr.find((fechaAux) => fechaAAnioMes(fechaAux.d) === fechaAAnioMes(fechaFinalizacion))

            while (fechaAAnioMes(fechaBuscada.d) != fechaAAnioMes(FechaFinal.d)) {
                inflacion=parseFloat(fechaBuscada.v)
                acumInflacion*=(1+(inflacion/100))
                montoAcum*=(1+(inflacion/100))
                i++
                fechaBuscada=arr[i]
            }
            inflacion=parseFloat(fechaBuscada.v)
            acumInflacion*=(1+(inflacion/100))
            montoAcum*=(1+(inflacion/100))
        } else {
            i++
        }
    }
    
    acumInflacion=(acumInflacion-1)*100;
    let contenidoResultado=document.getElementById('resultado')
    contenidoResultado.innerHTML=`<p class="resultado">Monto Actualizado: ${montoAcum.toFixed(2)}</p>
    <p class="resultado-numero">(+${acumInflacion.toFixed(1)}%)</p>`
}

function fechaAAnioMes(fecha) {
    let anioYMes = fecha.substring(0, 7)
    return anioYMes
}

function fechaAlReves(fecha) {
    const partes = fecha.split('-')
    const nuevaFecha = `${partes[2]}-${partes[1]}-${partes[0]}`
  
    return nuevaFecha
}

$(async function() {
    let arrAux = await arrayNuevo()
    let fechaMaxConvertida = fechaAlReves(arrAux[arrAux.length-1].d)
    let fechaMinConvertida = fechaAlReves(arrAux[0].d)

    $( "#fechaInicio" ).datepicker({ 
        dateFormat: "dd-mm-yy", 
        maxDate: fechaMaxConvertida,
        minDate: fechaMinConvertida
    })

    $( "#fechaFinal" ).datepicker({ 
        dateFormat: "dd-mm-yy", 
        maxDate: fechaMaxConvertida,
        minDate: fechaMinConvertida
    })
})