let getFecha_format = (fecha)=>
{
    var new_fecha = new Date(fecha).toISOString()
        .replace(/T/,' ').replace(/\..+/, '')
    return new_fecha
}


module.exports = {getFecha_format}