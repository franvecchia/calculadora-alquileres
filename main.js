const boton = document.getElementById('boton')
let fechaActual = new Date().toISOString().split('T')[0];
document.getElementById('fechaInicio').max = fechaActual;
document.getElementById('fechaFinal').max = fechaActual

boton.addEventListener('click', (e) => {
    e.preventDefault()

    const fechaInicio = document.getElementById("fechaInicio").value
    const fechaFinalizacion = document.getElementById("fechaFinal").value
    const monto = document.getElementById('monto').value

    if (fechaInicio != "" && fechaFinalizacion != "" && monto != "" && fechaInicio<fechaFinalizacion && monto>0) {
        calcularDatos(fechaInicio, fechaFinalizacion, monto)
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

async function calcularDatos(fechaInicial, fechaFinalizacion, monto) {
    let arr = await obtenerDatos()
    let i=0
    let fechaBuscada=null
    let inflacion=0
    let montoAcum=monto
    
    while (i<arr.length && fechaBuscada==null) {
        if (fechaAAnioMes(arr[i].d) === fechaAAnioMes(fechaInicial)) {
            fechaBuscada=arr[i]
            let FechaFinal= arr.find((fechaAux) => fechaAAnioMes(fechaAux.d) === fechaAAnioMes(fechaFinalizacion))
            if (FechaFinal == null) {
                i--
                fechaBuscada=arr[i]
                let size=arr.length
                FechaFinal=arr[size-1]
            }

            while (fechaAAnioMes(fechaBuscada.d) != fechaAAnioMes(FechaFinal.d)) {
                inflacion=parseFloat(fechaBuscada.v)
                montoAcum*=(1+(inflacion/100))
                i++
                fechaBuscada=arr[i]
            }
            
            inflacion=parseFloat(fechaBuscada.v)
            montoAcum*=(1+(inflacion/100))
            i++
            fechaBuscada=arr[i]
        } else {
            i++
        }
    }

    let contenidoResultado=document.getElementById('resultado')
    contenidoResultado.innerHTML=`<p class="resultado">Monto Actualizado: ${montoAcum.toFixed(2)}</p>`
}

function fechaAAnioMes(fecha) {
    let anioYMes = fecha.substring(0, 7)
    return anioYMes
}