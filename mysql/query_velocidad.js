let mysql = require("mysql")
let {objConn} = require("../mysql/config")

let {getFecha_format,getHora,getFecha_dd_mm_yyyy} = require("../utils/utils")

let query_velocidad_historial = (code,tarjeta,velocidad,fecha,unidad,callback)=>
{
    objConn(code).then((resolve)=>
    {
        let conn = resolve

        var query_string = "select t1.FechHistEven,t1.LatiHistEven,t1.LongHistEven,t1.RumbHistEven,t1.VeloHistEven\n" +
            "  from historial_eventos t1 where t1.CodiVehiHistEven = "+unidad+" " +
            " and t1.idSali_mHistEven = "+tarjeta+" and t1.FechHistEven " +
            "between '"+fecha+" 05:00:00' and '"+fecha+" 23:59:59' " +
            " and t1.VeloHistEven >= "+velocidad+" order by FechHistEven Asc"

        conn.query(query_string,function(error,results,fields)
        {
            if(error)
            {
                callback(error,null)
            }else
            {
                let vector = []
                for(let i = 0;i<results.length;i++)
                {
                    var obj =
                        {
                            hora:getHora(results[i].FechHistEven),
                            lat:results[i].LatiHistEven,
                            lng:results[i].LongHistEven,
                            rumbo:results[i].RumbHistEven,
                            velocidad:results[i].VeloHistEven
                    }
                    vector[i] = obj
                }
                conn.end()
                callback(null,vector)
            }
        })


    }).catch(()=>
    {
        callback({
            sqlMessage:'Error en query Conn Dinamica'
        },null)
        console.log('Error CONN BD')
    })
}


let query_velocidad_general = (code,velocidad,fecha,callback)=>
{
    objConn(code).then((resolve)=>
    {
        let conn = resolve

        var query_string = "select SM.CodiVehiSali_m,SM.idSali_m,H.FechHistEven,H.LatiHistEven,H.LongHistEven," +
            "H.RumbHistEven,H.VeloHistEven from salida_m as SM join historial_eventos as H " +
            "on SM.CodiVehiSali_m = H.CodiVehiHistEven and SM.idSali_m = H.idSali_mHistEven " +
            "and H.FechHistEven between '"+fecha+" 05:00:00' and '"+fecha+" 23:59:59' " +
            "and H.VeloHistEven >= "+velocidad+" where SM.HoraSaliProgSali_m " +
            "between '"+fecha+" 05:00:00' and '"+fecha+" 23:59:59' and SM.EstaSali_m <> 4 " +
            "order by SM.CodiVehiSali_m , H.FechHistEven Asc"

        conn.query(query_string,function(error,results,fields)
        {
            if(error)
            {
                callback(error,null)
            }else
            {
                let vector = []
                for(let i = 0;i<results.length;i++)
                {
                    var obj =
                        {
                            unidad:results[i].CodiVehiSali_m,
                            tarjeta:results[i].idSali_m,
                            hora:getHora(results[i].FechHistEven),
                            lat:results[i].LatiHistEven,
                            lng:results[i].LongHistEven,
                            rumbo:results[i].RumbHistEven,
                            velocidad:results[i].VeloHistEven
                        }
                    vector[i] = obj
                }
                conn.end()
                callback(null,vector)
            }
        })


    }).catch(()=>
    {
        callback({
            sqlMessage:'Error en query Conn Dinamica'
        },null)
        console.log('Error CONN BD')
    })
}


let query_velocidad_total_all = (code,fechaI,fechaF,velocidad,callback)=>
{
    objConn(code).then((resolve)=>
    {
        let conn = resolve

        var query_string = "select CodiVehiHistEven,FechHistEven FechaHistorial,FechHistEven HoraHistorial," +
            "LatiHistEven,LongHistEven,RumbHistEven,VeloHistEven,idSali_mHistEven from historial_eventos where FechHistEven " +
            "between '"+fechaI+" 05:00:00' and '"+fechaF+" 23:59:59' and VeloHistEven >= "+velocidad+" " +
            "order by convert(CodiVehiHistEven, signed),FechHistEven Asc"

        conn.query(query_string,function(error,results,fields)
        {
            if(error)
            {
                callback(error,null)
            }else
            {
                let vector = []
                for(let i = 0;i<results.length;i++)
                {

                    var aux_tarjeta = results[i].idSali_mHistEven
                    var tarjeta = 0;

                    if(aux_tarjeta.length>0 && aux_tarjeta!=null)
                    {
                        tarjeta = parseInt(aux_tarjeta)
                    }


                    var obj =
                        {
                            unidad:results[i].CodiVehiHistEven,
                            hora:getHora(results[i].FechaHistorial),
                            tarjeta:tarjeta,
                            lat:results[i].LatiHistEven,
                            lng:results[i].LongHistEven,
                            rumbo:results[i].RumbHistEven,
                            velocidad:results[i].VeloHistEven
                        }
                    vector[i] = obj
                }
                conn.end()
                callback(null,vector)
            }
        })


    }).catch(()=>
    {
        callback({
            sqlMessage:'Error en query Conn Dinamica'
        },null)
        console.log('Error CONN BD')
    })
}


let query_velocidad_total_unidad = (code,unidad,fechaI,fechaF,velocidad,callback)=>
{
    objConn(code).then((resolve)=>
    {
        let conn = resolve

        var query_string = "select CodiVehiHistEven,FechHistEven FechaHistorial,FechHistEven HoraHistorial,LatiHistEven," +
            "LongHistEven,RumbHistEven,VeloHistEven,idSali_mHistEven from historial_eventos where FechHistEven " +
            "between '"+fechaI+" 05:00:00' and '"+fechaF+" 23:59:59' and VeloHistEven >= "+velocidad+" " +
            "and CodiVehiHistEven="+unidad+" order by convert(CodiVehiHistEven, signed),FechHistEven Asc"

        console.log(query_string)

        conn.query(query_string,function(error,results,fields)
        {
            if(error)
            {
                callback(error,null)
            }else
            {
                let vector = []
                for(let i = 0;i<results.length;i++)
                {
                    var aux_tarjeta = results[i].idSali_mHistEven
                    var tarjeta = 0;

                    if(aux_tarjeta.length>0 && aux_tarjeta!=null)
                    {
                        tarjeta = parseInt(aux_tarjeta)
                    }

                    var obj =
                        {
                            unidad:results[i].CodiVehiHistEven,
                            tarjeta:tarjeta,
                            hora:getHora(results[i].FechaHistorial),
                            lat:results[i].LatiHistEven,
                            lng:results[i].LongHistEven,
                            rumbo:results[i].RumbHistEven,
                            velocidad:results[i].VeloHistEven
                        }
                    vector[i] = obj
                }
                conn.end()
                callback(null,vector)
            }
        })


    }).catch(()=>
    {
        callback({
            sqlMessage:'Error en query Conn Dinamica'
        },null)
        console.log('Error CONN BD')
    })
}

module.exports = {query_velocidad_historial,query_velocidad_general,query_velocidad_total_all
    ,query_velocidad_total_unidad}
