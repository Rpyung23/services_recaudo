let cContadorAjuste = require("../models/cContadorAjuste")
let cConteo = require("../models/cConteo")

let mysql = require("mysql");

let {objConn} = require("../mysql/config") /**CREA LA CONEXION ALA BD Y RETORNA CONN (UNA CONEXION)**/

let query_conteo_pasajeros_general = (bd_name,fechaI,fechaF,unidad,callback) =>
    {

        objConn(bd_name).then((resolve)=>{

            let objVuelta = []

            let conn = resolve


            let script = unidad=="*" ? script_conteo_all(getConteoPasajerosTipo(bd_name),fechaI,fechaF) : script_conteo(objConfig.script_conteo,unidad,fechaI,fechaF)

            console.log("script_conteo_general : "+script)

            conn.query(script
                ,function (error,results,fields)
                {
                    if (error){
                        callback(error,null)
                    }else{

                        let objConteo = []

                        /*** 1.- obtenr las id de vultas***/
                        for (var i = 0;i<results.length;i++)
                        {
                            if (i>0){
                                if (results[i-1].unidad != results[i].unidad)
                                {
                                    var oConteo =  new cConteo();
                                    oConteo.setUnidad(results[i].unidad)
                                    objConteo.push(oConteo)
                                }
                            }
                        }

                        console.log(objConteo)


/*
                        if (getBanderaProceConteo(bd_name)==1)
                        {
                            objVuelta = getprocesoConteo(bd_name,objVuelta)
                        }

                        objVuelta = formatNumPuertasHabiles(objVuelta,bd_name)


                        var conteoProcesado = []

                        var json = {
                            subida1:objVuelta[0].subida1,
                            subida2:objVuelta[0].subida2,
                            subida3:objVuelta[0].subida3,
                            bajada1:objVuelta[0].bajada1,
                            bajada2:objVuelta[0].bajada2,
                            bajada3:objVuelta[0].bajada3,
                            error:Number(parseFloat(objVuelta[0].getError()).toFixed(2))
                        }

                        conteoProcesado.push(json)


*/
                       // callback(null,conteoProcesado)
                    }
                })


        })
            .catch((reject)=>
            {
                callback({
                    sqlMessage:'Error en query Conn Dinamica'
                },null)
            })


    }

let query_conteo_pasajeros_vuelta = (bd_name,unidad,idVuelta,callback)=>
{
    objConn(bd_name).then((resolve)=>{

        let objVuelta = []

        let conn = resolve


        let script = obtenerscriptVuelta(getConteoPasajerosTipo(bd_name),unidad,idVuelta)
        console.log("script_conteo_vuelta : "+script)
        conn.query(script
            ,function (error,results,fields)
        {
            if (error){
                callback(error,null)
            }else{


                let obj = new cConteo();

                let objContadorAjuste  = new cContadorAjuste;


                for (var i = 0;i<results.length;i++)
                {
                    if (getConteoPasajerosTipo(bd_name)==2)
                    {

                        objContadorAjuste.setApliAjus(results[i].ApliAjus)
                        objContadorAjuste.setFactAjus(results[i].FactAjus)
                        objContadorAjuste.setApliBaja(results[i].ApliBaja)
                        objContadorAjuste.setFactBaj1(results[i].FactBaj1)
                        objContadorAjuste.setFactSub3(results[i].FactSub3)
                        objContadorAjuste.setFactSub2(results[i].FactSub2)
                        objContadorAjuste.setPorcBaj2(results[i].PorcBaj2)
                        objContadorAjuste.setPorcBaj3(results[i].PorcBaj3)
                        obj.setOContadorAjuste(objContadorAjuste)
                    }

                    obj.setSubida1(obj.getSubida1()+results[i].subida1);
                    obj.setSubida2(obj.getSubida2()+results[i].subida2);
                    obj.setSubida3(obj.getSubida3()+results[i].subida3);

                    obj.setBajada1(obj.getBajada1()+results[i].bajada1);
                    obj.setBajada2(obj.getBajada2()+results[i].bajada2);
                    obj.setBajada3(obj.getBajada3()+results[i].bajada3);

                }

                objVuelta.push(obj)


                if (getBanderaProceConteo(bd_name)==1)
                {
                    objVuelta = getprocesoConteo(bd_name,objVuelta)
                }

                objVuelta = formatNumPuertasHabiles(objVuelta,bd_name)


                var conteoProcesado = []
                var json = {
                    subida1:objVuelta[0].subida1,
                    subida2:objVuelta[0].subida2,
                    subida3:objVuelta[0].subida3,
                    bajada1:objVuelta[0].bajada1,
                    bajada2:objVuelta[0].bajada2,
                    bajada3:objVuelta[0].bajada3,
                    error:Number(parseFloat(objVuelta[0].getError()).toFixed(2))
                }

                conteoProcesado.push(json)
                console.log(conteoProcesado)
                callback(null,conteoProcesado)
            }
        })


    })
        .catch((reject)=>
        {
            callback({
            sqlMessage:'Error en query Conn Dinamica'
        },null)
    })
}

/***********************************************************************/
function script_conteo_all(valor,fechaI,fechaF)
{

    let querys = ""

    switch(valor){

        case 2:
            querys =  "SELECT recaudo_m.unidad as unidad,recaudo_d.subida1 as subida1,recaudo_d.subida2 as subida2,\n" +
                "recaudo_d.subida3 as subida3,recaudo_d.bajada1 as bajada1," +
                "recaudo_d.bajada2 as bajada2,recaudo_d.bajada3 as bajada3," +
                "FactAjus,ApliAjus,FactBaj1,FactSub2,FactSub3,ApliBaja,PorcBaj2,PorcBaj3 " +
                "FROM recaudo_m JOIN recaudo_d ON recaudo_d.recaudo_m_id = recaudo_m.id " +
                "join contador_ajuste as CJ on CJ.CodiVehi = recaudo_m.unidad " +
                "WHERE  recaudo_m.hora between '"+fechaI+"' " +
                "and '"+fechaF+"' group by unidad,hora order by unidad ASC"
            break;
        case 1:

            querys =  "SELECT recaudo_m.unidad as unidad,recaudo_d.subida1 as subida1,recaudo_d.subida2 as subida2," +
                "recaudo_d.subida3 as subida3,recaudo_d.bajada1 as bajada1," +
                "recaudo_d.bajada2 as bajada2,recaudo_d.bajada3 as bajada3 " +
                "FROM recaudo_m JOIN recaudo_d ON recaudo_d.recaudo_m_id = recaudo_m.id " +
                "WHERE  recaudo_m.hora between '"+fechaI+"' and '"+fechaF+"' group by unidad,hora order by unidad ASC"

            break;
    }

    console.log(querys)
    return querys
}

function script_conteo(valor,unidad,fechaI,fechaF)
{

    let querys = ""

    switch(valor){

        case 2:
            querys =  "SELECT recaudo_m.unidad as unidad,recaudo_d.subida1 as subida1" +
                ",recaudo_d.subida2 as subida2,\n" +
                "recaudo_d.subida3 as subida3,recaudo_d.bajada1 as bajada1," +
                "recaudo_d.bajada2 as bajada2,recaudo_d.bajada3 as bajada3," +
                "FactAjus,ApliAjus,FactBaj1,FactSub2,FactSub3,ApliBaja,PorcBaj2,PorcBaj3 " +
                "FROM recaudo_m JOIN recaudo_d ON recaudo_d.recaudo_m_id = recaudo_m.id " +
                "join contador_ajuste as CJ on CJ.CodiVehi = '"+unidad+"' " +
                "WHERE recaudo_m.unidad ='"+unidad+"' AND recaudo_m.hora between '"+fechaI+"' " +
                "and '"+fechaF+"' group by unidad,hora order by unidad ASC"
            break;
        case 1:

            querys =  "SELECT recaudo_m.unidad as unidad,recaudo_d.subida1 as subida1,recaudo_d.subida2 as subida2," +
                "recaudo_d.subida3 as subida3,recaudo_d.bajada1 as bajada1," +
                "recaudo_d.bajada2 as bajada2,recaudo_d.bajada3 as bajada3 " +
                "FROM recaudo_m JOIN recaudo_d ON recaudo_d.recaudo_m_id = recaudo_m.id " +
                "WHERE recaudo_m.unidad ='"+unidad+"' AND recaudo_m.hora " +
                "between '"+fechaI+"' and '"+fechaF+"' group by unidad,hora order by unidad ASC"

            break;
    }

    console.log(querys)
    return querys
}

function obtenerscriptVuelta(bandera,unidad,vuelta)
{
    let script = "";
    switch(bandera)
    {
        case 2:
            script =  "SELECT recaudo_m.unidad as unidad,recaudo_d.subida1 as subida1,recaudo_d.subida2 as subida2,\n" +
                "recaudo_d.subida3 as subida3,recaudo_d.bajada1 as bajada1," +
                "recaudo_d.bajada2 as bajada2,recaudo_d.bajada3 as bajada3," +
                "FactAjus,ApliAjus,FactBaj1,FactSub2,FactSub3,ApliBaja,PorcBaj2,PorcBaj3 " +
                "FROM recaudo_m JOIN recaudo_d ON recaudo_d.recaudo_m_id = recaudo_m.id " +
                "join contador_ajuste as CJ on CJ.CodiVehi = '"+unidad+"' " +
                "WHERE recaudo_m.unidad ='"+unidad+"'  and recaudo_m.salida_m_id = "+vuelta+" group by unidad,hora order by unidad ASC"
            break;
        case 1:

            script =  "SELECT recaudo_m.unidad as unidad,recaudo_d.subida1 as subida1,recaudo_d.subida2 as subida2," +
                "recaudo_d.subida3 as subida3,recaudo_d.bajada1 as bajada1," +
                "recaudo_d.bajada2 as bajada2,recaudo_d.bajada3 as bajada3 " +
                "FROM recaudo_m JOIN recaudo_d ON recaudo_d.recaudo_m_id = recaudo_m.id " +
                "WHERE recaudo_m.unidad ='"+unidad+"' and recaudo_m.salida_m_id = "+vuelta+" group by unidad,hora order by unidad ASC"

            break;
    }


    return script;
}

/***********************************************************************/


function formatNumPuertasHabiles(objConteo,bd)
{

    for(var i=0;i<objConteo.length;i++)
    {
        if(getNumHabiles(bd) == 2){
            objConteo[i].setSubida3(0);
            objConteo[i].setBajada3(0);
        }else if(getNumHabiles(bd) == 1){
            objConteo[i].setSubida2(0);
            objConteo[i].setSubida3(0);
            objConteo[i].setBajada2(0);
            objConteo[i].setBajada3(0);
        }
    }
    return objConteo;
}


/**Puertas habiles**/
function getNumHabiles(bd_name)
{
    let num_puertas = 0;

    switch(bd_name) {
        case 'juanpablo':
            num_puertas =  3;
            break;
        case 'latina':
            num_puertas =  2;
            break;
        case 'liribamba':
            num_puertas =  3;
            break;
        case 'lujoturisa':
            num_puertas =  3;
            break;
        case 'mazul':
            num_puertas =  3;
            break;
        case 'oamazonica':
            num_puertas =  3;
            break;
        case 'prado-eco':
            num_puertas =  3;
            break;
        case 'puruha':
            num_puertas =  2;
            break;
        case 'transisa':
            num_puertas =  2;
            break;
        case 'trunsa':
            num_puertas =  3;
            break;
        case 'tungurahua':
            num_puertas =  3;
            break;
        case 'uambatena':
            num_puertas =  3;
            break;
        default:
            num_puertas =  3;
            break;
    }

    return num_puertas;
}

/**Bandera Requiere procedimiento**/
function getBanderaProceConteo(bd_name)
{
    let bandera  = 0;

    switch(bd_name) {
        case 'juanpablo':
            bandera =  0;
            break;
        case 'latina':
            bandera =  1;
            break;
        case 'liribamba':
            bandera =  0;
            break;
        case 'lujoturisa':
            bandera =  1;
            break;
        case 'mazul':
            bandera =  0;
            break;
        case 'oamazonica':
            bandera =  0;
            break;
        case 'prado-eco':
            bandera =  1;
            break;
        case 'puruha':
            bandera =  1;
            break;
        case 'transisa':
            bandera =  1;
            break;
        case 'trunsa':
            bandera =  1;
            break;
        case 'tungurahua':
            bandera =  1;
            break;
        case 'uambatena':
            bandera =  1;
            break;
        default:
            bandera =  1;
            break;
    }

    return bandera;
}

/**Tipo script de conteo de pasajero**/ //(VUELTA )
function getConteoPasajerosTipo(bd_name){
    let type  = 0;

    /** 0 -> sin conteo  ... 1 -> conteo(sin contador ajuste) .. 2 ->conteo (+contador ajuste)**/
    switch(bd_name) {
        case 'juanpablo':
        case 'latina':
        case 'lujoturisa':
        case 'mazul':
        case 'oamazonica':
        case 'prado-eco':
        case 'trunsa':
            type =  1;
            break;
        case 'liribamba':
        case 'puruha':
        case 'transisa':
        case 'tungurahua':
        case 'uambatena':
            type =  2;
            break;
        default:
            type =  0;
            break;
    }

    return type;
}


function getprocesoConteo(bd_name,objConteo)
{

    switch(bd_name){
        case 'uambatena':
        case 'latina':
        case 'transisa':
        case 'tungurahua':
        case 'puruha':
            return conteo_forma1(objConteo,bd_name);
            break;

        case 'liribamba':
            return conteo_forma2(objConteo);
            break;

        case 'prado-eco':
            return conteo_forma3(objConteo);
            break;

        case 'trunsa':
            return conteo_forma4(id_vuelta);
            break;
    }
}

/** union - latina - transisa - puruha - tungurahua **/

function conteo_forma1(objConteo,bd_name)
{

    for(var i=0;i<objConteo.length;i++)
    {
        var factSub2 = objConteo[i].getOContadorAjuste().getFactSub2();
        var factSub3 = objConteo[i].getOContadorAjuste().getFactSub3();
        var factBaja1 = objConteo[i].getOContadorAjuste().getFactBaj1();
        var factAjus = objConteo[i].getOContadorAjuste().getFactAjus();
        var aplibaja = objConteo[i].getOContadorAjuste().getApliBaja();
        var porcbaj2 = objConteo[i].getOContadorAjuste().getPorcBaj2();
        var porcbaj3 = objConteo[i].getOContadorAjuste().getPorcBaj3();
        var acuSubida1 = objConteo[i].getSubida1();
        var acuBajada2 = objConteo[i].getBajada2();
        var acuBajada3 = objConteo[i].getBajada3();
        var acuSubida2 = objConteo[i].getSubida2();
        var acuSubida3 = objConteo[i].getSubida3();
        var acuBajada1 = objConteo[i].getBajada1();
        var puerta2BajadaValorAporte = 0;
        var puerta3BajadaValorAporte= 0;
        var errorEnvio = 0;

        if(objConteo[i].getOContadorAjuste().getApliAjus()==1)
        {


            var valorfaltante=acuSubida1-acuBajada2-acuBajada3;
            var valorconsiderar=acuSubida1-valorfaltante;

            if(valorconsiderar!=0)
            {
                puerta2BajadaValorAporte=(acuBajada2*100)/valorconsiderar;
                puerta3BajadaValorAporte=(acuBajada3*100)/valorconsiderar;
            }

            let puerta2BajadaValorAjuste=(valorfaltante*puerta2BajadaValorAporte)/100;
            let puerta3BajadaValorAjuste=(valorfaltante*puerta3BajadaValorAporte)/100;
            let ajusteValorTotalPuerta2Bajada=(puerta2BajadaValorAjuste+factAjus)*factAjus;
            let ajusteValorTotalPuerta3Bajada=(puerta3BajadaValorAjuste+factAjus)*factAjus;

            let sumConteoOriginalAjuste2=0.95*(puerta2BajadaValorAjuste);
            let sumConteoOriginalAjuste3=0.95*(puerta3BajadaValorAjuste);
            let puertaError1=acuBajada2+sumConteoOriginalAjuste2;
            let puertaError2=acuBajada3+sumConteoOriginalAjuste3;

            let error = acuSubida1-puertaError1-puertaError2;

            if(error>0)
            {

                let eerr2 = 100-(error*100/acuSubida1);
                errorEnvio = 100-eerr2;

                objConteo[i].setError(errorEnvio)

                if (objConteo[i].getOContadorAjuste().getApliBaja()==1)
                {


                    if(bd_name == "latina"){

                        objConteo[i] =
                            latina_form(acuSubida1,acuSubida2,factSub2,acuBajada1,factBaja1
                                ,errorEnvio,porcbaj2,objConteo[i])

                    }
                    else{

                        objConteo[i].setSubida2(Math.round((acuSubida2*factSub2)))
                        objConteo[i].setSubida3(Math.round((acuSubida3*factSub3)))
                        objConteo[i].setBajada1(Math.round((acuBajada1*factBaja1)))
                        objConteo[i].setBajada2(Math.round(((acuSubida1*porcbaj2)/100)))
                        objConteo[i].setBajada3(Math.round(((acuSubida1*porcbaj3)/100)))

                    }

                }
            else
                {

                    if(bd_name == 'latina'){

                        objConteo[i] =
                            latina_form(acuSubida1,acuSubida2,factSub2,acuBajada1,factBaja1
                                ,errorEnvio,porcbaj2,objConteo[i]);

                    }
                    else{
                        objConteo[i].setSubida2(Math.round((acuSubida2*factSub2)));
                        objConteo[i].setSubida3(Math.round((acuSubida3*factSub3)));

                        objConteo[i].setBajada1(Math.round((acuBajada1*factBaja1)));
                        objConteo[i].setBajada2(Math.round((acuBajada2+ajusteValorTotalPuerta2Bajada)));
                        objConteo[i].setBajada3(Math.round((acuBajada3+ajusteValorTotalPuerta3Bajada)));

                    }
                }
            }
            else
            {
                errorEnvio=0;

                if(bd_name == 'latina')
                {

                    objConteo[i] =
                        latina_form(acuSubida1,acuSubida2,factSub2,acuBajada1,factBaja1
                            ,errorEnvio,porcbaj2,objConteo[i]);
                }else{

                    if (objConteo[i].getOContadorAjuste().getApliBaja()==1)
                    {
                        objConteo[i].setSubida2(Math.round((acuSubida2*factSub2)));
                        objConteo[i].setSubida3(Math.round((acuSubida3*factSub3)));

                        objConteo[i].setBajada1(Math.round((acuBajada1*factBaja1)));
                        objConteo[i].setBajada2(Math.round(((acuSubida1*porcbaj2)/100)));
                        objConteo[i].setBajada3(Math.round(((acuSubida1*porcbaj3)/100)));

                    }
                else {

                        objConteo[i].setSubida2(Math.round((acuSubida2*factSub2)));
                        objConteo[i].setSubida3(Math.round((acuSubida3*factSub3)));

                        objConteo[i].setBajada1(Math.round((acuBajada1*factBaja1)));
                        objConteo[i].setBajada2(Math.round((acuBajada2+ajusteValorTotalPuerta2Bajada)));
                        objConteo[i].setBajada3(Math.round((acuBajada3+ajusteValorTotalPuerta3Bajada)));

                    }
                }
            }
        }
        else {
            if (objConteo[i].getOContadorAjuste().getApliBaja()==1 && bd_name!='latina')
            {
                if(bd_name == 'transisa'){

                objConteo[i].setBajada1(Math.round((acuSubida1*(porcbaj2/100))));
                objConteo[i].setBajada2(Math.round((acuSubida1*(porcbaj3/100))));

            }
                else{

                objConteo[i].setBajada2(Math.round(((acuSubida1*porcbaj2)/100)));

                objConteo[i].setBajada3(Math.round(((acuSubida1*porcbaj3)/100)));
            }
            }else{
                objConteo[i].setBajada1(Math.round((acuSubida1*(porcbaj2/100))));
                objConteo[i].setBajada2(Math.round((acuSubida1*(porcbaj3/100))));
        }
    }

    }

    return objConteo;
}

/**liribamba**/
function conteo_forma2(objConteo)
{
    for(var i=0;i<objConteo.length;i++)
    {
        let valorfaltante=objConteo[i].getSubida1()-objConteo[i].getBajada2()-objConteo[i].getBajada3();
        let valorconsiderar=objConteo[i].getSubida1()-valorfaltante;

        if(valorconsiderar>0)
        {

            let subida2tot = objConteo[i].getSubida2();
            let subida3tot = objConteo[i].getSubida3();
            let baja1tot = objConteo[i].getBajada1();
            let baja2tot = objConteo[i].getBajada2();
            let baja3tot = objConteo[i].getBajada3();


            let puerta2BajadaValorAporte=(baja2tot*100)/valorconsiderar;
            let puerta3BajadaValorAporte=(baja3tot*100)/valorconsiderar;

            let puerta2BajadaValorAjuste=(valorfaltante*puerta2BajadaValorAporte)/100;
            let puerta3BajadaValorAjuste=(valorfaltante*puerta3BajadaValorAporte)/100;
            let ajusteValorTotalPuerta2Bajada=puerta2BajadaValorAjuste+objConteo[i].getOContadorAjuste()
                .getFactAjus();

            let ajusteValorTotalPuerta3Bajada=puerta3BajadaValorAjuste+objConteo[i].getOContadorAjuste()
                .getFactAjus();



            objConteo[i].setSubida2(Math.round((subida2tot*objConteo[i].getOContadorAjuste().getFactSub2())));
            objConteo[i].setSubida3(Math.round((subida3tot*objConteo[i].getOContadorAjuste()
                .getFactSub3())));
            objConteo[i].setBajada1(Math.round((baja1tot*objConteo[i].getOContadorAjuste()
                .getFactBaj1())));
            objConteo[i].setBajada2(Math.round((baja2tot+ajusteValorTotalPuerta2Bajada)));
            objConteo[i].setBajada3(Math.round((baja3tot+ajusteValorTotalPuerta3Bajada)));

        }
        else {

            var subida2tot = objConteo[i].getSubida2();
            var subida3tot = objConteo[i].getSubida3();
            var baja1tot = objConteo[i].getBajada1();

            objConteo[i].setSubida2(Math.round((subida2tot*objConteo[i].getOContadorAjuste().getFactSub2())));
            objConteo[i].setSubida3(Math.round((subida3tot*objConteo[i].getOContadorAjuste().getFactSub3())));
            objConteo[i].setBajada1(Math.round((baja1tot*objConteo[i].getOContadorAjuste().getFactBaj1())));
        }

    }

    return objConteo;
}

/**prado-eco**/
function conteo_forma3(objConteo)
{
    for(var i=0;i<objConteo.length;i++)
    {
        let valorfaltante=objConteo[i].getSubida1() - objConteo[i].getBajada2()-objConteo[i].getBajada3();
        let valorconsiderar=objConteo[i].getSubida1() - valorfaltante;

        let subida2tot = objConteo[i].getSubida2();
        let subida3tot = objConteo[i].getSubida3();
        let baja1tot = objConteo[i].getBajada1();
        let baja2tot = objConteo[i].getBajada2();
        let baja3tot = objConteo[i].getBajada3();
        let puerta2BajadaValorAporte = 0
        let puerta3BajadaValorAporte = 0

        if(valorconsiderar>0)
        {

            puerta2BajadaValorAporte = (baja2tot*100)/valorconsiderar;
            puerta3BajadaValorAporte =(baja3tot*100)/valorconsiderar;

        }


        let puerta2BajadaValorAjuste=(valorfaltante*puerta2BajadaValorAporte)/100;
        let puerta3BajadaValorAjuste=(valorfaltante*puerta3BajadaValorAporte)/100;
        let ajusteValorTotalPuerta2Bajada=puerta2BajadaValorAjuste;//+$oVueltas[$i]->getOConteoPasajeros()->getOContadorAjuste()->getFactAjus();
        let ajusteValorTotalPuerta3Bajada=puerta3BajadaValorAjuste;//+$oVueltas[$i]->getOConteoPasajeros()->getOContadorAjuste()->getFactAjus();

        objConteo[i].setBajada2(Math.round((baja2tot+ajusteValorTotalPuerta2Bajada)));
        objConteo[i].setBajada3(Math.round((baja3tot+ajusteValorTotalPuerta3Bajada)));


    }

    return objConteo;
}

/**especial-solo para trunsa**/
function conteo_forma4(objConteo)
{
    for(var i=0;i<objConteo.length;i++)
    {
        var subida1tot = objConteo[i].getSubida1();

        objConteo[i].setSubida1( subida1tot - Math.round((subida1tot*0.02)));
    }

    return objConteo;
}

function latina_form(acuSubida1,acuSubida2,factSub2,acuBajada1,
                     factBaja1,errorEnvio,porcbaj2,objConteo){

    var subida_1 =  acuSubida1;
    var subida_2 = Math.round((acuSubida2*factSub2))
    var bajada_1 = Math.round((acuBajada1*factBaja1))
    var bajada_2 = subida_1 + subida_2 - bajada_1;


    objConteo.setSubida2(subida_2);
    objConteo.setBajada1(bajada_1);
    objConteo.setBajada2(Math.round((bajada_2*porcbaj2)));


    return objConteo;
}


module.exports = {query_conteo_pasajeros_general,query_conteo_pasajeros_vuelta}