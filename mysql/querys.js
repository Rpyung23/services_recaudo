let mysql = require("mysql")
let {objConn} = require("../mysql/config")

let {getFecha_format,getHora,getFecha_dd_mm_yyyy,getSeg_diferencia,getMin_diferencia} = require("../utils/utils")


/*let objConn =
    {
        host:"71.6.142.111",
        user:"root",
        password:"Vigitrack102030*",
        database:"uambatena",
    }

let conn = mysql.createConnection(objConn)

conn.connect(function(error)
{
    if(error) throw error
    console.log('CONNECTED AS ID '+conn.threadId)
});*/

let query_salidas_unidad_fechas_horas = (code,id_bus,fecha,horaI,horaF,callback)=>
{


    objConn(code).then((resolve)=>
    {
        let conn = resolve

        let string_query = "select idSali_m,NumeTarjSali_m,HoraLlegProgSali_m,HoraSaliProgSali_m,DescRutaSali_m,NumeVuelSali_m from salida_m where CodiVehiSali_m = '"+id_bus+"' AND HoraLLegProgSali_m  between '"+fecha+" "+horaI+"' and '"+fecha+" "+horaF+"'"
        console.log(string_query)
        conn.query(string_query,function(error,results,fields)
        {
            //console.log(`${results}`)
            if(error)
            {
                callback(error,null)
            }else
            {
                let datos_salidas = []
                for(let i=0;i<results.length;i++)
                {

                    //console.log(obj)


                    let fechaLleg = getFecha_format(results[i].HoraLlegProgSali_m)
                    let fechaSali = getFecha_format(results[i].HoraSaliProgSali_m)

                    var obj =
                        {
                            llegada:fechaLleg,
                            salida:fechaSali,
                            id_salida:results[i].idSali_m,
                            num_tarjeta_salida:results[i].NumeTarjSali_m,
                            frecuencia:results[i].DescRutaSali_m,
                            num_vuelta:results[i].NumeVuelSali_m,
                            velo:results[i].VeloMaxiSali_m
                        }

                    datos_salidas[i] =  obj
                }
                conn.end()
                callback(null,datos_salidas)
            }
        });

    }).catch(()=>
    {
        callback({
            sqlMessage:'Error en query Conn Dinamica'
        },null)
        console.log('Error CONN BD')
    })



}

/**********************************************************/

let query_tarjeta_salida_d = (code,id_salida_m,callback)=>
{
    objConn(code).then((resolve)=>
    {
        let conn = resolve

        var string_query = "select CodiCtrlSali_d,HoraProgSali_d,HoraMarcSali_d,DescCtrlSali_d,FaltSali_d from salida_d where idSali_mSali_d = "+id_salida_m
        conn.query(string_query,function(error,results,fields)
        {
            if(error)
            {
                callback(error,null)
            }else
            {
                let tarjeta = []
                for(let i=0;i<results.length;i++)
                {
                    obj = {
                        cod_control:results[i].CodiCtrlSali_d,
                        hora_prog_sali:getHora(results[i].HoraProgSali_d),
                        hora_marc_sali:getHora(results[i].HoraMarcSali_d),
                        detalle_control:results[i].DescCtrlSali_d,
                        falta:results[i].FaltSali_d
                    }

                    tarjeta[i] = obj
                }
                conn.end()
                callback(null,tarjeta)
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


let query_recorrido_bus = (code,id_bus,fecha,horaI,horaF,callback)=>
{

    objConn(code).then((resolve)=>
    {
        let conn = resolve

        var string_query = "select CodiVehiHistEven,FechHistEven,LatiHistEven,LongHistEven,RumbHistEven,VeloHistEven " +
            "from historial_eventos where FechHistEven between '"+fecha+" "+horaI+"' and '"+fecha+" "+horaF+"' and CodiVehiHistEven = '"+id_bus+"'"

        console.log(string_query)

        conn.query(string_query,function(error,results,fields)
        {
            if(error)
            {
                console.log(error)
                callback(error,null)
            }else
            {
                let recorridos = []
                for(let i=0;i<results.length;i++)
                {
                    var obj =
                        {
                            id_vehi:results[i].CodiVehiHistEven,
                            fecha:getFecha_format(results[i].FechHistEven),
                            lat:results[i].LatiHistEven,
                            lng:results[i].LongHistEven,
                            grados:results[i].RumbHistEven,
                            velocidad:results[i].VeloHistEven
                        }
                    recorridos[i] = obj
                }
                conn.end()
                callback(null,recorridos)
            }
        });


    }).catch(()=>
    {
        callback({
            sqlMessage:'Error en query Conn Dinamica'
        },null)
        console.log('Error CONN BD')
    })
}

let query_report_ant = (code,fecha_ini,fecha_fin,horaini,horafin,callback)=>
{

    let fechahoraI = fecha_ini+" "+horaini
    let fechahoraF = fecha_fin+" "+horafin
    objConn(code).then((resolve)=>
    {
        let conn = resolve

        var string_query = "select SM.CodiVehiSali_m,V.PlacVehi,OB.AliaObse,OBV.CodiObseObseVehi,SM.HoraLlegProgSali_m," +
            "SM.HoraSaliProgSali_m,SM.DescRutaSali_m,SM.NumeVuelSali_m,SM.MontInfrUnidSali_m,VeloMaxiSali_m " +
            "from salida_m as SM JOIN observador_vehiculo as OBV on " +
            "SM.CodiVehiSali_m = OBV.CodiVehiObseVehi LEFT JOIN observador as OB on " +
            "OB.CodiObse = OBV.CodiObseObseVehi LEFT join vehiculo as V on " +
            "V.CodiVehi = SM.CodiVehiSali_m and V.idEstaVehi = 1 and NumeSIMVehi is not null " +
            "where HoraLLegProgSali_m between '"+fechahoraI+"' and '"+fechahoraF+"' order by CodiVehiSali_m"

        //console.log(string_query)
        conn.query(string_query,function(error,results,fields)
        {
            if(error)
            {
                callback(error,null)
            }else
            {
                let vector = []
                for(var i = 0;i<results.length;i++)
                {
                    var obj =
                        {
                            codi_vehi :results[i].CodiVehiSali_m,
                            placa_vehi :results[i].PlacVehi,
                            propietario :results[i].AliaObse,
                            ced:"S/N",
                            hora_lleg :getHora(results[i].HoraLlegProgSali_m),
                            hora_sali :getHora(results[i].HoraSaliProgSali_m),
                            ruta :results[i].DescRutaSali_m,
                            monto :results[i].MontInfrUnidSali_m,
                            vuelta:results[i].NumeVuelSali_m,
                            velo :results[i].VeloMaxiSali_m
                        }
                    vector[i] = obj
                }
                conn.end()
                callback(null,vector);
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


let query_report_tarjeta_unidad_all_sp = (code,fechaIni,fechaFin,callback)=>
{

    objConn(code).then((resolve)=>
    {
        let conn = resolve

        var string_query = "select SM.idSali_m,SM.DescRutaSali_m,SM.CodiVehiSali_m ,SM.NumeVuelSali_m," +
            "SM.HoraSaliProgSali_m ,SD.DescCtrlSali_d ,SD.HoraProgSali_d,SD.HoraMarcSali_d," +
            "SD.FaltSali_d,SD.PenaCtrlSali_d from salida_m as SM left join " +
            "salida_d as SD on SM.idSali_m=SD.idSali_mSali_d where " +
            "SM.HoraLLegProgSali_m between '"+fechaIni+" 05:00:00' and '"+fechaFin+" 23:59:59' " +
            "and SM.EstaSali_m <>4 order by SM.CodiVehiSali_m"
        conn.query(string_query,function(error,results,fields)
        {
            if(error)
            {
                callback(error,null)
            }else
            {
                let datos = []
                for(var i=0;i<results.length;i++)
                {
                    var obj =
                        {
                            id_salida :results[i].idSali_m,
                            ruta:results[i].DescRutaSali_m,
                            vehi:results[i].CodiVehiSali_m,
                            num_vuelta:results[i].NumeVuelSali_m,
                            control:results[i].DescCtrlSali_d,
                            fecha_sali_prog:getFecha_format(results[i].HoraSaliProgSali_m),
                            hora_sali:getHora(results[i].HoraProgSali_d),
                            hora_marc:getHora(results[i].HoraMarcSali_d),
                            falta:results[i].FaltSali_d,
                            penalidad:results[i].PenaCtrlSali_d
                        }
                    datos[i] = obj
                }
                conn.end()
                callback(null,datos)
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

let query_report_tarjeta_unidad_all_cp = (code,fechaIni,fechaFin,callback)=>
{

    objConn(code).then((resolve)=>
    {
        let conn = resolve

        string_query = "select SM.idSali_m,SM.DescRutaSali_m,SM.CodiVehiSali_m,SM.NumeVuelSali_m," +
            "SM.HoraSaliProgSali_m ,SD.DescCtrlSali_d,SD.HoraProgSali_d,SD.HoraMarcSali_d," +
            "SD.FaltSali_d,SD.PenaCtrlSali_d from salida_m as SM " +
            "left join salida_d as SD on SM.idSali_m=SD.idSali_mSali_d where SM.HoraLLegProgSali_m " +
            "between '"+fechaIni+" 05:00:00' and '"+fechaFin+" 23:59:59' and SM.EstaSali_m <>4 and SD.FaltSali_d>0 " +
            "order by SM.CodiVehiSali_m"
        conn.query(string_query,function(error,results,fields)
        {
            if(error)
            {
                callback(error,null)
            }else
            {
                let datos = []
                for(var i=0;i<results.length;i++)
                {
                    var obj =
                        {
                            id_salida :results[i].idSali_m,
                            ruta:results[i].DescRutaSali_m,
                            vehi:results[i].CodiVehiSali_m,
                            num_vuelta:results[i].NumeVuelSali_m,
                            control:results[i].DescCtrlSali_d,
                            fecha_sali_prog:getFecha_format(results[i].HoraSaliProgSali_m),
                            hora_sali:getHora(results[i].HoraProgSali_d),
                            hora_marc:getHora(results[i].HoraMarcSali_d),
                            falta:results[i].FaltSali_d,
                            penalidad:results[i].PenaCtrlSali_d
                        }
                    datos[i] = obj
                }
                conn.end()
                callback(null,datos)
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


let query_report_tarjeta_unidad_sp = (code,unidad,fechaIni,fechaFin,callback)=>
{



    objConn(code).then((resolve)=>
    {
        let conn = resolve

        var string_query = "select SM.idSali_m,SM.DescRutaSali_m,SM.CodiVehiSali_m ,SM.NumeVuelSali_m," +
            "SM.HoraSaliProgSali_m ,SD.DescCtrlSali_d,SD.HoraProgSali_d,SD.HoraMarcSali_d," +
            "SD.FaltSali_d,SD.PenaCtrlSali_d from salida_m as SM left join salida_d " +
            "as SD on SM.idSali_m=SD.idSali_mSali_d where  SM.CodiVehiSali_m = "+unidad+" " +
            "and SM.HoraLLegProgSali_m between '"+fechaIni+" 05:00:00' and '"+fechaFin+" 23:59:59' and " +
            "SM.EstaSali_m <>4 order by SM.CodiVehiSali_m"
        conn.query(string_query,function(error,results,fields)
        {
            if(error)
            {
                callback(error,null)
            }else
            {
                let datos = []
                for(var i=0;i<results.length;i++)
                {
                    var obj =
                        {
                            id_salida :results[i].idSali_m,
                            ruta:results[i].DescRutaSali_m,
                            vehi:results[i].CodiVehiSali_m,
                            num_vuelta:results[i].NumeVuelSali_m,
                            control:results[i].DescCtrlSali_d,
                            fecha_sali_prog:getFecha_format(results[i].HoraSaliProgSali_m),
                            hora_sali:getHora(results[i].HoraProgSali_d),
                            hora_marc:getHora(results[i].HoraMarcSali_d),
                            falta:results[i].FaltSali_d,
                            penalidad:results[i].PenaCtrlSali_d
                        }
                    datos[i] = obj
                }
                conn.end()
                callback(null,datos)
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

let query_report_tarjeta_unidad_cp = (code,unidad,fechaIni,fechaFin,callback)=>
{

    objConn(code).then((resolve)=>
    {
        let conn = resolve

        var string_query = "select SM.idSali_m,SM.DescRutaSali_m,SM.CodiVehiSali_m ,SM.NumeVuelSali_m," +
            "SM.HoraSaliProgSali_m ,SD.DescCtrlSali_d,SD.HoraProgSali_d,SD.HoraMarcSali_d," +
            "SD.FaltSali_d,SD.PenaCtrlSali_d from salida_m as SM left join salida_d " +
            "as SD on SM.idSali_m=SD.idSali_mSali_d where  SM.CodiVehiSali_m = "+unidad+" " +
            "and SM.HoraLLegProgSali_m between '"+fechaIni+" 05:00:00' and '"+fechaFin+" 23:59:59' and " +
            "SM.EstaSali_m <>4 and SD.FaltSali_d>0 order by SM.CodiVehiSali_m"
        conn.query(string_query,function(error,results,fields)
        {
            if(error)
            {
                callback(error,null)
            }else
            {
                let datos = []
                for(var i=0;i<results.length;i++)
                {
                    var obj =
                        {
                            id_salida :results[i].idSali_m,
                            ruta:results[i].DescRutaSali_m,
                            vehi:results[i].CodiVehiSali_m,
                            num_vuelta:results[i].NumeVuelSali_m,
                            control:results[i].DescCtrlSali_d,
                            fecha_sali_prog:getFecha_format(results[i].HoraSaliProgSali_m),
                            hora_sali:getHora(results[i].HoraProgSali_d),
                            hora_marc:getHora(results[i].HoraMarcSali_d),
                            falta:results[i].FaltSali_d,
                            penalidad:results[i].PenaCtrlSali_d
                        }
                    datos[i] = obj
                }
                conn.end()
                callback(null,datos)
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

let query_report_consilado_vueltas = (code,fechaI,fechaF,callback)=>
{

    objConn(code).then((resolve)=>
    {
        let conn = resolve

        var string_query = "select t1.CodiVehiSali_m,t1.idSali_m,t1.DescRutaSali_m,t1.NumeVuelSali_m,t1.HoraSaliProgSali_m," +
            "sum(t2.PenaCtrlSali_d) TotalPenalidad from salida_m t1 inner join salida_d t2 " +
            "on t1.idSali_m = t2.idSali_mSali_d where t1.HoraSaliProgSali_m " +
            "between '"+fechaI+" 05:00:00' and '"+fechaF+" 23:59:59' and t1.EstaSali_m <> 4 " +
            "and t2.isCtrlRefeSali_d = 0 and t2.PenaCtrlSali_d > 0\n" +
            "group by t1.idSali_m,t1.CodiVehiSali_m,t1.NumeVuelSali_m " +
            "order by t1.CodiVehiSali_m,t1.NumeVuelSali_m"
        conn.query(string_query,function(error,results,fields)
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
                            vuelta:results[i].NumeVuelSali_m,
                            ruta:results[i].DescRutaSali_m,
                            salida_h:getHora(results[i].HoraSaliProgSali_m),
                            valor:results[i].TotalPenalidad

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


/**query conteo_marcaciones_tabla**/

let query_unidades_conteo_marcaciones_tabla = (code,fecha,callback)=>
{

    objConn(code).then((resolve)=>
    {
        let conn = resolve

        var query_string = "SELECT CodiVehiSali_m,idSali_m,HoraSaliProgSali_m,conteo_control,t7.sin_marcar,LetraRutaSali_m,NumeVuelSali_m,DescRutaSali_m \n" +
            "FROM (SELECT t1.CodiVehiSali_m,t1.idSali_m,t1.HoraSaliProgSali_m,COUNT(t1.idSali_m) conteo_control,t5.sin_marcar,DescRutaSali_m " +
            ",LetraRutaSali_m,NumeVuelSali_m FROM salida_m t1\n" +
            "INNER JOIN salida_d t2 ON t1.idSali_m = t2.idSali_mSali_d AND t1.EstaSali_m <> 4\n" +
            "INNER JOIN vehiculo t6 ON t6.CodiVehi = t1.CodiVehiSali_m AND idEstaVehi = 1 and not (NumeSIMVehi is NULL)\n" +
            "INNER JOIN (SELECT idSali_m,COUNT(idSali_m) sin_marcar FROM salida_m t3 INNER JOIN salida_d t4\n" +
            "ON t3.idSali_m = t4.idSali_mSali_d\n" +
            "AND t3.EstaSali_m <> 4 WHERE t3.HoraSaliProgSali_m BETWEEN '"+fecha+" 05:00:00' AND '"+fecha+" 23:59:59'\n" +
            "AND ((t4.HoraMarcSali_d IS NULL) OR t4.HoraMarcSali_d = '1899-12-30 00:00:00')\n" +
            "GROUP BY t3.idSali_m ) t5 ON t5.idSali_m = t1.idSali_m\n" +
            "WHERE t1.HoraSaliProgSali_m BETWEEN '"+fecha+" 05:00:00' AND '"+fecha+" 23:59:59'\n" +
            "GROUP BY t1.CodiVehiSali_m,t1.idSali_m,t1.EstaSali_m,t5.sin_marcar) t7\n" +
            "WHERE (t7.conteo_control - t7.sin_marcar) > 0 order by CodiVehiSali_m"

        conn.query(query_string,function(error,results,fiels)
        {

            if(error)
            {
                callback(error,null)
            }else
            {
                let vector = []
                for(let i = 0;i<results.length;i++)
                {
                    var obj = {
                        vehiculo:results[i].CodiVehiSali_m,
                        salida:results[i].idSali_m,
                        hora:getHora(results[i].HoraSaliProgSali_m),
                        conteo_control:results[i].conteo_control,
                        sin_marcar:results[i].sin_marcar,
                        ruta:results[i].LetraRutaSali_m,
                        vuelta:results[i].NumeVuelSali_m,
                        fecha_hora:getFecha_format(results[i].HoraSaliProgSali_m),
                        detalle_ruta:results[i].DescRutaSali_m
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

let query_unidades_conteo_marcaciones_pdf = (code,salida,callback)=>
{

    objConn(code).then((resolve)=>
    {
        let conn = resolve

        var query_string = "select SD.CodiCtrlSali_d,SD.isCtrlRefeSali_d,SD.HoraProgSali_d,SD.HoraMarcSali_d," +
            "SD.FaltSali_d,SD.PenaCtrlSali_d from uambatena.salida_d as SD " +
            "where idSali_mSali_d = "+salida
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
                    var obj = {
                        relog:results[i].CodiCtrlSali_d,
                        hora_prog:getHora(results[i].HoraProgSali_d),
                        hora_marc:getHora(results[i].HoraMarcSali_d),
                        referencia:results[i].isCtrlRefeSali_d,
                        falta:results[i].FaltSali_d,
                        valor:results[i].PenaCtrlSali_d
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


/******************************** TARJETAS TRABAJADAS ********************************************/

let query_tarjetas_trabajadas_all = (code,fechaI,fechaF,callback)=>
{
    objConn(code).then((resolve)=>
    {
        let conn = resolve

        var query_string = "select t1.idSali_m,t1.HoraSaliProgSali_m,t1.CodiVehiSali_m,t1.LetraRutaSali_m,t2.DescFrec," +
            "t1.HoraSaliProgSali_m,t1.HoraLlegProgSali_m,t1.NumeVuelSali_m from salida_m t1 " +
            "inner join frecuencia t2 on t2.idFrec = t1.idFrecSali_m where " +
            "t1.HoraSaliProgSali_m between '"+fechaI+" 05:00:00' and '"+fechaF+" 23:59:59' and t1.EstaSali_m <> 4 " +
            "order by t1.CodiVehiSali_m,t1.HoraSaliProgSali_m"

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
                    var obj = {
                        salida:results[i].idSali_m,
                        fecha:getFecha_dd_mm_yyyy(results[i].HoraSaliProgSali_m),
                        hora_sali:getHora(results[i].HoraSaliProgSali_m),
                        vehiculo:results[i].CodiVehiSali_m,
                        ruta:results[i].LetraRutaSali_m,
                        detalle_ruta:results[i].DescFrec,
                        hora_lleg:getHora(results[i].HoraLlegProgSali_m),
                        num_vuelta:results[i].NumeVuelSali_m
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

let query_tarjetas_trabajadas_unidad = (code,unidad,fechaI,fechaF,callback)=>
{
    objConn(code).then((resolve)=>
    {
        let conn = resolve

        var query_string = "select t1.idSali_m,t1.HoraSaliProgSali_m,t1.CodiVehiSali_m,t1.LetraRutaSali_m,t2.DescFrec," +
            " t1.HoraSaliProgSali_m,t1.HoraLlegProgSali_m,t1.NumeVuelSali_m from salida_m t1" +
            " inner join frecuencia t2 on t2.idFrec = t1.idFrecSali_m where t1.HoraSaliProgSali_m" +
            " between  '"+fechaI+" 05:00:00' and '"+fechaF+" 23:59:59' and t1.EstaSali_m <> 4" +
            " and t1.CodiVehiSali_m = "+unidad+" order by t1.CodiVehiSali_m,t1.HoraSaliProgSali_m"

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
                    var obj = {
                        salida:results[i].idSali_m,
                        fecha:getFecha_dd_mm_yyyy(results[i].HoraSaliProgSali_m),
                        hora_sali:getHora(results[i].HoraSaliProgSali_m),
                        vehiculo:results[i].CodiVehiSali_m,
                        ruta:results[i].LetraRutaSali_m,
                        detalle_ruta:results[i].DescFrec,
                        hora_lleg:getHora(results[i].HoraLlegProgSali_m),
                        num_vuelta:results[i].NumeVuelSali_m
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


/******************************* CONSOLIDADO POR MINUTOS ***********************************************************/
let query_reporte_consolidado_por_minutos = (code,fecha,callback)=>
{
    objConn(code).then((resolve)=>
    {
        let conn = resolve

        var query_string = "select t5.CodiVehiSali_m,t5.FechaDia,t5.Vueltas,t5.idRuta_mSali_m,t5.DescRutaSali_m," +
            "t4.Faltas,t4.ValorPenalidad,(case when t6.idCobr is null then 0 else t6.idCobr end) ExisteCobro from " +
            "(select t2.CodiVehiSali_m,sum(t3.FaltSali_d) Faltas, ((t3.FaltSali_d * t7.PenaXDiaCtrlSecuCtrl)) " +
            "ValorPenalidad from salida_m t2 " +
            "inner join salida_d t3 on t2.idSali_m = t3.idSali_mSali_d inner join secuencia_control t7 " +
            "ON t2.idFrecSali_m = t7.idFrecSecuCtrl and t7.CodiCtrlSecuCtrl = t3.CodiCtrlSali_d " +
            "where t2.HoraSaliProgSali_m between '"+fecha+" 00:00:00' and '"+fecha+" 23:59:59' " +
            "and t3.isCtrlRefeSali_d = 0 and t3.FaltSali_d > 0 and t3.idMotiPenaCtrlDsctSali_d = 0 " +
            "and t2.EstaSali_m <> 4 group by t2.CodiVehiSali_m) t4 inner join " +
            "(select t1.CodiVehiSali_m,t1.idRuta_mSali_m,t1.DescRutaSali_m,date(t1.HoraSaliProgSali_m) " +
            "FechaDia,count(t1.idSali_m) Vueltas from salida_m t1 where t1.HoraSaliProgSali_m " +
            "between '"+fecha+" 00:00:00' and '"+fecha+" 23:59:59' and t1.EstaSali_m <> 4 " +
            "group by t1.CodiVehiSali_m) t5 on t5.CodiVehiSali_m = t4.CodiVehiSali_m " +
            "left join cobro_m t6 ON t6.FechCobr = date(t5.FechaDia) and t6.CodiVehiSali_m = t5.CodiVehiSali_m " +
            "order by convert(t5.CodiVehiSali_m, signed)"

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
                    var obj = {
                        vehiculo:results[i].CodiVehiSali_m,
                        fecha:getFecha_dd_mm_yyyy(results[i].FechaDia),
                        num_vuelta:results[i].Vueltas,
                        ruta:results[i].DescRutaSali_m,
                        minutos:results[i].Faltas,
                        valor:results[i].ValorPenalidad,
                        cobro:results[i].ExisteCobro
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

/****************************************** PENALIDAD POR SEGUNDOS  *************************************************/
let query_reporte_penalidad_segundo_all = (code,fechaI,fechaF,bandera,callback)=>
{
    objConn(code).then((resolve)=>
    {
        let conn = resolve

        var query_string = "select t1.idSali_m,t1.CodiVehiSali_m,t1.DescRutaSali_m,t1.NumeVuelSali_m," +
            "t1.HoraSaliProgSali_m,t2.CodiCtrlSali_d,t2.DescCtrlSali_d,t2.HoraProgSali_d," +
            "t2.HoraMarcSali_d from salida_m t1 inner join salida_d t2 on t1.idSali_m = t2.idSali_mSali_d " +
            "where t2.HoraMarcSali_d <> '1899-12-30 00:00:00' and t1.EstaSali_m <> 4 " +
            "and t2.isCtrlRefeSali_d = 0 and t1.HoraSaliProgSali_m " +
            "between '"+fechaI+" 05:00:00' and '"+fechaF+" 23:59:59' " +
            "order by t1.CodiVehiSali_m,t1.idSali_m,t1.HoraSaliProgSali_m,t2.HoraProgSali_d"

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


                    var obj = {
                        salida:results[i].idSali_m,
                        unidad:results[i].CodiVehiSali_m,
                        ruta:results[i].DescRutaSali_m,
                        vuelta:results[i].NumeVuelSali_m,
                        fecha_hora:getFecha_format(results[i].HoraSaliProgSali_m),
                        control:results[i].DescCtrlSali_d,
                        horaProg:getHora(results[i].HoraProgSali_d),
                        horaMarc:getHora(results[i].HoraMarcSali_d),
                        min:getMin_diferencia(results[i].HoraProgSali_d,results[i].HoraMarcSali_d),
                        seg:getSeg_diferencia(results[i].HoraProgSali_d,results[i].HoraMarcSali_d)
                    }

                    if(bandera==1)
                    {
                        if(obj.min!=null && obj.min!=null)
                        {
                            vector.push(obj)
                        }
                    }else
                    {
                        vector.push(obj)
                    }
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

let query_reporte_penalidad_segundo_unidad = (code,unidad,fechaI,fechaF,bandera,callback)=>
{

    objConn(code).then((resolve)=>
    {
        let conn = resolve

        var query_string = "select t1.idSali_m,t1.CodiVehiSali_m,t1.DescRutaSali_m,t1.NumeVuelSali_m," +
            "t1.HoraSaliProgSali_m,t2.CodiCtrlSali_d,t2.DescCtrlSali_d,t2.HoraProgSali_d," +
            "t2.HoraMarcSali_d from salida_m t1 inner join salida_d t2 " +
            "on t1.idSali_m = t2.idSali_mSali_d where t2.HoraMarcSali_d <> '1899-12-30 00:00:00' " +
            "and t1.EstaSali_m <> 4 and t2.isCtrlRefeSali_d = 0 and t1.CodiVehiSali_m = "+unidad+" " +
            "and t1.HoraSaliProgSali_m between '"+fechaI+" 05:00:00' and '"+fechaF+" 23:59:59' " +
            "order by t1.CodiVehiSali_m,t1.idSali_m,t1.HoraSaliProgSali_m,t2.HoraProgSali_d"

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

                    var obj = {
                        salida:results[i].idSali_m,
                        unidad:results[i].CodiVehiSali_m,
                        ruta:results[i].DescRutaSali_m,
                        vuelta:results[i].NumeVuelSali_m,
                        fecha_hora:getFecha_format(results[i].HoraSaliProgSali_m),
                        control:results[i].DescCtrlSali_d,
                        horaProg:getHora(results[i].HoraProgSali_d),
                        horaMarc:getHora(results[i].HoraMarcSali_d),
                        min:getMin_diferencia(results[i].HoraProgSali_d,results[i].HoraMarcSali_d),
                        seg:getSeg_diferencia(results[i].HoraProgSali_d,results[i].HoraMarcSali_d)
                    }

                    if(obj!=null)
                    {
                        if(bandera==1)
                        {
                            if(obj.min!=null && obj.seg!=null)
                            {
                                vector.push(obj)
                            }
                        }else
                        {
                            if(obj.min==null || obj.seg==null)
                            {
                                obj.min = null
                                obj.seg = null
                            }

                            vector.push(obj)
                        }
                    }
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

/********************************** TARJETAS CONTROLES ***********************************************/

let query_tarjetas_controles_sp = (code,fechaI,fechaF,unidad,callback)=>
{

    objConn(code).then((resolve)=>
    {
        let conn = resolve
        var query_string = ""
        if(unidad == "*"){
            query_string = "select t1.idSali_m,t1.CodiVehiSali_m,t1.DescRutaSali_m,t1.NumeVuelSali_m," +
                "t1.HoraSaliProgSali_m,t2.CodiCtrlSali_d,t2.DescCtrlSali_d,t2.HoraProgSali_d," +
                "t2.HoraMarcSali_d,t2.FaltSali_d,t2.PenaXDiaCtrlSali_d,t2.isCtrlRefeSali_d," +
                "t2.PenaCtrlSali_d from salida_m t1 inner join salida_d t2 on t1.idSali_m = t2.idSali_mSali_d " +
                "inner join registro_control t3 on t2.CodiCtrlSali_d = t3.CodiCtrl where t1.EstaSali_m <> 4 " +
                "and t2.FaltSali_d > 0 and t1.HoraSaliProgSali_m between '"+fechaI+" 05:00:00' " +
                "and '"+fechaF+" 23:59:59' order by t1.CodiVehiSali_m,t1.idSali_m," +
                "t1.HoraSaliProgSali_m,t2.HoraProgSali_d"
        }else{
            query_string = "select t1.idSali_m,t1.CodiVehiSali_m,t1.DescRutaSali_m,t1.NumeVuelSali_m," +
                "t1.HoraSaliProgSali_m,t2.CodiCtrlSali_d,t2.DescCtrlSali_d,t2.HoraProgSali_d," +
                "t2.HoraMarcSali_d,t2.FaltSali_d,t2.PenaXDiaCtrlSali_d,t2.isCtrlRefeSali_d," +
                "t2.PenaCtrlSali_d from salida_m t1 inner join salida_d t2 on " +
                "t1.idSali_m = t2.idSali_mSali_d inner join registro_control t3 on " +
                "t2.CodiCtrlSali_d = t3.CodiCtrl where t1.EstaSali_m <> 4 and t2.FaltSali_d > 0 " +
                "and t1.HoraSaliProgSali_m between '"+fechaI+" 05:00:00' and '"+fechaF+" 23:59:59' " +
                "and t1.CodiVehiSali_m = '"+unidad+"' order by t1.CodiVehiSali_m, " +
                "t1.idSali_m,t1.HoraSaliProgSali_m,t2.HoraProgSali_d"
        }

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
                    var obj = {
                        salida:results[i].idSali_m,
                        vehiculo:results[i].CodiVehiSali_m,
                        ruta_detalle:results[i].DescRutaSali_m,
                        num_vuelta:results[i].NumeVuelSali_m,
                        horaSali:getFecha_dd_mm_yyyy(results[i].HoraSaliProgSali_m),
                        code_control:results[i].CodiCtrlSali_d,
                        control_detalle:results[i].DescCtrlSali_d,
                        hora_prog_sali:getHora(results[i].HoraProgSali_d),
                        hora_marc_sali: results[i].HoraMarcSali_d != null ? getHora(results[i].HoraMarcSali_d) : "S/N",
                        falta:results[i].FaltSali_d,
                        pena_x_dia:results[i].PenaXDiaCtrlSali_d,
                        referencia:results[i].isCtrlRefeSali_d,
                        penalidad:results[i].PenaCtrlSali_d
                    }
                    vector.push(obj)
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


let query_tarjetas_controles_all = (code,fechaI,fechaF,unidad,callback)=>{
    objConn(code).then((resolve)=>
    {
        let conn = resolve
        var query_string = ""
        if(unidad == "*"){
            query_string = "select t1.idSali_m,t1.CodiVehiSali_m,t1.DescRutaSali_m,t1.NumeVuelSali_m,t1.HoraSaliProgSali_m," +
                "t2.CodiCtrlSali_d,t2.DescCtrlSali_d,t2.HoraProgSali_d,t2.HoraMarcSali_d,t2.FaltSali_d," +
                "t2.PenaXDiaCtrlSali_d,t2.isCtrlRefeSali_d,t2.PenaCtrlSali_d  from salida_m t1 inner join " +
                "salida_d t2 on t1.idSali_m = t2.idSali_mSali_d inner join registro_control t3 on " +
                "t2.CodiCtrlSali_d = t3.CodiCtrl where t1.EstaSali_m <> 4 and t1.HoraSaliProgSali_m " +
                "between '"+fechaI+" 05:00:00' and '"+fechaF+" 23:59:59' order by t1.CodiVehiSali_m,t1.idSali_m," +
                "t1.HoraSaliProgSali_m,t2.HoraProgSali_d"
        }else{
            query_string = "select t1.idSali_m,t1.CodiVehiSali_m,t1.DescRutaSali_m,t1.NumeVuelSali_m,t1.HoraSaliProgSali_m," +
                "t2.CodiCtrlSali_d,t2.DescCtrlSali_d,t2.HoraProgSali_d,t2.HoraMarcSali_d,t2.FaltSali_d," +
                "t2.PenaXDiaCtrlSali_d,t2.isCtrlRefeSali_d,t2.PenaCtrlSali_d  from salida_m t1 inner join " +
                "salida_d t2 on t1.idSali_m = t2.idSali_mSali_d inner join registro_control t3 on " +
                "t2.CodiCtrlSali_d = t3.CodiCtrl where t1.EstaSali_m <> 4 and t1.HoraSaliProgSali_m " +
                "between '"+fechaI+" 05:00:00' and '"+fechaF+" 23:59:59' and " +
                "t1.CodiVehiSali_m = '"+unidad+"' order by " +
                "t1.CodiVehiSali_m,t1.idSali_m,t1.HoraSaliProgSali_m,t2.HoraProgSali_d"
        }
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
                    var obj = {
                        salida:results[i].idSali_m,
                        vehiculo:results[i].CodiVehiSali_m,
                        ruta_detalle:results[i].DescRutaSali_m,
                        num_vuelta:results[i].NumeVuelSali_m,
                        horaSali:getFecha_dd_mm_yyyy(results[i].HoraSaliProgSali_m),
                        code_control:results[i].CodiCtrlSali_d,
                        control_detalle:results[i].DescCtrlSali_d,
                        hora_prog_sali:getHora(results[i].HoraProgSali_d),
                        hora_marc_sali: results[i].HoraMarcSali_d != null ? getHora(results[i].HoraMarcSali_d) : "S/N",
                        falta:results[i].FaltSali_d,
                        pena_x_dia:results[i].PenaXDiaCtrlSali_d,
                        referencia:results[i].isCtrlRefeSali_d,
                        penalidad:results[i].PenaCtrlSali_d
                    }
                    vector.push(obj)
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


/*********************************** IMPRIMIR RECIBO **********************************************/

let query_imprimir_recibo = (code,unidad,callback)=>
{
    objConn(code).then((resolve)=>
    {
        let conn = resolve
        var query_string = ""

        if(unidad == "*"){
            query_string = "select t1.NumeDocuCobr,t1.CodiVehiSali_m,t1.FechCobr,t1.FechPago," +
                "t1.ValoCobr,t2.NombApellUsua from cobro_m t1 inner join usuarios t2 " +
                "on t1.CodiUsuaCobr = t2.CodiUsua"
        }else{
            query_string = "select t1.NumeDocuCobr,t1.CodiVehiSali_m,t1.FechCobr,t1.FechPago," +
                "t1.ValoCobr,t2.NombApellUsua from cobro_m t1 inner join usuarios t2 on " +
                "t1.CodiUsuaCobr = t2.CodiUsua where CodiVehiSali_m = '"+unidad+"'"
        }

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
                    var obj = {
                        recibo:results[i].NumeDocuCobr,
                        vehiculo:results[i].CodiVehiSali_m,
                        fecha_cobro:results[i].FechCobr,
                        fecha_pago:results[i].FechPago,
                        cobro:results[i].ValoCobr,
                        user:results[i].NombApellUsua
                    }
                    vector.push(obj)
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



/************************************* TARJETA DETALLADA ********************************************/

let query_report_tarjeta_detallada = (code,fechaI,fechaF,callback)=>
{
    objConn(code).then((resolve)=>
    {
        let conn = resolve

        var script_query = "select t1.CodiVehiTarj,t1.FechCreaTarj,t1.NumeReciTarj,cast(t1.FechPAgoTarj AS CHAR) " +
            "FechPAgoTarj,t1.PrecTarj,t3.descripcion,t1.EstaTarj from tarjeta_dm t1 inner join vehiculo t2 on " +
            "t2.CodiVehi = t1.CodiVehiTarj left join vehiculo_grupo t3 on t3.id = t2.grupo_id where " +
            "t1.FechCreaTarj between '"+fechaI+"' and '"+fechaF+"' order by t3.descripcion," +
            "t1.CodiVehiTarj,t1.FechCreaTarj"

        conn.query(script_query,function(error,results,fields)
        {
            if(error)
            {
                callback(error,null)
            }else{
                let datos = []
                for(var i=0;i<results.length;i++)
                {
                    var obj = {
                        vehiculo:results[i].CodiVehiTarj,
                        fecha_creacion_tarjeta:results[i].FechCreaTarj == null ? "S/N" : getFecha_dd_mm_yyyy(results[i].FechCreaTarj),
                        NumRecivo:results[i].NumeReciTarj == null ? "S/N" : results[i].NumeReciTarj,
                        FechaPagoTarj:results[i].FechPAgoTarj == null ? "S/N" : getFecha_dd_mm_yyyy(results[i].FechPAgoTarj),
                        PrecioTarj:parseFloat(results[i].PrecTarj).toFixed(2),
                        Descrip:results[i].descripcion,
                        EstaTarj:results[i].EstaTarj

                    }

                    datos.push(obj)
                }

                callback(null,datos)
            }
        })


    }).catch(()=>{
        callback({
            sqlMessage:'Error en query Conn Dinamica'
        },null)
        console.log('Error CONN BD')
    })
}


/************************************* TARJETA Consolidada ********************************************/

let query_report_tarjeta_consolidada = (code,fechaI,fechaF,callback)=>
{
    objConn(code).then((resolve)=>
    {
        let conn = resolve

        var script_query = "select t3.descripcion,t2.CodiVehi,count(t2.CodiVehi) numero," +
            "sum(t1.PrecTarj) total,'Pendiente' concepto from tarjeta_dm t1 inner join vehiculo " +
            "t2 on t2.CodiVehi = t1.CodiVehiTarj left join vehiculo_grupo t3 on " +
            "t3.id = t2.grupo_id where t1.EstaTarj = 1 and t1.FechCreaTarj " +
            "between '"+fechaI+"' and '"+fechaF+"' group by t3.descripcion," +
            "t2.CodiVehi order by t3.descripcion,t2.CodiVehi"


        conn.query(script_query,function(error,results,fields)
        {
            if(error)
            {
                callback(error,null)
            }else{
                let datos = []
                for(var i=0;i<results.length;i++)
                {
                    var obj = {
                        descrip:results[i].descripcion,
                        vehiculo:results[i].CodiVehi,
                        numero:results[i].numero,
                        total:parseFloat(results[i].total).toFixed(2),
                        concepto:results[i].concepto
                    }

                    datos.push(obj)
                }

                callback(null,datos)
            }
        })


    }).catch(()=>{
        callback({
            sqlMessage:'Error en query Conn Dinamica'
        },null)
       // console.log('Error CONN BD')
    })
}






module.exports = {query_salidas_unidad_fechas_horas
    ,query_tarjeta_salida_d,query_recorrido_bus,query_report_ant
    ,query_report_tarjeta_unidad_all_sp,query_report_tarjeta_unidad_all_cp
    ,query_report_tarjeta_unidad_sp,query_report_tarjeta_unidad_cp
    ,query_report_consilado_vueltas,query_unidades_conteo_marcaciones_tabla,
    query_unidades_conteo_marcaciones_pdf,query_tarjetas_trabajadas_all
    ,query_tarjetas_trabajadas_unidad,query_reporte_consolidado_por_minutos,
    query_reporte_penalidad_segundo_all,query_reporte_penalidad_segundo_unidad,
    query_tarjetas_controles_sp,query_tarjetas_controles_all,
    query_imprimir_recibo,query_report_tarjeta_detallada,query_report_tarjeta_consolidada}

