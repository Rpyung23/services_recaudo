let express = require("express")
let app_express = express()

let {query_salidas_unidad_fechas_horas,query_tarjeta_salida_d
    ,query_recorrido_bus,query_unidades_conteo_marcaciones_tabla
    ,query_unidades_conteo_marcaciones_pdf,query_tarjetas_trabajadas_all
    ,query_tarjetas_trabajadas_unidad} = require("../mysql/querys.js")

/**Metodo get**/

app_express.get('/tarjeta/:code/:tarjeta',function(req,res)
{
    query_tarjeta_salida_d(req.params.code,req.params.tarjeta,(error,datos)=>
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
/*******************************************************************/

/************************* RECORRIDO ******************************/

app_express.get('/recorrido/:code/:bus/:fecha/:horaI/:horaF',function(req,res)
{
    var obj =
        {
            bus:req.params.bus,
            codigo:req.params.code,
            fecha:req.params.fecha,
            horaI:req.params.horaI,
            horaF:req.params.horaF
        }
    query_recorrido_bus(obj.codigo,obj.bus,obj.fecha,obj.horaI,obj.horaF,(error,datos)=>
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
/*****************************************************************/

/************************ CONTEO MARCACIONES *******************************/
 /** TABLA **/

 app_express.get('/conteo_marcaciones_tabla/:code/:fecha',function (req,res)
 {
     var obj =
         {
             fecha:req.params.fecha,
             codigo:req.params.code
         }
     query_unidades_conteo_marcaciones_tabla(obj.codigo,obj.fecha,(error,datos)=>
     {
         if(error)
         {
             res.status(200).json({
                 status_code:400,
                 datos:error.sqlMessage
             })
         }else if(datos<=0)
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

app_express.get('/conteo_marcaciones_pdf/:code/:tarjeta',function (req,res)
{
    var obj =
        {
            tarjeta:req.params.tarjeta,
            codigo:req.params.code
        }
    query_unidades_conteo_marcaciones_pdf(obj.codigo,obj.tarjeta,(error,datos)=>
    {
        if(error)
        {
            res.status(200).json({
                status_code:400,
                datos:error.sqlMessage
            })
        }else if(datos<=0)
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



/******************************* TARJETAS TRABAJADAS ***************************************/

app_express.get("/tarjetas_trabajadas_all/:codigo/:fechaI/:fechaF",function (req,res)
{
    var obj =
        {
            code:req.params.codigo,
            fechainicial : req.params.fechaI,
            fechafinal : req.params.fechaF
        }

    query_tarjetas_trabajadas_all(obj.code,obj.fechainicial,obj.fechafinal,(error,datos)=>
    {
        if(error)
        {
            res.status(200).json({
                status_code:400,
                datos:error.sqlMessage
            })
        }else if(datos<=0)
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


app_express.get("/tarjetas_trabajadas_unidad/:codigo/:unidad/:fechaI/:fechaF",function (req,res)
{
    var obj =
        {
            code:req.params.codigo,
            unidad:req.params.unidad,
            fechainicial : req.params.fechaI,
            fechafinal : req.params.fechaF
        }

    query_tarjetas_trabajadas_unidad(obj.code,obj.unidad,obj.fechainicial,obj.fechafinal,(error,datos)=>
    {
        if(error)
        {
            res.status(200).json({
                status_code:400,
                datos:error.sqlMessage
            })
        }else if(datos<=0)
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