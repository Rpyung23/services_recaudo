let express = require("express")
let app_express = express();
let {query_report_ant,query_report_tarjeta_unidad_all_sp,query_report_tarjeta_unidad_all_cp
    ,query_report_tarjeta_unidad_sp,query_report_tarjeta_unidad_cp
    ,query_report_consilado_vueltas,query_reporte_consolidado_por_minutos,
    query_reporte_penalidad_segundo_all,query_reporte_penalidad_segundo_unidad} = require("../mysql/querys")

app_express.get("/ant/:code/:fechainicio/:fechafin",function(req,res)
{

    var codigo = req.params.code

    var fi = req.params.fechainicio

    var ff = req.params.fechafin
    query_report_ant(codigo,fi, ff,(error,datos)=>
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
                            })}
        }
        )
})

app_express.get("/tarjeta_unidad_all_sp/:code/:fechainicio/:fechafin",function(req,res)
{
    var codigo = req.params.code
    var fechaI = req.params.fechainicio;
    var fechaF= req.params.fechafin;

    query_report_tarjeta_unidad_all_sp(codigo,fechaI,fechaF,(error,datos)=>
    {
        if(error)
        {
            res.status(200).json(
                {
                    status_code:400,
                    datos:error.sqlMessage
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

app_express.get("/tarjeta_unidad_all_cp/:code/:fechainicio/:fechafin",function(req,res)
{
    var codigo = req.params.code
    var fechaI = req.params.fechainicio;
    var fechaF= req.params.fechafin;

    query_report_tarjeta_unidad_all_cp(codigo,fechaI,fechaF,(error,datos)=>
    {
        if(error)
        {
            res.status(200).json(
                {
                    status_code:400,
                    datos:error.sqlMessage
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

app_express.get("/penalidad_segundos_all/:code/:fechaI/:fechaF/:bandera",function(req,res)
{
    var obj = {
        code:req.params.code,
        fechaI:req.params.fechaI,
        fechaF:req.params.fechaF,
        bandera:req.params.bandera
    }

    //code,fechaI,fechaF,bandera,callback

    query_reporte_penalidad_segundo_all(obj.code,obj.fechaI,obj.fechaF,obj.bandera,(error,datos)=>
    {
        if(error)
        {
            res.status(200).json(
                {
                    status_code:400,
                    datos:error.sqlMessage
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

app_express.get("/penalidad_segundos_unidad/:code/:unidad/:fechaI/:fechaF/:bandera",function(req,res)
{
    var obj = {
        code:req.params.code,
        unidad:req.params.unidad,
        fechaI:req.params.fechaI,
        fechaF:req.params.fechaF,
        bandera:req.params.bandera
    }

    //code,unidad,fechaI,fechaF,bandera,callback

    query_reporte_penalidad_segundo_unidad(obj.code,obj.unidad,obj.fechaI,obj.fechaF,obj.bandera,(error,datos)=>
    {
        if(error)
        {
            res.status(200).json(
                {
                    status_code:400,
                    datos:error.sqlMessage
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

app_express.get("/tarjeta_unidad_unidad_sp/:code/:unidad/:fechainicio/:fechafin",function(req,res)
{
    var codigo = req.params.code
    var unidad = req.params.unidad
    var fechaI = req.params.fechainicio;
    var fechaF= req.params.fechafin;

    query_report_tarjeta_unidad_sp(codigo,unidad,fechaI,fechaF,(error,datos)=>
    {
        if(error)
        {
            res.status(200).json(
                {
                    status_code:400,
                    datos:error.sqlMessage
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

app_express.get("/tarjeta_unidad_unidad_cp/:code/:unidad/:fechainicio/:fechafin",function(req,res)
{
    var codigo = req.params.code
    var unidad = req.params.unidad
    var fechaI = req.params.fechainicio;
    var fechaF= req.params.fechafin;

    query_report_tarjeta_unidad_cp(codigo,unidad,fechaI,fechaF,(error,datos)=>
    {
        if(error)
        {
            res.status(200).json(
                {
                    status_code:400,
                    datos:error.sqlMessage
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

app_express.get("/consolidado_vuelta/:code/:fechainicio/:fechafin",function(req,res)
{
    var obj =
    {
        codigo:req.params.code,
        fecha_inicio:req.params.fechainicio,
        fecha_fin:req.params.fechafin
    }
    query_report_consilado_vueltas(obj.codigo,obj.fecha_inicio, obj.fecha_fin,(error,datos)=>
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

app_express.get("/consolidado_minutos/:code/:fecha",function(req,res)
{
    var obj =
        {
            codigo:req.params.code,
            fecha:req.params.fecha,
        }
    query_reporte_consolidado_por_minutos(obj.codigo,obj.fecha,(error,datos)=>
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
