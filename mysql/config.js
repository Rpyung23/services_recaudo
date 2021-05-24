let mysql = require("mysql");

let objConn = (code)=>
{


    let objC =
        {
            host: null,
            user: null,
            password: null,
            database: null,
            port:0
        }

        /*** code es el child -> bd_name **/

    switch(code)
    {
        case 'uambatena':
        case 'transisa':
        case '28septiembre':
        case 'consorcio-r':
        case 'latina':
            objC.host = '71.6.142.111';
            objC.user = 'root';
            objC.password = 'Vigitrack102030*';
            objC.database = code;
            objC.port = 3306
            break;
        case 'crircay':
        case 'trunsa':
        case 'puruha':
        case 'prado-eco':
            objC.host = '71.6.142.116';
            objC.user = 'root';
            objC.password = 'Urbano1972102030*';
            objC.database = code;
            objC.port = 3306
            break;
    }

console.log(objC)
    let conn = mysql.createConnection(objC)

    return new Promise((resolve,reject)=>
    {
        conn.connect(function(error)
        {

            if(error)
            {
                console.log("error connect BD: "+error)
                reject(error)
            }else
                {
                    console.log("connect BD resolve ")
                    resolve(conn)
                }
        });
    })

}


module.exports = {objConn}