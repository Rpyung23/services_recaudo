let express = require("express")
let app_express = express();
let {query_report_ant,query_report_tarjeta_unidad_all_sp,query_report_tarjeta_unidad_all_cp
    ,query_report_tarjeta_unidad_sp,query_report_tarjeta_unidad_cp} = require("../mysql/querys")
app_express.get("/ant/:fechainicio/:fechafin",function(req,res)
{

    var fi = req.params.fechainicio

    var ff = req.params.fechafin
    query_report_ant(fi, ff,(error,datos)=>
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
                            })}
        }
        )
})

app_express.get("/tarjeta_unidad_all_sp/:fechainicio/:fechafin",function(req,res)
{
    var fechaI = req.params.fechainicio;
    var fechaF= req.params.fechafin;

    query_report_tarjeta_unidad_all_sp(fechaI,fechaF,(error,datos)=>
    {
        if(error)
        {
            res.status(200).json(
                {
                    status_code:400,
                    datos:null
                })
        }else if(datos.length <= 0)
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

app_express.get("/tarjeta_unidad_all_cp/:fechainicio/:fechafin",function(req,res)
{
    var fechaI = req.params.fechainicio;
    var fechaF= req.params.fechafin;

    query_report_tarjeta_unidad_all_cp(fechaI,fechaF,(error,datos)=>
    {
        if(error)
        {
            res.status(200).json(
                {
                    status_code:400,
                    datos:null
                })
        }else if(datos.length <= 0)
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


app_express.get("/tarjeta_unidad_unidad_sp/:unidad/:fechainicio/:fechafin",function(req,res)
{
    var unidad = req.params.unidad
    var fechaI = req.params.fechainicio;
    var fechaF= req.params.fechafin;

    query_report_tarjeta_unidad_sp(unidad,fechaI,fechaF,(error,datos)=>
    {
        if(error)
        {
            res.status(200).json(
                {
                    status_code:400,
                    datos:null
                })
        }else if(datos.length <= 0)
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

app_express.get("/tarjeta_unidad_unidad_cp/:unidad/:fechainicio/:fechafin",function(req,res)
{
    var unidad = req.params.unidad
    var fechaI = req.params.fechainicio;
    var fechaF= req.params.fechafin;

    query_report_tarjeta_unidad_cp(unidad,fechaI,fechaF,(error,datos)=>
    {
        if(error)
        {
            res.status(200).json(
                {
                    status_code:400,
                    datos:null
                })
        }else if(datos.length <= 0)
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

app_express.post("/")

module.exports = app_express
