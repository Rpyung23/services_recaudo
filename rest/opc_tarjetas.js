let express = require("express")
let base64 = require("js-base64")
let app = express()
let {verify_token} = require("../jwt/jwt")
let {query_estados_pagos,query_pago_tarjeta_} = require("../mysql/query_tarjetas")

app.post('/tarjetas_estados_pagos/:fechaI/:fechaF/:unidad_or_company/:bandera_filtro/:bandera_script',
    function(req,res)
{

    verify_token(req.body.token,(bandera,codigo_msm)=>{

        if(bandera == 0){

            res.status(200).json({
                status_code:500,
                datos:codigo_msm
            })

        }else
            {
                /**code,bandera_filtro,bandera_script,company_or_unidad,fechaI,fechaF,callback**/

            query_estados_pagos(codigo_msm,req.params.bandera_filtro
                ,req.params.bandera_script,req.params.unidad_or_company,
                req.params.fechaI,req.params.fechaF,(error,datos)=>
                {
                    if(error){

                        res.status(200)
                            .json({
                                status_code:400,
                                datos:error
                            })

                    }else{

                        if(datos.length>0)
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

//code,codigo_user_tarj,idPagoTarj,idTarjeta,callback

app.post('/pago_tarjeta',function(req,res)
{
    var obj = {
        token : req.body.token,
        code_user_tarjeta: base64.decode(req.body.code_user_tarjeta),
        idtarjeta:req.body.idtarjeta
    }

    verify_token(obj.token,(bandera,codigo_msm)=>{

        if(bandera == 0){

            res.status(200).json({
                status_code:500,
                datos:codigo_msm
            })

        }else
        {
            /**code,codigo_user_tarj,idPagoTarj,idTarjeta,callback**/

            query_pago_tarjeta_(codigo_msm,obj.code_user_tarjeta,obj.idtarjeta,(error,datos)=>
                {
                    if(error){
                        res.status(200).json(error)
                    }else{
                        res.status(200).json(datos)
                    }

                })
        }
    })

})

module.exports = app