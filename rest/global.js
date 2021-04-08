/**API REST QUE SE REPITEN **/

let {verify_token} = require("../jwt/jwt")
let express = require("express")
let app_express = express()


let {query_all_unidades,query_salidas_unidad_fechas_global,
    query_salidas_fechas_global,query_all_rutas_global,
    query_velocidad_maxima_global} = require("../mysql/query_global")

/**Metodo get**/

/** Obtiene todas las unidades **/
app_express.get("/unidades/:token",function (req,res)
{

    var obj = {
        token:req.params.token
    }

    verify_token(obj.token,(bandera,codigo_msm)=>{
        if(bandera == 0){

            res.status(200).json({
                status_code:500,
                datos:codigo_msm
            })

        }else{
            query_all_unidades( codigo_msm,(error,datos)=>
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
        }
    })




})

app_express.get("/salidas_unidad_unidad/:code/:unidad/:fechaI/:fechaF",function(req,res)
{
    var objReq =
        {
            codigo:req.params.code,
            id_bus:req.params.unidad,
            fechaI:req.params.fechaI,
            fechaF:req.params.fechaF
        }
    //console.log(objReq)
    query_salidas_unidad_fechas_global(objReq.codigo,objReq.id_bus,objReq.fechaI,objReq.fechaF,(error,datos)=>
    {
        if(error)
        {
            res.status(200).json(
                {
                    status_code:400,
                    datos:error.sqlMessage
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

app_express.get("/salidas_unidad_all/:code/:fechaI/:fechaF",function(req,res)
{
    var objReq =
        {
            codigo:req.params.code,
            fechaI:req.params.fechaI,
            fechaF:req.params.fechaF
        }
    //console.log(objReq)
    query_salidas_fechas_global(objReq.codigo,objReq.fechaI,objReq.fechaF,(error,datos)=>
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


app_express.get("/rutas/:codigo",function(req,res)
{
    query_all_rutas_global(req.params.codigo,(error,datos)=>
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


app_express.get("/velocidad/:codigo",function(req,res)
{
    var code = req.params.codigo

    query_velocidad_maxima_global(code,(error,datos)=>
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