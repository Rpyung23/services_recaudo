/**API REST QUE SE REPITEN **/


let express = require("express")
let app_express = express()

let {query_all_unidades,query_salidas_unidad_fechas_global,
    query_salidas_fechas_global,query_all_rutas_global} = require("../mysql/query_global")

/**Metodo get**/

/** Obtiene todas las unidades **/
app_express.get("/unidades/:codigo",function (req,res)
{

    query_all_unidades( req.params.codigo,(error,datos)=>
    {
        if(error)
        {
            res.status(200).json({
                status_code:400,
                datos:error.sqlMessage
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

app_express.get("/salidas_unidad/:unidad/:fechaI/:fechaF",function(req,res)
{
    var objReq =
        {
            id_bus:req.params.id_bus,
            fechaI:req.params.fecha,
            fechaF:req.params.horaI
        }
    //console.log(objReq)
    query_salidas_unidad_fechas_global(objReq.id_bus,objReq.fechaI,objReq.fechaF,(error,datos)=>
    {
        if(error)
        {
            res.status(200).json(
                {
                    status:400,
                    datos:error.sqlMessage
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

app_express.get("/salidas_unidad_all/:fechaI/:fechaF",function(req,res)
{
    var objReq =
        {
            fechaI:req.params.fecha,
            fechaF:req.params.horaI
        }
    //console.log(objReq)
    query_salidas_fechas_global(objReq.fechaI,objReq.fechaF,(error,datos)=>
    {
        if(error)
        {
            res.status(200).json(
                {
                    status:400,
                    datos:error.sqlMessage
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


app_express.get("/rutas",function(req,res)
{
    query_all_rutas_global((error,datos)=>
    {
        if(error)
        {
            res.status(200).json({
                status_code:400,
                datos:error.sqlMessage
            })
        }else if(datos.length<=0)
            {
                res.status(200).json({
                    status_code:300,
                    datos:null
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


module.exports = app_express