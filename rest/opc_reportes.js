let {verify_token} = require("../jwt/jwt")
let express = require("express")
let app_express = express();
let {query_report_ant,query_report_tarjeta_unidad_all_sp,query_report_tarjeta_unidad_all_cp
    ,query_report_tarjeta_unidad_sp,query_report_tarjeta_unidad_cp
    ,query_report_consilado_vueltas,query_reporte_consolidado_por_minutos,
    query_reporte_penalidad_segundo_all,query_reporte_penalidad_segundo_unidad,
    query_tarjetas_controles_sp,query_tarjetas_controles_all,query_imprimir_recibo} = require("../mysql/querys")

app_express.post("/ant/:fechainicio/:fechafin/:horaini/:horafin",function(req,res)
{

    var codigo = req.body.token

    var fi = req.params.fechainicio

    var ff = req.params.fechafin
    var hi = req.params.horaini
    var hf = req.params.horafin


    verify_token(codigo,(bandera,codigo_msm)=>{

        if(bandera == 0){

            res.status(200).json({
                status_code:500,
                datos:codigo_msm
            })

        }else{
            query_report_ant(codigo_msm,fi, ff,hi,hf,(error,datos)=>
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
            })
        }
    })



})

app_express.post("/tarjeta_unidad_all_sp/:fechainicio/:fechafin",function(req,res)
{
    var codigo = req.body.token
    var fechaI = req.params.fechainicio;
    var fechaF= req.params.fechafin;

    verify_token(codigo,(bandera,codigo_msm)=>{

        if(bandera == 0){

            res.status(200).json({
                status_code:500,
                datos:codigo_msm
            })

        }else{
            query_report_tarjeta_unidad_all_sp(codigo_msm,fechaI,fechaF,(error,datos)=>
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
        }
    })

})

app_express.post("/tarjeta_unidad_all_cp/:fechainicio/:fechafin",function(req,res)
{
    var codigo = req.body.token
    var fechaI = req.params.fechainicio;
    var fechaF= req.params.fechafin;


    verify_token(codigo,(bandera,codigo_msm)=>{

        if(bandera == 0){

            res.status(200).json({
                status_code:500,
                datos:codigo_msm
            })

        }else{
            query_report_tarjeta_unidad_all_cp(codigo_msm,fechaI,fechaF,(error,datos)=>
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
        }
    })

})

app_express.post("/penalidad_segundos_all/:fechaI/:fechaF/:bandera",function(req,res)
{
    var obj = {
        code:req.body.token,
        fechaI:req.params.fechaI,
        fechaF:req.params.fechaF,
        bandera:req.params.bandera
    }

    //code,fechaI,fechaF,bandera,callback

    verify_token(obj.code,(bandera,codigo_msm)=>{

        if(bandera == 0){

            res.status(200).json({
                status_code:500,
                datos:codigo_msm
            })

        }else{
            query_reporte_penalidad_segundo_all(codigo_msm,obj.fechaI,obj.fechaF,obj.bandera,(error,datos)=>
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
        }
    })



})

app_express.post("/penalidad_segundos_unidad/:unidad/:fechaI/:fechaF/:bandera",function(req,res)
{
    var obj = {
        code:req.body.token,
        unidad:req.params.unidad,
        fechaI:req.params.fechaI,
        fechaF:req.params.fechaF,
        bandera:req.params.bandera
    }

    //code,unidad,fechaI,fechaF,bandera,callback

    verify_token(obj.code,(bandera,codigo_msm)=>{

        if(bandera == 0){

            res.status(200).json({
                status_code:500,
                datos:codigo_msm
            })

        }else{
            query_reporte_penalidad_segundo_unidad(codigo_msm,obj.unidad,obj.fechaI,obj.fechaF,obj.bandera,(error,datos)=>
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
        }
    })



})

app_express.post("/tarjeta_unidad_unidad_sp/:unidad/:fechainicio/:fechafin",function(req,res)
{
    var codigo = req.body.token
    var unidad = req.params.unidad
    var fechaI = req.params.fechainicio;
    var fechaF= req.params.fechafin;


    verify_token(codigo,(bandera,codigo_msm)=>{

        if(bandera == 0){

            res.status(200).json({
                status_code:500,
                datos:codigo_msm
            })

        }else{
            query_report_tarjeta_unidad_sp(codigo_msm,unidad,fechaI,fechaF,(error,datos)=>
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
        }
    })


})

app_express.post("/tarjeta_unidad_unidad_cp/:unidad/:fechainicio/:fechafin",function(req,res)
{
    var codigo = req.body.token
    var unidad = req.params.unidad
    var fechaI = req.params.fechainicio;
    var fechaF= req.params.fechafin;



    verify_token(codigo,(bandera,codigo_msm)=>{

        if(bandera == 0){

            res.status(200).json({
                status_code:500,
                datos:codigo_msm
            })

        }else{
            query_report_tarjeta_unidad_cp(codigo_msm,unidad,fechaI,fechaF,(error,datos)=>
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
        }
    })


})

app_express.post("/consolidado_vuelta/:fechainicio/:fechafin",function(req,res)
{
    var obj =
    {
        codigo:req.body.token,
        fecha_inicio:req.params.fechainicio,
        fecha_fin:req.params.fechafin
    }


    verify_token(obj.codigo,(bandera,codigo_msm)=>{

        if(bandera == 0){

            res.status(200).json({
                status_code:500,
                datos:codigo_msm
            })

        }else{
            query_report_consilado_vueltas(codigo_msm,obj.fecha_inicio, obj.fecha_fin,(error,datos)=>
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

app_express.post("/consolidado_minutos/:fecha",function(req,res)
{
    var obj =
        {
            codigo:req.body.token,
            fecha:req.params.fecha,
        }


    verify_token(obj.codigo,(bandera,codigo_msm)=>{

        if(bandera == 0){

            res.status(200).json({
                status_code:500,
                datos:codigo_msm
            })

        }else{
            query_reporte_consolidado_por_minutos(codigo_msm,obj.fecha,(error,datos)=>
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


app_express.post("/tarjetas_controles_sp/:fechaI/:fechaF/:unidad",function(req,res){

    var obj =
        {
            codigo:req.body.token,
            fechaI:req.params.fechaI,
            fechaF:req.params.fechaF,
            unidad:req.params.unidad
        }

    verify_token(obj.codigo,(bandera,codigo_msm)=>{

        if(bandera == 0){

            res.status(200).json({
                status_code:500,
                datos:codigo_msm
            })

        }else{
            query_tarjetas_controles_sp(codigo_msm,obj.fechaI,obj.fechaF,obj.unidad,(error,datos)=>
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



app_express.post("/tarjetas_controles_all/:fechaI/:fechaF/:unidad",function(req,res){

    var obj =
        {
            codigo:req.body.token,
            fechaI:req.params.fechaI,
            fechaF:req.params.fechaF,
            unidad:req.params.unidad
        }

    verify_token(obj.codigo,(bandera,codigo_msm)=>{

        if(bandera == 0){

            res.status(200).json({
                status_code:500,
                datos:codigo_msm
            })

        }else{
            query_tarjetas_controles_all(codigo_msm,obj.fechaI,obj.fechaF,obj.unidad,(error,datos)=>
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


app_express.post("/imprimir_recibo/:unidad",function(req,res)
{

    var obj =
        {
            codigo:req.body.token,
            unidad:req.params.unidad
        }

    verify_token(obj.codigo,(bandera,codigo_msm)=>{

        if(bandera == 0){

            res.status(200).json({
                status_code:500,
                datos:codigo_msm
            })

        }else{
            query_imprimir_recibo(codigo_msm,obj.unidad,(error,datos)=>
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

module.exports = app_express
