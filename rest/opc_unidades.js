let {verify_token} = require("../jwt/jwt")

let express = require("express")
let app_express = express()

let {query_salidas_unidad_fechas_horas,query_tarjeta_salida_d
    ,query_recorrido_bus,query_unidades_conteo_marcaciones_tabla
    ,query_unidades_conteo_marcaciones_pdf,query_tarjetas_trabajadas_all
    ,query_tarjetas_trabajadas_unidad} = require("../mysql/querys.js")

/**Metodo get**/

app_express.post('/tarjeta/:tarjeta',function(req,res)
{
    verify_token(req.body.token,(bandera,codigo_msm)=>{

        if(bandera == 0){

            res.status(200).json({
                status_code:500,
                datos:codigo_msm
            })

        }else{
            query_tarjeta_salida_d(codigo_msm,req.params.tarjeta,(error,datos)=>
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
/*******************************************************************/

/************************* RECORRIDO ******************************/

app_express.post('/recorrido/:bus/:fecha/:horaI/:horaF',function(req,res)
{
    var obj =
        {
            bus:req.params.bus,
            codigo:req.body.token,
            fecha:req.params.fecha,
            horaI:req.params.horaI,
            horaF:req.params.horaF
        }


    verify_token(obj.codigo,(bandera,codigo_msm)=>{

        if(bandera == 0){

            res.status(200).json({
                status_code:500,
                datos:codigo_msm
            })

        }else{
            query_recorrido_bus(codigo_msm,obj.bus,obj.fecha,obj.horaI,obj.horaF,(error,datos)=>
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
        }
    })

})
/*****************************************************************/

/************************ CONTEO MARCACIONES *******************************/
 /** TABLA **/

 app_express.post('/conteo_marcaciones_tabla/:fecha',function (req,res)
 {
     var obj =
         {
             fecha:req.params.fecha,
             codigo:req.body.token
         }

     verify_token(obj.codigo,(bandera,codigo_msm)=>{

         if(bandera == 0){

             res.status(200).json({
                 status_code:500,
                 datos:codigo_msm
             })

         }else{
             query_unidades_conteo_marcaciones_tabla(codigo_msm,obj.fecha,(error,datos)=>
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
         }
     })

 })

app_express.post('/conteo_marcaciones_pdf/:tarjeta',function (req,res)
{
    var obj =
        {
            tarjeta:req.params.tarjeta,
            codigo:req.body.token
        }

    verify_token(obj.codigo,(bandera,codigo_msm)=>{

        if(bandera == 0){

            res.status(200).json({
                status_code:500,
                datos:codigo_msm
            })

        }else{
            query_unidades_conteo_marcaciones_pdf(codigo_msm,obj.tarjeta,(error,datos)=>
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
        }
    })


})

/******************************* TARJETAS TRABAJADAS ***************************************/

app_express.post("/tarjetas_trabajadas_all/:fechaI/:fechaF",function (req,res)
{
    var obj =
        {
            code:req.body.token,
            fechainicial : req.params.fechaI,
            fechafinal : req.params.fechaF
        }

    verify_token(obj.code,(bandera,codigo_msm)=>{

        if(bandera == 0){

            res.status(200).json({
                status_code:500,
                datos:codigo_msm
            })

        }else{
            query_tarjetas_trabajadas_all(codigo_msm,obj.fechainicial,obj.fechafinal,(error,datos)=>
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
        }
    })

})


app_express.post("/tarjetas_trabajadas_unidad/:unidad/:fechaI/:fechaF",function (req,res)
{
    var obj =
        {
            code:req.body.token,
            unidad:req.params.unidad,
            fechainicial : req.params.fechaI,
            fechafinal : req.params.fechaF
        }


    verify_token(obj.code,(bandera,codigo_msm)=>{

        if(bandera == 0){

            res.status(200).json({
                status_code:500,
                datos:codigo_msm
            })

        }else{
            query_tarjetas_trabajadas_unidad(codigo_msm,obj.unidad,obj.fechainicial,obj.fechafinal,(error,datos)=>
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
        }
    })

})


module.exports = app_express