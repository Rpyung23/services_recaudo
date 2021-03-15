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
        conn.query("SELECT * from observador_vehiculo",function (error,results,fiels)
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
                                id_unidad:results[i].CodiVehiObseVehi,
                                id_observador:results[i].CodiObseObseVehi
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
    var string_query = "select CodiCtrlSali_d,HoraProgSali_d,HoraMarcSali_d,DescCtrlSali_d,FaltSali_d from uambatena.salida_d where idSali_mSali_d = "+id_salida_m
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


module.exports = {query_all_unidades,query_salidas_unidad_fechas,query_tarjeta_salida_d,query_recorrido_bus}

