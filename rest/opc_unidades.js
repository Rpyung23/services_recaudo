let express = require("express")
let app_express = express()

let {query_all_unidades,query_salidas_unidad_fechas,query_tarjeta_salida_d,query_recorrido_bus} = require("../mysql/querys.js")

/**Metodo get**/


app_express.get("/salidas/:id_bus/:fecha/:horaI/:horaF",function(req,res)
{
    var objReq =
        {
            id_bus:req.params.id_bus,
            fecha:req.params.fecha,
            horaI:req.params.horaI,
            horaF:req.params.horaF
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

app_express.get('/tarjeta/:tarjeta',function(req,res)
{
    query_tarjeta_salida_d(req.params.tarjeta,(error,datos)=>
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

app_express.get('/recorrido/:bus/:fecha/:horaI/:horaF',function(req,res)
{
    var obj =
        {
            bus:req.params.bus,
            fecha:req.params.fecha,
            horaI:req.params.horaI,
            horaF:req.params.horaF
        }
    query_recorrido_bus(obj.bus,obj.fecha,obj.horaI,obj.horaF,(error,datos)=>
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