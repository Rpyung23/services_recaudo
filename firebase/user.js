let {createJWT,verify_token,invalited_token} = require("../jwt/jwt")
var admin = require("firebase-admin");
var serviceAccount = require("../firebase/path/credencial.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://vigitrack-empresas-default-rtdb.firebaseio.com"
});

let database = admin.database();

let datos_login_select = (callback_datos)=>
{

    let obj_vector = []

    database.ref("code").once("value",function(data)
    {
        data.forEach((dato) => {
           //console.log(dato.key)

            var code = dato.child("code").val()

            var obj = {
                name : dato.child("name").val(),
                key : Buffer.from(dato.key).toString("base64"),
                act: Buffer.from(code).toString("base64")
            }
            obj_vector.push(obj)
        })

        callback_datos(obj_vector);
    })
}

let validate_user_company = (user,pass,child_,callback) =>
{

    let obj = {
        code:400,
        msm: null,
        token:null,
    }

    database.ref("code/"+child_).once("value",function (datos)
    {

        if(user == datos.child("user").val() &&
            pass == datos.child("pass").val()){

            obj.code = 200
            obj.msm = "user log ok"
            obj.token = Buffer.from(createJWT(datos.child("code").val())).toString("base64")

            callback(obj)

        }else{
            obj.msm="invalited session"
            callback(obj)
        }
    }).catch((error)=>{
        obj.msm="invalited child"
        callback(error)
    })
}

module.exports = {datos_login_select,validate_user_company}