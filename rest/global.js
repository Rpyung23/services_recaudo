/**API REST QUE SE REPITEN **/

let {verify_token} = require("../jwt/jwt")
let express = require("express")
let app_express = express()


let {query_all_unidades,query_salidas_unidad_fechas_global,
    query_salidas_fechas_global,query_all_rutas_global,
    query_velocidad_maxima_global} = require("../mysql/query_global")

/**Metodo get**/

/** Obtiene todas las unidades **/
app_express.post("/unidades",function (req,res)
{

    var obj = {
        token:req.body.token
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

app_express.post("/salidas_unidad_unidad/:unidad/:fechaI/:fechaF",function(req,res)
{
    var objReq =
        {
            token:req.body.token,
            id_bus:req.params.unidad,
            fechaI:req.params.fechaI,
            fechaF:req.params.fechaF
        }
    //console.log(objReq)



    verify_token(objReq.token,(bandera,codigo_msm)=>{
        if(bandera == 0){

            res.status(200).json({
                status_code:500,
                datos:codigo_msm
            })

        }else{
            query_salidas_unidad_fechas_global(codigo_msm,objReq.id_bus,objReq.fechaI,objReq.fechaF,(error,datos)=>
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
        }
    })


})

app_express.post("/salidas_unidad_all/:fechaI/:fechaF",function(req,res)
{
    var objReq =
        {
            codigo:req.body.token,
            fechaI:req.params.fechaI,
            fechaF:req.params.fechaF
        }

    verify_token(objReq.codigo,(bandera,codigo_msm)=>{
        if(bandera == 0){

            res.status(200).json({
                status_code:500,
                datos:codigo_msm
            })

        }else{
            query_salidas_fechas_global(codigo_msm,objReq.fechaI,objReq.fechaF,(error,datos)=>
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
        }
    })

})


app_express.post("/rutas",function(req,res)
{

    var objReq =
        {
            token:req.body.token,
        }

    verify_token(objReq.token,(bandera,codigo_msm)=>{
        if(bandera == 0){

            res.status(200).json({
                status_code:500,
                datos:codigo_msm
            })

        }else{
            query_all_rutas_global(codigo_msm,(error,datos)=>
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
        }
    })


})


app_express.post("/velocidad",function(req,res)
{
    var objReq =
        {
            token:req.body.token,
        }

    verify_token(objReq.token,(bandera,codigo_msm)=>{
        if(bandera == 0){

            res.status(200).json({
                status_code:500,
                datos:codigo_msm
            })

        }else{
            query_velocidad_maxima_global(codigo_msm,(error,datos)=>
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
        }
    })


})

module.exports = app_express