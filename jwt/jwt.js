const base64 = require('js-base64')
const jwt = require('jsonwebtoken');

const options = {
    algorithm:'HS256'
}

let payload = {
    code_act:"",
    iat:null,
    exp:null
}

const secret = "vigitrack2021-@-buhosm@rt-virtualcode07"

let createJWT = (datos)=>
{
    payload.code_act = datos

    payload.iat =  Math.floor(Date.now()/1000)
    payload.exp = Math.floor(Date.now()/1000)+28800


    let token = "";

    try{

        token = jwt.sign(payload,secret,options)
    }catch(e){
        console.log(e)
        return "fail create token"
    }

    return token
}


let verify_token = (token,callback)=>{

    jwt.verify(base64.decode(token), secret, function(err, decoded)
    {
        if(err){
            callback(0,"token invalited")
        }else{
            callback(1,decoded.code_act)
        }
    });
}

let invalited_token = (token)=>{

    var obj = {
        code : 400,
        msm :null,
        token:""
    }
    try {
        obj.token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
        obj.code = 200
        obj.msm = "invalited completed"
        return obj
    } catch(err) {
        obj.code = 400
        obj.msm = "fail invalited token"
        return obj
    }
}

module.exports = {createJWT,verify_token,invalited_token}