/***************** GLOBAL **********************************/
let mysql = require("mysql")
//let {objConn} = require("../mysql/config")
let {getFecha_format,getHora} = require("../utils/utils")

let objConn =
    {
        host:"71.6.142.111",
        user:"root",
        password:"Vigitrack102030*",
        database:"uambatena",
        port:3306
    }

let conn = mysql.createConnection(objConn)

conn.connect(function(error)
{
    if(error) throw error;
    console.log("CONNECTED AS ID "+conn.threadId)
});
let query_all_rutas_global = (callback)=>
{
    var string_query = "select R.idRuta,R.DescRuta,R.LetrRuta from ruta as R where R.ActiRuta = 1";
    conn.query(string_query,function(error,results,fields)
    {
        if(error)
        {
            callback(error,null)
        }else
            {
                let datos = []

                for(let i = 0;i<results.length;i++)
                {
                    var obj = {
                        ruta:results[i].idRuta,
                        detalle:results[i].DescRuta,
                        letra:results[i].LetrRuta
                    }

                    datos[i] = obj
                }

                callback(null,datos)
            }
    })
}

let query_all_unidades = (code,callback) =>
{
    //let conn = objConn(code)
    if(conn!=null)
    {
        conn.query("SELECT * from vehiculo as V where V.idEstaVehi = 1 and NumeSIMVehi is not null",function (error,results,fiels)
        {
            if(error)
            {
                var err = error
                conn.end()
                callback(err,null)
            }else
            {

                let datos_unidades =[];

                for(let i =0;i<results.length;i++)
                {
                    var objUnidades =
                        {
                            id_unidad:results[i].CodiVehi,
                            placa:results[i].PlacVehi
                        }

                    datos_unidades[i]=objUnidades;
                }

                conn.end()
                callback(null,datos_unidades)
            }


        })
    }else
    {
        console.log(reject)
    }
}

let query_salidas_unidad_fechas_global = (id_bus,fechaI,fechaF,callback)=>
{
    let string_query = "select idSali_m,NumeTarjSali_m,HoraLlegProgSali_m,HoraSaliProgSali_m,DescRutaSali_m,NumeVuelSali_m from salida_m where CodiVehiSali_m = '"+id_bus+"' AND HoraLLegProgSali_m  between '"+fechaI+" 05:00:00' and '"+fechaF+" 23:59:59'"
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

let query_salidas_fechas_global = (fechaI,fechaF,callback)=>
{
    let string_query = "select idSali_m,NumeTarjSali_m,HoraLlegProgSali_m,HoraSaliProgSali_m,DescRutaSali_m,NumeVuelSali_m,VeloMaxiSali_m from salida_m where  HoraLLegProgSali_m  between '"+fechaI+" 05:00:00' and '"+fechaF+" 23:59:59'"
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
            callback(null,datos_salidas)
        }
    });
}

module.exports = {query_all_unidades,query_salidas_unidad_fechas_global,query_salidas_fechas_global
    ,query_all_rutas_global}