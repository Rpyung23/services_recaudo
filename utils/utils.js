let getFecha_format = (fecha)=>
{


    var new_fecha = new Date(fecha)


    var dia = new_fecha.getDay();
    var mes = new_fecha.getMonth();
    var min = new_fecha.getMinutes()
    var hour = new_fecha.getHours()
    var seg = new_fecha.getSeconds()

    if(dia<10)
    {
        dia = "0"+dia;
    }
    if(mes<10)
    {
        mes = "0"+mes;
    }

    if(hour<10)
    {
        hour = "0"+hour;
    }

    if(min<10)
    {
        min = "0"+min;
    }

    if(seg<10)
    {
        seg = "0"+seg;
    }


    //console.log("ORIGINAL : "+fecha+" FORMAT "+new_fecha)

    return (new_fecha.getFullYear()+"-"+mes+"-"+dia+" "+hour+":"+min+":"+seg)
}

let getHora = (fecha)=>
{
    var horas = new Date(fecha)

    var min = horas.getMinutes()
    var hour = horas.getHours()
    var seg = horas.getSeconds()

    if(hour<10)
    {
        hour = "0"+hour;
    }

    if(min<10)
    {
        min = "0"+min;
    }

    if(seg<10)
    {
        seg = "0"+seg;
    }

    return (hour +":"+min+":"+seg)
}

let getFecha_dd_mm_yyyy = (fecha)=>
{
    var fecha_ = new Date(fecha);

    var dia = fecha_.getDay();
    var mes = fecha_.getMonth();

    if(dia<10)
    {
        dia = "0"+dia;
    }
    if(mes<10)
    {
        mes = "0"+mes;
    }

    return (fecha.getFullYear()+"-"+mes+"-"+dia)
}
let getMin_diferencia = (fechaProg,fechaMarc)=>
{
    var fechaPro = new Date(fechaProg)
    var fechaMar = new Date(fechaMarc)

    //console.log(fechaPro+ " ---> " +fechaMar)

    var min = fechaPro.getMinutes() - fechaMar.getMinutes()

    if((-1*min)>=0)
    {
        //console.log("Minutos : "+Math.abs(min))
        return Math.abs(min)
    }
    return null
}


let getSeg_diferencia = (fechaProg,fechaMarc)=>
{
    var fechaPro = new Date(fechaProg)
    var fechaMar = new Date(fechaMarc)

    //console.log(fechaPro+ " ---> " +fechaMar)
    var seg = fechaPro.getSeconds() - fechaMar.getSeconds()

    if((-1*seg>=0))
    {
        //console.log("Segundos : "+Math.abs(seg))
        return Math.abs(seg)
    }
    return null
}


module.exports = {getFecha_format,getHora,getFecha_dd_mm_yyyy,getMin_diferencia,getSeg_diferencia}