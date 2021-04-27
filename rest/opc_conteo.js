let express = require("express")
let {verify_token} = require("../jwt/jwt")
let {query_conteo_pasajeros_general,query_conteo_pasajeros_vuelta} = require("../mysql/query_conteo")
let app = express()


app.post("/conteo_general/:unidad/:fechaI/:fechaF",function(req,res)
{

    verify_token(req.body.token,(bandera,codigo_msm)=>{

        if(bandera == 0){

            res.status(200).json({
                status_code:500,
                datos:codigo_msm
            })

        }else{
            query_conteo_pasajeros_general(codigo_msm,req.params.fechaI,req.params.fechaF
                ,req.params.unidad,(error,datos)=>
                {
                    if(error){

                        res.status(200)
                            .json({
                                status_code:400,
                                datos:error
                            })

                    }else{

                        if(datos.length>0 && datos[0].unidad!=null)
                        {
                            res.status(200).json({
                                status_code:200,
                                datos:datos
                            })

                        }else{
                            res.status(200).json({
                                status_code:300,
                                datos:null
                            })
                        }
                    }
                })
        }
    })


})



app.post("/conteo_vueltas/:vuelta/:unidad",function(req,res)
{

    verify_token(req.body.token,(bandera,codigo_msm)=>{

        if(bandera == 0){

            res.status(200).json({
                status_code:500,
                datos:codigo_msm
            })

        }else{
            query_conteo_pasajeros_vuelta(codigo_msm,req.params.vuelta,req.params.unidad,(error,datos)=>
            {
                if(error){

                    res.status(200)
                        .json({
                            status_code:400,
                            datos:error
                        })

                }else{

                    if(datos.length>0 && datos[0].unidad!=null)
                    {
                        res.status(200).json({
                            status_code:200,
                            datos:datos
                        })

                    }else{
                        res.status(200).json({
                            status_code:300,
                            datos:null
                        })
                    }
                }
            })
        }
    })

})


module.exports = app