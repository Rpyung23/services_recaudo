let {objConn} = require("../mysql/config")
let {createJWT,verify_token,invalited_token} = require("../jwt/jwt")



let validate_user_company_mysql = (user,pass,code_act,callback)=>
{
    let obj = {
        code:400,
        msm: null,
        token:null,
        datos_extras:null
    }


    objConn(code_act).then((resolve)=>
    {
        let conn = resolve

        var script = "select Usu.CodiUsua,Usu.CodiClieUsua,Usu.NombApellUsua,Usu.ClavUsua," +
            "Usu.NombUsua,Cli.NombEmprClie,Cli.TarjTituClie " +
            "from usuarios as Usu join clientes as Cli on Usu.CodiClieUsua = Cli.CodiClie " +
            "where Usu.NombUsua = '"+user+"' and Usu.clavusua='"+pass+"'"
        //console.log(script)

        conn.query(script,function(error,results,fields){
            if(error)
            {
                obj.code = 400
                obj.msm = error.sqlMessage
                callback(obj)
            }else{
                console.log("tam : "+results.length)
                if(results.length>0)
                {
                    console.log("tam : "+results.length)
                    let datos = {
                        codiusua:null,
                        codiclieusua:null,
                        nombapellusua:null,
                        clavusua:null,
                        nombusua:null,
                        nombemprclie:null,
                        tarjtituclie:null
                    }
                    for(let i=0;i<results.length;i++)
                    {

                        datos.codiusua=Buffer.from(results[i].CodiUsua).toString("base64")
                        datos.codiclieusua=Buffer.from(results[i].CodiClieUsua).toString("base64")
                        datos.nombapellusua=Buffer.from(results[i].NombApellUsua).toString("base64")
                        //datos.clavusua=Buffer.from(results[i].ClavUsua).toString("base64")
                        datos.nombusua=Buffer.from(results[i].NombUsua).toString("base64")
                        datos.nombemprclie=results[i].NombEmprClie
                        datos.tarjtituclie=Buffer.from(results[i].TarjTituClie).toString("base64")

                    }

                    obj.code = 200
                    obj.msm = "Bienvenido !"
                    obj.datos_extras = datos
                    obj.token = Buffer.from(createJWT(code_act)).toString("base64")
                    conn.end()
                    callback(obj)

                }else{
                    console.log("NO DATOS LOGIN")
                    obj.code = 300
                    obj.msm = "Error de credenciales"
                    conn.end()
                    callback(obj)
                }
            }
        })

    }).catch((reject)=>
    {
        obj.code = 400
        obj.msm = "Error BD dinamica"
        callback(obj)
    })
}

module.exports = {validate_user_company_mysql}