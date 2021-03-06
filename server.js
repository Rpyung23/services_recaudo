require("./config/port")

let cors = require("cors")
let express = require("express")
let body_parse = require("body-parser")


let app_express = express()//inicializo el express

/**  MIDDLE para el CORS **/
app_express.use(cors({
    "origin": "*",
    "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
    "preflightContinue": false,
    "optionsSuccessStatus": 204
}))


/**CONFIGURACION BODY PARSER**/

app_express.use(body_parse.urlencoded({extended:true}))
app_express.use(body_parse.json())

/** REST unidades **/
let opc_unidades = require("./rest/opc_unidades")
let global = require("./rest/global")
let opc_reportes = require("./rest/opc_reportes")
let opc_velocidad = require("./rest/opc_velocidad")
let opc_tarjetas = require("./rest/opc_tarjetas")
let login = require("./rest/login")
let conteo = require("./rest/opc_conteo")


/** MIDDLE **/
app_express.use(opc_unidades)
app_express.use(global)
app_express.use(opc_reportes)
app_express.use(opc_velocidad)
app_express.use(login)
app_express.use(conteo)
app_express.use(opc_tarjetas)

//run el servidor
app_express.listen(process.env.PORT,()=>
{
    console.log(`Coneccion en el puerto ${process.env.PORT}`);
})