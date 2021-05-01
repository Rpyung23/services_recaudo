let {verify_token} = require("../jwt/jwt")

let express = require("express")
let app_express = express()

let {query_velocidad_historial,query_velocidad_general
    ,query_velocidad_total_all,query_velocidad_total_unidad} = require("../mysql/query_velocidad")


app_express.post("/velocidad_historial/:tarjeta/:velocidad/:fecha/:unidad",function(req,res) {
    //code,tarjeta,velocidad,fecha,unidad,callback

    var obj =
        {
            code:req.body.token,
            tarjeta:req.params.tarjeta,
            velocidad:req.params.velocidad,
            fecha:req.params.fecha,
            unidad:req.params.unidad
        }

    verify_token(obj.code,(bandera,codigo_msm)=>{

        if(bandera == 0){

            res.status(200).json({
                status_code:500,
                datos:codigo_msm
            })

        }else{
            query_velocidad_historial(codigo_msm,obj.tarjeta,obj.velocidad,obj.fecha,obj.unidad,(error,datos)=>
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

app_express.post("/velocidad_general/:velocidad/:fecha",function(req,res)
    {
    //code,velocidad,fecha

    var obj =
        {
            code:req.body.token,
            velocidad:req.params.velocidad,
            fecha:req.params.fecha
        }

        verify_token(obj.code,(bandera,codigo_msm)=>{

            if(bandera == 0){

                res.status(200).json({
                    status_code:500,
                    datos:codigo_msm
                })

            }else{
                query_velocidad_general(codigo_msm,obj.velocidad,obj.fecha,(error,datos)=>
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

app_express.post("/velocidad_total_all/:velocidad/:fechaI/:fechaF",function(req,res)
{
    //code,fechaI,fechaF,velocidad

    var obj =
        {
            code:req.body.token,
            velocidad:req.params.velocidad,
            fechaI:req.params.fechaI,
            fechaF:req.params.fechaF
        }

    verify_token(obj.code,(bandera,codigo_msm)=>{

        if(bandera == 0){

            res.status(200).json({
                status_code:500,
                datos:codigo_msm
            })

        }else{
            query_velocidad_total_all(codigo_msm,obj.fechaI,obj.fechaF,obj.velocidad,(error,datos)=>
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

app_express.post("/velocidad_total_unidad/:unidad/:velocidad/:fechaI/:fechaF",function(req,res)
{
    //code,unidad,fechaI,fechaF,velocidad

    var obj =
        {
            code:req.body.token,
            velocidad:req.params.velocidad,
            unidad:req.params.unidad,
            fechaI:req.params.fechaI,
            fechaF:req.params.fechaF
        }



    verify_token(obj.code,(bandera,codigo_msm)=>{

        if(bandera == 0){

            res.status(200).json({
                status_code:500,
                datos:codigo_msm
            })

        }else{
            query_velocidad_total_unidad(codigo_msm,obj.unidad,obj.fechaI,obj.fechaF,obj.velocidad,(error,datos)=>
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


module.exports = app_express