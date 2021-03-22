let express = require("express")
let app_express = express()
let {createObjConection,openConnectionBD,closeConnectionBD} = require("../mysql/query_login")

app_express.post("/login",function (req,res)
{
    var obj = {
        host: req.body.ip,
        user: req.body.user_bd,
        password: req.body.pass_server,
        database:req.body.bd,
        port: req.body.port,
    }

    console.log(obj)
    createObjConection(obj)
    openConnectionBD((open,error)=>
    {
       if(open==true)
       {
           res.status(200).json({
               msm:"ok"
           })
       }else{
           res.status(200).json({
               msm:"error",
               data:error
           })
       }
    })

})



app_express.post("/close",function (req,res)
{

    closeConnectionBD((bandera,error)=>
    {
        if(bandera==true)
        {
            console.log('CONNECTED CLOSE')
            res.status(200).json({
                msm:"ok"
            })
        }else
            {
                res.status(200).json({
                    msm:"error",
                    datos:error
                })
            }
    })

})

module.exports = app_express