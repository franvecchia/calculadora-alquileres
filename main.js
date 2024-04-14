let boton = document.getElementById('boton')

boton.addEventListener('click', (e) => {
    e.preventDefault()

    let fechaInicio = document.getElementById("fechaInicio").value
    let fechaFinalizacion = document.getElementById("fechaFinal").value
    let monto = document.getElementById('monto').value
    calcularFechaInicial(fechaInicio)
})


async function obtenerDatos () {
    const apiUrl = "inflacion_mensual_oficial"
    const proxyUrl = "https://bcra-proxy-cors.vercel.app"

    const peticion = await fetch(`${proxyUrl}/${apiUrl}`, {
        headers: {
            Authorization: "BEARER eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NDQ0MzMwNTgsInR5cGUiOiJleHRlcm5hbCIsInVzZXIiOiJmcmFudmVjY2hpYTAwQGdtYWlsLmNvbSJ9.LxijwX08kVJGZ5iJv6T8kS3kOO7q6z7r-16gB8TFTaIa8K7zVEcpUmrKRphC4JGq6YlhAZLzy3dldOfr5zT4vQ",
        },
    })
    .then((response) => {return response.json()})
    .then((data) => {return data})
    .catch((err) => {return err})

    return peticion
}

async function calcularFechaInicial(fechaInicial) {
    let arr = await obtenerDatos()
    let fechaBuscada = arr.find((fechaAux) => fechaAAnioMes(fechaAux.d) === fechaAAnioMes(fechaInicial))

    console.log(fechaBuscada)
    return fechaBuscada
}

function fechaAAnioMes(fecha) {
    let anioYMes = fecha.substring(0, 7)
    return anioYMes
}