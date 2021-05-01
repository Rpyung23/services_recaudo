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

    console.log(code)
    let objC =
        {
            host: null,
            user: null,
            password: null,
            database: null,
            port:0
        }

        /*** code es el codigo de activacion de firebase**/

    switch(code)
    {
        case 'uambatena1198':
            objC.host = '71.6.142.111';
            objC.user = 'root';
            objC.password = 'Vigitrack102030*';
            objC.database = 'uambatena';
            objC.port = 3306
            break;
        case 'transisa0645':
            objC.host = '71.6.142.111';
            objC.user = 'root';
            objC.password = 'Vigitrack102030*';
            objC.database = 'transisa';
            objC.port = 3306
            break;
        case 'rircay1196':
            objC.host = '71.6.142.116';
            objC.user = 'root';
            objC.password = 'Urbano1972102030*';
            objC.database = 'crircay';
            objC.port = 3306
            break;
        case 'trunsa1152':
            objC.host = '71.6.142.116';
            objC.user = 'root';
            objC.password = 'Urbano1972102030*';
            objC.database = 'trunsa';
            objC.port = 3306
            break;
        case '28septiembre':
            objC.host = '71.6.142.111';
            objC.user = 'root';
            objC.password = 'Vigitrack102030*';
            objC.database = '28septiembre';
            objC.port = 3306
            break;

        case 'consorcio2596':
            objC.host = '71.6.142.111';
            objC.user = 'root';
            objC.password = 'Vigitrack102030*';
            objC.database = 'consorcio-r';
            objC.port = 3306
            break;

        case 'puruha1502':
            objC.host = '71.6.142.116';
            objC.user = 'root';
            objC.password = 'Urbano1972102030*';
            objC.database = 'puruha';
            objC.port = 3306
            break;

        case 'pradoeco896':
            objC.host = '71.6.142.116';
            objC.user = 'root';
            objC.password = 'Urbano1972102030*';
            objC.database = 'prado-eco';
            objC.port = 3306
            break;

        case 'latina1579':
            objC.host = '71.6.142.111';
            objC.user = 'root';
            objC.password = 'Vigitrack102030*';
            objC.database = 'latina';
            objC.port = 3306
            break;
    }

    //console.log(objC)

    let conn = mysql.createConnection(objC)

    return new Promise(async(resolve,reject)=>
    {
        conn.connect(function(error)
        {
            console.log(error)
            if(error)
            {
                reject(error)
            }else
                {
                    resolve(conn)
                }
        });
    })



}


module.exports = {objConn}