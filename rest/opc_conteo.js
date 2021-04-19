let express = require("express")
let {query_conteo_pasajeros_general} = require("../mysql/query_conteo")
let app = express()


app.post("/conteo_general/:unidad/:fechaI/:fechaF",function(req,res)
{
    query_conteo_pasajeros_general('pradoeco896',req.params.fechaI,req.params.fechaF
        ,req.params.unidad,(error,datos)=>
        {
            if(error){

                res.status(200)
                    .json({
                        status_code:400,
                        datos:error
                    })

            }else{

                res.status(200).json({
                    status_code:200,
                    datos:datos
                })
            }
    })
})


module.exports = app