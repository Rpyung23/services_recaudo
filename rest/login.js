let base_64 = require("js-base64")
let {invalited_token} =  require("../jwt/jwt.js")
let express = require("express")
let app_express = express()

let {datos_login_select,validate_user_company} = require("../firebase/user")

app_express.post("/companys",function (req,res)
{
    datos_login_select((datos)=>
    {
        res.status(200).json(datos)
    })
})


app_express.post("/login",function (req,res)
{
    var login = {
        user:req.body.user,
        pass:req.body.pass,
        child:base_64.decode(req.body.child)
    }


    validate_user_company(login.user,login.pass,login.child,(dato)=>{
        res.status(200).json(dato)
    })

})



app_express.post("/logout",function(req,res){
    var token =  req.body.token
    let obj = invalited_token(token)

    res.status(200).json(obj)

})

module.exports = app_express