let getFecha_format = (fecha)=>
{
    var new_fecha = new Date(fecha).toISOString()
        .replace(/T/,' ').replace(/\..+/, '')
    return new_fecha
}

let getHora = (fecha)=>
{
    var horas = new Date(fecha);
    return (horas.getUTCHours() +":"+horas.getUTCMinutes()+":"+horas.getUTCSeconds())
}

module.exports = {getFecha_format,getHora}