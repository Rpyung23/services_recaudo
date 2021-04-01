process.env.TZ = 'America/Guayaquil';

//const moment_locate = require("../libs/moment_timezone")

const moment = require("../libs/moment_timezone")

let getFecha_format = (fecha)=>
{

    var new_fecha = new Date(fecha)


    var dia = new_fecha.getDate();

    var mes = new_fecha.getMonth();

    mes += 1

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



    return (new_fecha.getFullYear()+"-"+mes+"-"+dia+" "+hour+":"+min+":"+seg)

    return moment_constr.subtract(10, 'days').calendar();
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

    var fecha_ = new Date(fecha)


    var dia = fecha_.getDate();

    var mes = fecha_.getMonth();

    mes =mes +1;

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