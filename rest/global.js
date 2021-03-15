/**API REST QUE SE REPITEN **/


let express = require("express")
let app_express = express()

let {query_all_unidades} = require("../mysql/querys.js")

/**Metodo get**/

/** Obtiene todas las unidades **/
app_express.get("/unidades",function (req,res)
{

    query_all_unidades( (error,datos)=>
    {
        if(error)
        {
            res.status(200).json({
                status_code:400,
                datos:error
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