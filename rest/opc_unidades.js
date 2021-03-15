let express = require("express")
let app_express = express()

let {query_all_unidades,query_salidas_unidad_fechas,query_tarjeta_salida_d,query_recorrido_bus} = require("../mysql/querys.js")

/**Metodo get**/

/** Obtiene todas las unidades **/
app_express.get("/unidades",function (req,res)
{

    query_all_unidades( (error,datos)=>
    {
        if(error)
        {
            res.status(200).json({
                status_code:400,
                datos:error
            })
        }else
            {
                res.status(200).json({
                    status_code:200,
                    datos:datos
                })
            }
    })



})

app_express.get("/salidas",function(req,res)
{
    var objReq =
        {
            id_bus:req.body.id_bus,
            fecha:req.body.fecha,
            horaI:req.body.horaI,
            horaF:req.body.horaF
        }
    //console.log(objReq)
    query_salidas_unidad_fechas(objReq.id_bus,objReq.fecha,objReq.horaI,objReq.horaF,(error,datos)=>
    {
        if(error)
        {
            res.status(200).json(
                {
                    status:400,
                    datos:null
                })
        }else if(datos.length<=0)
        {
            res.status(200).json(
                {
                    status:300,
                    datos:null
                })
        }else
            {
                res.status(200).json(
                    {
                        status:300,
                        datos:datos
                    })
            }
    })
})

app_express.get('/tarjeta',function(req,res)
{
    query_tarjeta_salida_d(req.body.id_salida,(error,datos)=>
    {
        if(error)
        {
            res.status(200).json(
                {
                    status_code:400,
                    datos:null
                })
        }else if(datos.length<=0)
        {
            res.status(200).json(
                {
                    status_code:300,
                    datos:null
                })
        }else
            {
                res.status(200).json(
                    {
                        status_code:200,
                        datos:datos
                    })
            }
    })
})

app_express.get('/recorrido',function(req,res)
{
    query_recorrido_bus(12,'2021-03-12','05:00','23:59',(error,datos)=>
    {
        if(error)
        {
            res.status(200).json(
                {
                    status_code:400,
                    datos:null
                })
        }else if(datos.length<=0)
        {
            res.status(300).json(
                {
                    status_code:200,
                    datos:null
                })
        }else
            {
                res.status(200).json(
                    {
                        status_code:200,
                        datos:datos
                    })
            }
    })
})
module.exports = app_express