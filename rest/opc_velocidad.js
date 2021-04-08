let express = require("express")
let app_express = express()

let {query_velocidad_historial,query_velocidad_general
    ,query_velocidad_total_all,query_velocidad_total_unidad} = require("../mysql/query_velocidad")


app_express.get("/velocidad_historial/:code/:tarjeta/:velocidad/:fecha/:unidad",function(req,res) {
    //code,tarjeta,velocidad,fecha,unidad,callback

    var obj =
        {
            code:req.params.code,
            tarjeta:req.params.tarjeta,
            velocidad:req.params.velocidad,
            fecha:req.params.fecha,
            unidad:req.params.unidad
        }
    query_velocidad_historial(obj.code,obj.tarjeta,obj.velocidad,obj.fecha,obj.unidad,(error,datos)=>
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

app_express.get("/velocidad_general/:code/:velocidad/:fecha",function(req,res)
    {
    //code,velocidad,fecha

    var obj =
        {
            code:req.params.code,
            velocidad:req.params.velocidad,
            fecha:req.params.fecha
        }
    query_velocidad_general(obj.code,obj.velocidad,obj.fecha,(error,datos)=>
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

app_express.get("/velocidad_total_all/:code/:velocidad/:fechaI/:fechaF",function(req,res)
{
    //code,fechaI,fechaF,velocidad

    var obj =
        {
            code:req.params.code,
            velocidad:req.params.velocidad,
            fechaI:req.params.fechaI,
            fechaF:req.params.fechaF
        }
    query_velocidad_total_all(obj.code,obj.fechaI,obj.fechaF,obj.velocidad,(error,datos)=>
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

app_express.get("/velocidad_total_unidad/:code/:unidad/:velocidad/:fechaI/:fechaF",function(req,res)
{
    //code,unidad,fechaI,fechaF,velocidad

    var obj =
        {
            code:req.params.code,
            velocidad:req.params.velocidad,
            unidad:req.params.unidad,
            fechaI:req.params.fechaI,
            fechaF:req.params.fechaF
        }

    query_velocidad_total_unidad(obj.code,obj.unidad,obj.fechaI,obj.fechaF,obj.velocidad,(error,datos)=>
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