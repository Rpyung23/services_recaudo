require("./config/port")
let express = require("express")
let body_parse = require("body-parser")

let app_express = express()//inicializo el express

/**CONFIGURACION BODY PARSER**/

app_express.use(body_parse.urlencoded({extended:true}))
app_express.use(body_parse.json())

/** REST unidades **/
let opc_unidades = require("./rest/opc_unidades")
let global = require("./rest/global")

app_express.use(opc_unidades)
app_express.use(global)

//run el servidor
app_express.listen(process.env.PORT,()=>
{
    console.log(`Coneccion en el pueto ${process.env.PORT}`);
})