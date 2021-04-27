let mysql = require("mysql")
let {objConn} = require("../mysql/config")

let {getFecha_format,getHora,getFecha_dd_mm_yyyy,getSeg_diferencia,getMin_diferencia} = require("../utils/utils")

function query_estados_pagos_script(bandera_script,fechaI,fechaF,company_or_unidad)
{
    console.log("bandera_script : "+bandera_script)

    let  script = ""

    switch (bandera_script)
    {
        /**TODOS**/
        case 1:
            console.log("todos")
            script = "select t1.idTarj,t1.CodiVehiTarj,t1.FechCreaTarj,t1.PrecTarj,t3.descripcion,t1.EstaTarj," +
                "t1.ActiTarj from tarjeta_dm t1 inner join vehiculo t2 on t2.CodiVehi = t1.CodiVehiTarj " +
                "left join vehiculo_grupo t3 on t3.id = t2.grupo_id left join usuarios t4 " +
                "on t4.CodiUsua = t1.CodiUsuaTarj or (t4.CodiUsua is null) where t1.FechCreaTarj " +
                "between '"+fechaI+"' and '"+fechaF+"'"
            break;
        /**EMPRESAS**/
        case 2:
            console.log("company")
            script = "select t1.idTarj,t1.CodiVehiTarj,t1.FechCreaTarj,t1.PrecTarj,t3.descripcion,t1.EstaTarj,t1.ActiTarj " +
                "from tarjeta_dm t1 inner join vehiculo t2 on t2.CodiVehi = t1.CodiVehiTarj left join vehiculo_grupo t3 " +
                "on t3.id = t2.grupo_id left join usuarios t4 on t4.CodiUsua = t1.CodiUsuaTarj or (t4.CodiUsua is null) " +
                "where t1.FechCreaTarj between '"+fechaI+"' and '"+fechaF+"' and  t3.descripcion = '"+company_or_unidad+"'"
            break;
        /**Unidad**/
        case 3:
            console.log("unidad")
            script = "select t1.idTarj,t1.CodiVehiTarj,t1.FechCreaTarj,t1.PrecTarj,t3.descripcion,t1.EstaTarj," +
                "t1.ActiTarj from tarjeta_dm t1 inner join vehiculo t2 on t2.CodiVehi = t1.CodiVehiTarj " +
                "left join vehiculo_grupo t3 on t3.id = t2.grupo_id left join usuarios t4 on " +
                "t4.CodiUsua = t1.CodiUsuaTarj or (t4.CodiUsua is null) where t1.FechCreaTarj " +
                "between '"+fechaI+"' and '"+fechaF+"' and t1.CodiVehiTarj = '"+company_or_unidad+"'"
            break;

        default:
            script = "error"
            break;
    }


    return script
}

let query_estados_pagos = (code,bandera_filtro,bandera_script,company_or_unidad,fechaI,fechaF,callback)=>
{
    objConn(code).then((resolve)=>
    {
        let conn = resolve

        var string_query = query_estados_pagos_script(parseInt(bandera_script),fechaI,fechaF,company_or_unidad)

        console.log(string_query)

        conn.query(string_query,function(error,results,fields)
        {
            //console.log(`${results}`)
            if(error)
            {
                callback(error.sqlMessage,null)
            }else
            {
                let datos = []
                for(var i = 0;i<results.length;i++)
                {
                    var monto = results[i].PrecTarj
                    var obj =
                        {
                            id:results[i].idTarj,
                            unidad:results[i].CodiVehiTarj,
                            emision:getFecha_dd_mm_yyyy(results[i].FechCreaTarj),
                            monto:parseFloat(monto).toFixed(2),
                            empresa:results[i].descripcion,
                            estado:results[i].EstaTarj,
                            active_tarjeta:results[i].ActiTarj,
                            action: results[i].EstaTarj == 1 ? 1 : 0
                        }

                    if(bandera_filtro == 1)
                    {
                        if(results[i].EstaTarj == 1){
                            datos.push(obj)
                        }
                    }else{
                        datos.push(obj)
                    }
                }
                conn.end()
                callback(null,datos)
            }
        });


    }).catch(()=>
    {
        callback({
            sqlMessage:'Error en query Conn Dinamica'
        },null)
        console.log('Error CONN BD')
    })
}

let query_pago_tarjeta = ()=>{

}

module.exports = {query_estados_pagos}
