let mysql = require("mysql")
let {getFecha_format} = require("../utils/utils")


let objConn =
    {
        host:"71.6.142.111",
        user:"root",
        password:"Vigitrack102030*",
        database:"uambatena",
    }

let conn = mysql.createConnection(objConn)

conn.connect();/**CONECTO**/

let query_all_unidades = (callback) =>
    {
        conn.query("SELECT * from vehivulo as V where V.idEstaVehi = 1 and NumeSIMVehi is not null",function (error,results,fiels)
        {
            if(error)
            {
                callback(error,null)
            }else
                {

                    let datos_unidades =[];

                    for(let i =0;i<results.length;i++)
                    {
                        var objUnidades =
                            {
                                id_unidad:results[i].CodiVehi,
                                id_observador:results[i].PlacVehi
                            }

                        datos_unidades[i]=objUnidades;
                    }


                    callback(null,datos_unidades)
                }


        })
    }

let query_salidas_unidad_fechas = (id_bus,fecha,horaI,horaF,callback)=>
{
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
                           num_vuelta:results[i].NumeVuelSali_m

                       }

                   datos_salidas[i] =  obj
               }
               callback(null,datos_salidas)
           }
    });
}

function getHora(fecha)
{
    var horas = new Date(fecha);
    return (horas.getUTCHours() +":"+horas.getUTCMinutes()+":"+horas.getUTCSeconds())
}

let query_tarjeta_salida_d = (id_salida_m,callback)=>
{
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

                callback(null,tarjeta)
            }
    })
}


let query_recorrido_bus = (id_bus,fecha,horaI,horaF,callback)=>
{
    var string_query = "select CodiVehiHistEven,FechHistEven,LatiHistEven,LongHistEven,RumbHistEven,VeloHistEven " +
        "from historial_eventos where FechHistEven between '"+fecha+" "+horaI+"' and '"+fecha+" "+horaF+"' and CodiVehiHistEven = '"+id_bus+"'"
    conn.query(string_query,function(error,results,fields)
    {
        if(error)
        {
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
                callback(null,recorridos)
            }
    });
}

let query_report_ant = (fecha_ini,fecha_fin,callback)=>
{
    var string_query = "select SM.CodiVehiSali_m,V.PlacVehi,OB.AliaObse,OBV.CodiObseObseVehi,SM.HoraLlegProgSali_m," +
        "SM.HoraSaliProgSali_m,SM.DescRutaSali_m,SM.NumeVuelSali_m,SM.MontInfrUnidSali_m,VeloMaxiSali_m " +
        "from salida_m as SM JOIN observador_vehiculo as OBV on " +
        "SM.CodiVehiSali_m = OBV.CodiVehiObseVehi LEFT JOIN observador as OB on " +
        "OB.CodiObse = OBV.CodiObseObseVehi LEFT join vehiculo as V on " +
        "V.CodiVehi = SM.CodiVehiSali_m and V.idEstaVehi = 1 and NumeSIMVehi is not null " +
        "where HoraLLegProgSali_m between '"+fecha_ini+"' and '"+fecha_fin+"' order by CodiVehiSali_m"

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
                            ced:null,
                            hora_lleg :getFecha_format(results[i].HoraLlegProgSali_m),
                            hora_sali :getFecha_format(results[i].HoraSaliProgSali_m),
                            ruta :results[i].DescRutaSali_m,
                            monto :results[i].MontInfrUnidSali_m,
                            vuelta:results[i].NumeVuelSali_m,
                            velo :results[i].VeloMaxiSali_m
                        }
                    vector[i] = obj
                }
                callback(null,vector);
            }
    })
}


let query_report_tarjeta_unidad_all_sp = (fechaIni,fechaFin,callback)=>
{
    string_query = "select SM.idSali_m,SM.DescRutaSali_m,SM.CodiVehiSali_m ,SM.NumeVuelSali_m," +
        "SM.HoraSaliProgSali_m ,SD.DescCtrlSali_d ,SD.HoraProgSali_d,SD.HoraMarcSali_d," +
        "SD.FaltSali_d,SD.PenaCtrlSali_d from salida_m as SM left join " +
        "salida_d as SD on SM.idSali_m=SD.idSali_mSali_d where " +
        "SM.HoraLLegProgSali_m between '"+fechaIni+"' and '"+fechaFin+"' " +
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
                callback(null,datos)
            }
    })
}

let query_report_tarjeta_unidad_all_cp = (fechaIni,fechaFin,callback)=>
{
    string_query = "select SM.idSali_m,SM.DescRutaSali_m,SM.CodiVehiSali_m,SM.NumeVuelSali_m," +
        "SM.HoraSaliProgSali_m ,SD.DescCtrlSali_d,SD.HoraProgSali_d,SD.HoraMarcSali_d," +
        "SD.FaltSali_d,SD.PenaCtrlSali_d from salida_m as SM " +
        "left join salida_d as SD on SM.idSali_m=SD.idSali_mSali_d where SM.HoraLLegProgSali_m " +
        "between '"+fechaIni+"' and '"+fechaFin+"' and SM.EstaSali_m <>4 and SD.FaltSali_d>0 " +
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
            callback(null,datos)
        }
    })
}


let query_report_tarjeta_unidad_sp = (unidad,fechaIni,fechaFin,callback)=>
{
    string_query = "select SM.idSali_m,SM.DescRutaSali_m,SM.CodiVehiSali_m ,SM.NumeVuelSali_m," +
        "SM.HoraSaliProgSali_m ,SD.DescCtrlSali_d,SD.HoraProgSali_d,SD.HoraMarcSali_d," +
        "SD.FaltSali_d,SD.PenaCtrlSali_d from salida_m as SM left join salida_d " +
        "as SD on SM.idSali_m=SD.idSali_mSali_d where  SM.CodiVehiSali_m = "+unidad+" " +
        "and SM.HoraLLegProgSali_m between '"+fechaIni+"' and '"+fechaFin+"' and " +
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
            callback(null,datos)
        }
    })
}

let query_report_tarjeta_unidad_cp = (unidad,fechaIni,fechaFin,callback)=>
{
    string_query = "select SM.idSali_m,SM.DescRutaSali_m,SM.CodiVehiSali_m ,SM.NumeVuelSali_m," +
        "SM.HoraSaliProgSali_m ,SD.DescCtrlSali_d,SD.HoraProgSali_d,SD.HoraMarcSali_d," +
        "SD.FaltSali_d,SD.PenaCtrlSali_d from salida_m as SM left join salida_d " +
        "as SD on SM.idSali_m=SD.idSali_mSali_d where  SM.CodiVehiSali_m = "+unidad+" " +
        "and SM.HoraLLegProgSali_m between '"+fechaIni+"' and '"+fechaFin+"' and " +
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
            callback(null,datos)
        }
    })
}

//let query_report_consilado_vueltas =

module.exports = {query_all_unidades,query_salidas_unidad_fechas
    ,query_tarjeta_salida_d,query_recorrido_bus,query_report_ant
    ,query_report_tarjeta_unidad_all_sp,query_report_tarjeta_unidad_all_cp
    ,query_report_tarjeta_unidad_sp,query_report_tarjeta_unidad_cp}

