let mysql = require("mysql");
/*let openConnectionBD = (callback) =>
{

    conn.connect(function(error)
    {
        if(error){
            callback(false,error)
        }else
        {
            console.log("CONNECTED AS ID "+conn.threadId)

            callback(true)
        }
    });
}

let closeConnectionBD = (callback)=>
{
    conn.end(function(error){
        if(error)
        {
            callback(false,error)
        }else
        {
            callback(true,null)
        }
    });
}
*/

let objConn = async(code)=>
{

    let objC =
        {
            host: null,
            user: null,
            password: null,
            database: null,
            port:0
        }

    switch(code)
    {
        case 'uambatena1198':
            objC.host = '71.6.142.111';
            objC.user = 'root';
            objC.password = 'Vigitrack102030*';
            objC.database = 'uambatena';
            objC.port = 3306
            break;
        case 'consorcio2596':
            break;
    }

    console.log(objC)
    /*const promesa = new Promise((resolve,reject)=>
    {

    })*/
    let conn = mysql.createConnection(objC)

    conn = await conn.connect();

    return conn
}


module.exports = {objConn}