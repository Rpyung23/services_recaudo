let {config_pre_and_post_consulta} = require("../mysql/config_conteo")

let mysql = require("mysql");

let {objConn} = require("../mysql/config") /**CREA LA CONEXION ALA BD Y RETORNA CONN (UNA CONEXION)**/





let query_conteo_pasajeros_general = (code,fechaI,fechaF,unidad,callback)=>
{
    objConn(code).then((resolve)=>
    {
        let conn = resolve


        let objConfig =  config_pre_and_post_consulta(code)

        //console.log(`${objConfig}`)

        if(objConfig.status == 200)
        {

            conn.query( unidad=="*" ? script_conteo_all(objConfig.script_conteo,fechaI,fechaF) : script_conteo(objConfig.script_conteo,unidad,fechaI,fechaF)
                ,function(error,results,fields)
                {

                    if(error){
                        callback(error,null)
                    }else
                    {
                        let objVect = []

                        for(var i = 0;i<results.length;i++)
                        {
                            var obj = {
                                subida_1:0,
                                subida_2:0,
                                subida_3:0,
                                bajada_1:0,
                                bajada_2:0,
                                bajada_3:0,
                                FactAjus:0,
                                ApliAjus:0,
                                FactBaj1:0,
                                FactSub2:0,
                                FactSub3:0,
                                ApliBaja:0,
                                PorcBaj2:0,
                                PorcBaj3:0

                            }

                            obj.unidad = results[i].unidad
                            obj.subida_1 = results[i].subida1
                            obj.subida_2 = results[i].subida2
                            obj.subida_3 = results[i].subida3
                            obj.bajada_1 = results[i].bajada1
                            obj.bajada_2 = results[i].bajada2
                            obj.bajada_3 = results[i].bajada3



                            if(objConfig.script_conteo == 1)
                            {
                                obj.FactAjus=results[i].FactAjus
                                obj.ApliAjus=results[i].ApliAjus
                                obj.FactBaj1=results[i].FactBaj1
                                obj.FactSub2=results[i].FactSub2
                                obj.FactSub3=results[i].FactSub3
                                obj.ApliBaja=results[i].ApliBaja
                                obj.PorcBaj2=results[i].PorcBaj2
                                obj.PorcBaj3=results[i].PorcBaj3
                            }

                            objVect.push(obj)

                        }

                        if(objConfig.bandera_post_conteo==1)
                        {
                            //console.log(objVect)

                            var datos = datos_procesados(objVect,objConfig.post_procedimiento)

                            callback(null,format_puertas_hibilies(datos,objConfig.puertas_habiles))
                        }else{

                            let datosVect = []

                            for (var i=0;i<objVect.length;i++)
                            {
                                var datos  = {
                                    unidad:objVect[i].unidad,
                                    subida1:objVect[i].subida_1,
                                    subida2:objVect[i].subida_2,
                                    subida3:objVect[i].subida_3,
                                    bajada1:objVect[i].bajada_1,
                                    bajada2:objVect[i].bajada_2,
                                    bajada3:objVect[i].bajada_3,
                                    error:0
                                }
                                datosVect.push(datos)
                            }


                            callback(null,format_puertas_hibilies(datosVect,objConfig.puertas_habiles))
                        }
                    }
            })

        }else{
            callback({
                sqlMessage:'Error status null'
            },null)
        }


    }).catch((reject)=>{
        callback({
            sqlMessage:'Error en query Conn Dinamica'
        },null)
    })
}



let query_conteo_pasajeros_vuelta = (code,vuelta,unidad,callback)=>
{
    objConn(code).then((resolve)=>
    {
        let conn = resolve


        let objConfig =  config_pre_and_post_consulta(code)

        //console.log(`${objConfig}`)

        if(objConfig.status == 200)
        {

            conn.query(script_conteo_vuelta(objConfig.script_conteo,unidad,vuelta)
                ,function(error,results,fields)
                {

                    if(error){
                        callback(error,null)
                    }else
                    {
                        let objVect = []

                        for(var i = 0;i<results.length;i++)
                        {
                            var obj = {
                                subida_1:0,
                                subida_2:0,
                                subida_3:0,
                                bajada_1:0,
                                bajada_2:0,
                                bajada_3:0,
                                FactAjus:0,
                                ApliAjus:0,
                                FactBaj1:0,
                                FactSub2:0,
                                FactSub3:0,
                                ApliBaja:0,
                                PorcBaj2:0,
                                PorcBaj3:0

                            }

                            obj.unidad = results[i].unidad
                            obj.subida_1 = results[i].subida1
                            obj.subida_2 = results[i].subida2
                            obj.subida_3 = results[i].subida3
                            obj.bajada_1 = results[i].bajada1
                            obj.bajada_2 = results[i].bajada2
                            obj.bajada_3 = results[i].bajada3



                            if(objConfig.script_conteo == 1)
                            {
                                obj.FactAjus=results[i].FactAjus
                                obj.ApliAjus=results[i].ApliAjus
                                obj.FactBaj1=results[i].FactBaj1
                                obj.FactSub2=results[i].FactSub2
                                obj.FactSub3=results[i].FactSub3
                                obj.ApliBaja=results[i].ApliBaja
                                obj.PorcBaj2=results[i].PorcBaj2
                                obj.PorcBaj3=results[i].PorcBaj3
                            }

                            objVect.push(obj)

                        }

                        if(objConfig.bandera_post_conteo==1)
                        {
                            //console.log(objVect)

                            var datos = datos_procesados(objVect,objConfig.post_procedimiento)

                            callback(null,format_puertas_hibilies(datos,objConfig.puertas_habiles))
                        }else{

                            let datosVect = []

                            for (var i=0;i<objVect.length;i++)
                            {
                                var datos  = {
                                    unidad:objVect[i].unidad,
                                    subida1:objVect[i].subida_1,
                                    subida2:objVect[i].subida_2,
                                    subida3:objVect[i].subida_3,
                                    bajada1:objVect[i].bajada_1,
                                    bajada2:objVect[i].bajada_2,
                                    bajada3:objVect[i].bajada_3,
                                    error:0
                                }
                                datosVect.push(datos)
                            }


                            callback(null,format_puertas_hibilies(datosVect,objConfig.puertas_habiles))
                        }
                    }
                })

        }else{
            callback({
                sqlMessage:'Error status null'
            },null)
        }


    }).catch((reject)=>{
        callback({
            sqlMessage:'Error en query Conn Dinamica'
        },null)
    })
}


function script_conteo_all(valor,fechaI,fechaF)
{

    let querys = ""

    switch(valor){

        case 1:
            querys =  "SELECT recaudo_m.unidad as unidad,sum(recaudo_d.subida1) as subida1,sum(recaudo_d.subida2) as subida2,\n" +
                "sum(recaudo_d.subida3) as subida3,sum(recaudo_d.bajada1) as bajada1," +
                "sum(recaudo_d.bajada2) as bajada2,sum(recaudo_d.bajada3) as bajada3," +
                "FactAjus,ApliAjus,FactBaj1,FactSub2,FactSub3,ApliBaja,PorcBaj2,PorcBaj3 " +
                "FROM recaudo_m JOIN recaudo_d ON recaudo_d.recaudo_m_id = recaudo_m.id " +
                "join contador_ajuste as CJ on CJ.CodiVehi = recaudo_m.unidad " +
                "WHERE  recaudo_m.hora between '"+fechaI+"' " +
                "and '"+fechaF+"' group by unidad order by unidad ASC"
            break;
        case 2:

            querys =  "SELECT recaudo_m.unidad as unidad,sum(recaudo_d.subida1) as subida1,sum(recaudo_d.subida2) as subida2," +
                "sum(recaudo_d.subida3) as subida3,sum(recaudo_d.bajada1) as bajada1," +
                "sum(recaudo_d.bajada2) as bajada2,sum(recaudo_d.bajada3) as bajada3 " +
                "FROM recaudo_m JOIN recaudo_d ON recaudo_d.recaudo_m_id = recaudo_m.id " +
                "WHERE  recaudo_m.hora between '"+fechaI+"' and '"+fechaF+"' group by unidad order by unidad ASC"

            break;
    }

    console.log(querys)
    return querys
}

function script_conteo(valor,unidad,fechaI,fechaF)
{

    let querys = ""

    switch(valor){

        case 1:
            querys =  "SELECT recaudo_m.unidad as unidad,sum(recaudo_d.subida1) as subida1,sum(recaudo_d.subida2) as subida2,\n" +
                "sum(recaudo_d.subida3) as subida3,sum(recaudo_d.bajada1) as bajada1," +
                "sum(recaudo_d.bajada2) as bajada2,sum(recaudo_d.bajada3) as bajada3," +
                "FactAjus,ApliAjus,FactBaj1,FactSub2,FactSub3,ApliBaja,PorcBaj2,PorcBaj3 " +
                "FROM recaudo_m JOIN recaudo_d ON recaudo_d.recaudo_m_id = recaudo_m.id " +
                "join contador_ajuste as CJ on CJ.CodiVehi = '"+unidad+"' " +
                "WHERE recaudo_m.unidad ='"+unidad+"' AND recaudo_m.hora between '"+fechaI+"' " +
                "and '"+fechaF+"' group by unidad order by unidad ASC"
            break;
        case 2:

            querys =  "SELECT recaudo_m.unidad as unidad,sum(recaudo_d.subida1) as subida1,sum(recaudo_d.subida2) as subida2," +
                "sum(recaudo_d.subida3) as subida3,sum(recaudo_d.bajada1) as bajada1," +
                "sum(recaudo_d.bajada2) as bajada2,sum(recaudo_d.bajada3) as bajada3 " +
                "FROM recaudo_m JOIN recaudo_d ON recaudo_d.recaudo_m_id = recaudo_m.id " +
                "WHERE recaudo_m.unidad ='"+unidad+"' AND recaudo_m.hora " +
                "between '"+fechaI+"' and '"+fechaF+"' group by unidad order by unidad ASC"

            break;
    }

    console.log(querys)
    return querys
}


function script_conteo_vuelta(valor,unidad,vuelta)
{

    let querys = ""

    switch(valor){

        case 1:
            querys =  "SELECT recaudo_m.unidad as unidad,sum(recaudo_d.subida1) as subida1,sum(recaudo_d.subida2) as subida2,\n" +
                "sum(recaudo_d.subida3) as subida3,sum(recaudo_d.bajada1) as bajada1," +
                "sum(recaudo_d.bajada2) as bajada2,sum(recaudo_d.bajada3) as bajada3," +
                "FactAjus,ApliAjus,FactBaj1,FactSub2,FactSub3,ApliBaja,PorcBaj2,PorcBaj3 " +
                "FROM recaudo_m JOIN recaudo_d ON recaudo_d.recaudo_m_id = recaudo_m.id " +
                "join contador_ajuste as CJ on CJ.CodiVehi = '"+unidad+"' " +
                "WHERE recaudo_m.unidad ='"+unidad+"'  and recaudo_m.salida_m_id = "+vuelta+" group by unidad order by unidad ASC"
            break;
        case 2:

            querys =  "SELECT recaudo_m.unidad as unidad,sum(recaudo_d.subida1) as subida1,sum(recaudo_d.subida2) as subida2," +
                "sum(recaudo_d.subida3) as subida3,sum(recaudo_d.bajada1) as bajada1," +
                "sum(recaudo_d.bajada2) as bajada2,sum(recaudo_d.bajada3) as bajada3 " +
                "FROM recaudo_m JOIN recaudo_d ON recaudo_d.recaudo_m_id = recaudo_m.id " +
                "WHERE recaudo_m.unidad ='"+unidad+"' and recaudo_m.salida_m_id = "+vuelta+" group by unidad order by unidad ASC"

            break;
    }

    console.log(querys)
    return querys
}

function datos_procesados(objeto,codigo_procedimiento)
{
    /*var obj = {
        subida1:0,
        subida2:0,
        subida3:0,
        bajada1:0,
        bajada2:0,
        bajada3:0,
        error:0
    }*/

    //console.log(objeto)




    let objectoA = objeto
    let datos = null;

    switch(codigo_procedimiento)
    {
        case 1:
            console.log("Forma de procesamiento conteo 1")
            datos = forma_procedimiento_1(objectoA)
            break;
        case 2:
            console.log("Forma de procesamiento conteo 2")
            datos = forma_procedimiento_2(objectoA)
            break;
        case 3:
            console.log("Forma de procesamiento conteo 3")
            datos = forma_procedimiento_3(objectoA)
            break;
        case 4:
            console.log("Forma de procesamiento conteo 4")
            datos = forma_procedimiento_4(objectoA)
            break;
            case 5:
            console.log("Forma de procesamiento conteo 5")
            datos = forma_procedimiento_5(objeto)
            break;
    }
    //console.log(datos)

    return datos;
}

/**uambatena - puruha**/
function forma_procedimiento_1(objeto)
{
    /**
     *
     *         $factSub2=$lectorAjustes['FactSub2'];
     $bandera=$lectorAjustes['ApliAjus'];
     $factSub3=$lectorAjustes['FactSub3'];
     $factBaja1=$lectorAjustes['FactBaj1'];
     $factAjus=$lectorAjustes['FactAjus'];
     $aplibaja=$lectorAjustes['ApliBaja'];
     $porcbaj2 = $lectorAjustes['PorcBaj2'];
     $porcbaj3 = $lectorAjustes['PorcBaj3'];
     *
     * **/

    /**
     * obj.subida_1 = results[i].subida1
     obj.subida_2 = results[i].subida2
     obj.subida_3 = results[i].subida3
     obj.bajada_1 = results[i].bajada1
     obj.bajada_2 = results[i].bajada2
     obj.bajada_3 = results[i].bajada3
     *
     * **/


    let datosVectorResultConteo = []

    for(var i=0;i<objeto.length;i++)
    {
        let puerta2BajadaValorAporte = 0
        let puerta3BajadaValorAporte = 0

        let valorfaltante = objeto[i].subida_1 - objeto[i].bajada_2 - objeto[i].bajada_3;

        let valorconsiderar=objeto[i].subida_1-valorfaltante;

        if(valorconsiderar!=0)
        {
            puerta2BajadaValorAporte=(objeto[i].bajada_2*100)/valorconsiderar;
            puerta3BajadaValorAporte=(objeto[i].bajada_3*100)/valorconsiderar;
        }

        let puerta2BajadaValorAjuste=(valorfaltante*puerta2BajadaValorAporte)/100;
        let puerta3BajadaValorAjuste=(valorfaltante*puerta3BajadaValorAporte)/100;

        let ajusteValorTotalPuerta2Bajada=(puerta2BajadaValorAjuste+objeto[i].FactAjus)*objeto[i].FactAjus;
        let ajusteValorTotalPuerta3Bajada=(puerta3BajadaValorAjuste+objeto[i].FactAjus)*objeto[i].FactAjus;

        let sumConteoOriginalAjuste2=0.95*(puerta2BajadaValorAjuste);
        let sumConteoOriginalAjuste3=0.95*(puerta3BajadaValorAjuste);

        let puertaError1=objeto[i].bajada_2+sumConteoOriginalAjuste2;
        let puertaError2=objeto[i].bajada_3+sumConteoOriginalAjuste3;

        let error= objeto[i].subida_1-puertaError1-puertaError2;
        let errorEnvio = 0

        //console.log("1.1")
        let eerr2 = 100-(error*100/objeto[i].subida_1);
        var auxE = (100-(eerr2)).toFixed(2)
        errorEnvio = Number(auxE);

        if(errorEnvio<=0){
            errorEnvio = 0
        }

        if(objeto[i].ApliAjus == 1)
        {
            console.log("1")

            if(error>0)
            {

                if (objeto[i].ApliBaja==1)
                {
                    /*$arr =  array_map('utf8_encode', array('error'=>round($errorEnvio,2),'subida1' => $acuSubida1,
                    'subida2' =>intval($acuSubida2*$factSub2),'subida3' => intval($acuSubida3*$factSub3),
                    'bajada1' =>intval($acuBajada1*$factBaja1),'bajada2' =>
                    intval(round(($acuSubida1*$porcbaj2)/100,0)),
                        'bajada3' =>intval(round(($acuSubida1*$porcbaj3)/100,0))));*/

                    var datos = {
                        unidad:objeto[i].unidad,
                        subida1:Math.round(objeto[i].subida_1),
                        subida2:Math.round(objeto[i].subida_2*objeto[i].FactSub2),
                        subida3:Math.round(objeto[i].subida_3*objeto[i].FactSub3),
                        bajada1:Math.round(objeto[i].bajada_1*objeto[i].FactBaj1),
                        bajada2:Math.round((objeto[i].subida_1*objeto[i].FactBaj2)/100),
                        bajada3:Math.round((objeto[i].subida_1*objeto[i].FactBaj3)/100),
                        error:errorEnvio
                    }

                    datosVectorResultConteo.push(datos)

                }else
                {
                    /*$arr = array_map('utf8_encode', array('error'=>round($errorEnvio,2),'subida1' => $acuSubida1,
                    'subida2' =>intval($acuSubida2*$factSub2),'subida3' => intval($acuSubida3*$factSub3),
                    'bajada1' =>intval($acuBajada1*$factBaja1),'bajada2' =>intval($acuBajada2+$ajusteValorTotalPuerta2Bajada),
                    'bajada3' =>intval($acuBajada3+$ajusteValorTotalPuerta3Bajada)));*/

                    var datos = {
                        unidad:objeto[i].unidad,
                        subida1:Math.round(objeto[i].subida_1),
                        subida2:Math.round(objeto[i].subida_2*objeto[i].FactSub2),
                        subida3:Math.round(objeto[i].subida_3*objeto[i].FactSub3),
                        bajada1:Math.round(objeto[i].bajada_1*objeto[i].FactBaj1),
                        bajada2:Math.round(objeto[i].bajada_2+ajusteValorTotalPuerta2Bajada),
                        bajada3:Math.round(objeto[i].bajada_3+ajusteValorTotalPuerta3Bajada),
                        error:errorEnvio
                    }

                    datosVectorResultConteo.push(datos)
                }
            }else
            {
                console.log("1.2")
                /*$errorEnvio=0;*/
                if (objeto[i].ApliBaja==1)
                {
                    /*$arr = array_map('utf8_encode',array('error'=>$errorEnvio,'subida1' => $acuSubida1,
                    'subida2' =>intval($acuSubida2*$factSub2),'subida3' => intval($acuSubida3*$factSub3),
                    'bajada1' =>intval($acuBajada1*$factBaja1),'bajada2' =>intval(round(($acuSubida1*$porcbaj2)/100,0)),
                    'bajada3' =>intval(round(($acuSubida1*$porcbaj3)/100,0))));*/

                    var datos = {
                        unidad:objeto[i].unidad,
                        subida1:Math.round(objeto[i].subida_1),
                        subida2:Math.round(objeto[i].subida_2*objeto[i].FactSub2),
                        subida3:Math.round(objeto[i].subida_3*objeto[i].FactSub3),
                        bajada1:Math.round(objeto[i].bajada_1*objeto[i].FactBaj1),
                        bajada2:Math.round((objeto[i].subida_1*objeto[i].PorcBaj2)/100),
                        bajada3:Math.round((objeto[i].subida_1*objeto[i].PorcBaj3)/100),
                        error:errorEnvio
                    }

                    console.log("1.2 return 1")
                    datosVectorResultConteo.push(datos)

                }else
                {
                    /*$arr = array_map('utf8_encode', array('error'=>$errorEnvio,'subida1' => $acuSubida1,
                    'subida2' =>intval($acuSubida2*$factSub2),'subida3' => intval($acuSubida3*$factSub3),
                    'bajada1' =>intval($acuBajada1*$factBaja1),'bajada2' =>intval($acuBajada2+$ajusteValorTotalPuerta2Bajada),
                    'bajada3' =>intval($acuBajada3+$ajusteValorTotalPuerta3Bajada)));*/

                    var datos = {
                        unidad:objeto[i].unidad,
                        subida1:Math.round(objeto[i].subida_1),
                        subida2:Math.round(objeto[i].subida_2*objeto[i].FactSub2),
                        subida3:Math.round(objeto[i].subida_3*objeto[i].FactSub3),
                        bajada1:Math.round(objeto[i].bajada_1*objeto[i].FactBaj1),
                        bajada2:Math.round(objeto[i].bajada_2+ajusteValorTotalPuerta2Bajada),
                        bajada3:Math.round(objeto[i].bajada_3+ajusteValorTotalPuerta3Bajada),
                        error:errorEnvio
                    }
                    console.log("1.2 return 2")
                    datosVectorResultConteo.push(datos)
                }
            }
        }
        else
        {
            console.log("2")
            /*var errorEnvio=0;*/

            if (objeto[i].ApliBaja==1)
            {
                /*$arr = array_map('utf8_encode',array('error'=>$errorEnvio,'subida1' => $acuSubida1,
                'subida2' =>intval($acuSubida2*$factSub2),'subida3' => intval($acuSubida3*$factSub3),
                'bajada1' =>intval($acuBajada1*$factBaja1),'bajada2' =>intval(round(($acuSubida1*$porcbaj2)/100,0)),
                'bajada3' =>intval(round(($acuSubida1*$porcbaj3)/100,0))));*/

                var datos = {
                    unidad:objeto[i].unidad,
                    subida1:Math.round(objeto[i].subida_1),
                    subida2:Math.round(objeto[i].subida_2*objeto[i].FactSub2),
                    subida3:Math.round(objeto[i].subida_3*objeto[i].FactSub3),
                    bajada1:Math.round(objeto[i].bajada_1*objeto[i].FactBaj1),
                    bajada2:Math.round((objeto[i].subida_1*objeto[i].PorcBaj2)/100),
                    bajada3:Math.round((objeto[i].subida_1*objeto[i].PorcBaj3)/100),
                    error:errorEnvio
                }

                datosVectorResultConteo.push(datos)
            }
            else
            {
                /*$arr = array_map('utf8_encode', array('error'=>$errorEnvio,'subida1' => $acuSubida1,
                'subida2' =>intval($acuSubida2*$factSub2),'subida3' => intval($acuSubida3*$factSub3),
                'bajada1' =>intval($acuBajada1*$factBaja1),'bajada2' =>intval($acuBajada2+$ajusteValorTotalPuerta2Bajada),
                'bajada3' =>intval($acuBajada3+$ajusteValorTotalPuerta3Bajada)));*/

                var datos = {
                    unidad:objeto[i].unidad,
                    subida1:objeto[i].subida_1,
                    subida2:objeto[i].subida_2,
                    subida3:objeto[i].subida_3,
                    bajada1:objeto[i].bajada_1,
                    bajada2:objeto[i].bajada_2,
                    bajada3:objeto[i].bajada_3,
                    error:errorEnvio
                }

                datosVectorResultConteo.push(datos)
            }
        }
    }

    return datosVectorResultConteo;
}

/*********************************************************************************************************/
/**puruha**/
function forma_procedimiento_2(objeto){


    let datosVectContador = []

    for(var i=0;i<objeto.length;i++)
    {
        var datos = {
            unidad:objeto[i].unidad,
            subida1: Math.round(objeto[i].subida_1 - Math.round(objeto[i].subida_1*0.02)),
            subida2:objeto[i].subida_2,
            subida3:objeto[i].subida_3,
            bajada1:objeto[i].bajada_1,
            bajada2:objeto[i].bajada_2,
            bajada3:objeto[i].bajada_3,
            error:0
        }

        datosVectContador.push(datos)

    }

    return datosVectContador
}

/********************************************************************************************************/

/***transisa (revision de codigo en proceso)*/
function forma_procedimiento_3(objeto)
{
    /**
     *
     *         $factSub2=$lectorAjustes['FactSub2'];
     $bandera=$lectorAjustes['ApliAjus'];
     $factSub3=$lectorAjustes['FactSub3'];
     $factBaja1=$lectorAjustes['FactBaj1'];
     $factAjus=$lectorAjustes['FactAjus'];
     $aplibaja=$lectorAjustes['ApliBaja'];
     $porcbaj2 = $lectorAjustes['PorcBaj2'];
     $porcbaj3 = $lectorAjustes['PorcBaj3'];
     *
     * **/

    /**
     * obj.subida_1 = results[i].subida1
     obj.subida_2 = results[i].subida2
     obj.subida_3 = results[i].subida3
     obj.bajada_1 = results[i].bajada1
     obj.bajada_2 = results[i].bajada2
     obj.bajada_3 = results[i].bajada3
     *
     * **/

    let datosVectContador = []

    for(var i=0;i<objeto.length;i++)
    {
        let puerta2BajadaValorAporte = 0
        let puerta3BajadaValorAporte = 0

        let valorfaltante = objeto[i].subida_1 - objeto[i].bajada_2 - objeto[i].bajada_3;

        let valorconsiderar=objeto[i].subida_1-valorfaltante;

        if(valorconsiderar!=0)
        {
            puerta2BajadaValorAporte=(objeto[i].bajada_2*100)/valorconsiderar;
            puerta3BajadaValorAporte=(objeto[i].bajada_3*100)/valorconsiderar;
        }

        let puerta2BajadaValorAjuste=(valorfaltante*puerta2BajadaValorAporte)/100;
        let puerta3BajadaValorAjuste=(valorfaltante*puerta3BajadaValorAporte)/100;

        let ajusteValorTotalPuerta2Bajada=(puerta2BajadaValorAjuste+objeto[i].FactAjus)*objeto[i].FactAjus;
        let ajusteValorTotalPuerta3Bajada=(puerta3BajadaValorAjuste+objeto[i].FactAjus)*objeto[i].FactAjus;

        let sumConteoOriginalAjuste2=0.95*(puerta2BajadaValorAjuste);
        let sumConteoOriginalAjuste3=0.95*(puerta3BajadaValorAjuste);

        let puertaError1=objeto[i].bajada_2+sumConteoOriginalAjuste2;
        let puertaError2=objeto[i].bajada_3+sumConteoOriginalAjuste3;

        let error= objeto[i].subida_1-puertaError1-puertaError2;
        let errorEnvio = 0

        //console.log("1.1")
        let eerr2 = 100-(error*100/objeto[i].subida_1);
        var auxE = (100-(eerr2)).toFixed(2)
        errorEnvio = Number(auxE);

        if(errorEnvio<=0){
            errorEnvio = 0
        }

        if(objeto[i].ApliAjus == 1)
        {
            console.log("1")

            if(error>0)
            {

                if (objeto[i].ApliBaja==1)
                {
                    /*$arr =  array_map('utf8_encode', array('error'=>round($errorEnvio,2),'subida1' => $acuSubida1,
                    'subida2' =>intval($acuSubida2*$factSub2),'subida3' => intval($acuSubida3*$factSub3),
                    'bajada1' =>intval($acuBajada1*$factBaja1),'bajada2' =>
                    intval(round(($acuSubida1*$porcbaj2)/100,0)),
                        'bajada3' =>intval(round(($acuSubida1*$porcbaj3)/100,0))));*/

                    var datos = {
                        unidad:objeto[i].unidad,
                        subida1:Math.round(objeto[i].subida_1),
                        subida2:Math.round(objeto[i].subida_2*objeto[i].FactSub2),
                        subida3:Math.round(objeto[i].subida_3*objeto[i].FactSub3),
                        bajada1:Math.round(objeto[i].bajada_1*objeto[i].FactBaj1),
                        bajada2:Math.round((objeto[i].subida_1*objeto[i].FactBaj2)/100),
                        bajada3:Math.round((objeto[i].subida_1*objeto[i].FactBaj3)/100),
                        error:errorEnvio
                    }

                    datosVectContador.push(datos)

                }else
                {
                    /*$arr = array_map('utf8_encode', array('error'=>round($errorEnvio,2),'subida1' => $acuSubida1,
                    'subida2' =>intval($acuSubida2*$factSub2),'subida3' => intval($acuSubida3*$factSub3),
                    'bajada1' =>intval($acuBajada1*$factBaja1),'bajada2' =>intval($acuBajada2+$ajusteValorTotalPuerta2Bajada),
                    'bajada3' =>intval($acuBajada3+$ajusteValorTotalPuerta3Bajada)));*/

                    var datos = {
                        unidad:objeto[i].unidad,
                        subida1:Math.round(objeto[i].subida_1),
                        subida2:Math.round(objeto[i].subida_2*objeto[i].FactSub2),
                        subida3:Math.round(objeto[i].subida_3*objeto[i].FactSub3),
                        bajada1:Math.round(objeto[i].bajada_1*objeto[i].FactBaj1),
                        bajada2:Math.round(objeto[i].bajada_2+ajusteValorTotalPuerta2Bajada),
                        bajada3:Math.round(objeto[i].bajada_3+ajusteValorTotalPuerta3Bajada),
                        error:errorEnvio
                    }

                    datosVectContador.push(datos)
                }
            }else
            {
                console.log("1.2")
                /*$errorEnvio=0;*/
                if (objeto[i].ApliBaja==1)
                {
                    /*$arr = array_map('utf8_encode',array('error'=>$errorEnvio,'subida1' => $acuSubida1,
                    'subida2' =>intval($acuSubida2*$factSub2),'subida3' => intval($acuSubida3*$factSub3),
                    'bajada1' =>intval($acuBajada1*$factBaja1),'bajada2' =>intval(round(($acuSubida1*$porcbaj2)/100,0)),
                    'bajada3' =>intval(round(($acuSubida1*$porcbaj3)/100,0))));*/

                    var datos = {
                        unidad:objeto[i].unidad,
                        subida1:Math.round(objeto[i].subida_1),
                        subida2:Math.round(objeto[i].subida_2*objeto[i].FactSub2),
                        subida3:Math.round(objeto[i].subida_3*objeto[i].FactSub3),
                        bajada1:Math.round(objeto[i].bajada_1*objeto[i].FactBaj1),
                        bajada2:Math.round((objeto[i].subida_1*objeto[i].PorcBaj2)/100),
                        bajada3:Math.round((objeto[i].subida_1*objeto[i].PorcBaj3)/100),
                        error:errorEnvio
                    }

                    console.log("1.2 return 1")
                    datosVectContador.push(datos)

                }else
                {
                    /*$arr = array_map('utf8_encode', array('error'=>$errorEnvio,'subida1' => $acuSubida1,
                    'subida2' =>intval($acuSubida2*$factSub2),'subida3' => intval($acuSubida3*$factSub3),
                    'bajada1' =>intval($acuBajada1*$factBaja1),'bajada2' =>intval($acuBajada2+$ajusteValorTotalPuerta2Bajada),
                    'bajada3' =>intval($acuBajada3+$ajusteValorTotalPuerta3Bajada)));*/

                    var datos = {
                        unidad:objeto[i].unidad,
                        subida1:Math.round(objeto[i].subida_1),
                        subida2:Math.round(objeto[i].subida_2*objeto[i].FactSub2),
                        subida3:Math.round(objeto[i].subida_3*objeto[i].FactSub3),
                        bajada1:Math.round(objeto[i].bajada_1*objeto[i].FactBaj1),
                        bajada2:Math.round(objeto[i].bajada_2+ajusteValorTotalPuerta2Bajada),
                        bajada3:Math.round(objeto[i].bajada_3+ajusteValorTotalPuerta3Bajada),
                        error:errorEnvio
                    }
                    console.log("1.2 return 2")
                    datosVectContador.push(datos)
                }
            }
        }
        else
        {
            console.log("2")
            /*var errorEnvio=0;*/

            if (objeto[i].ApliBaja==1)
            {
                /*$arr = array_map('utf8_encode',array('error'=>$errorEnvio,'subida1' => $acuSubida1,
                'subida2' =>intval($acuSubida2*$factSub2),'subida3' => intval($acuSubida3*$factSub3),
                'bajada1' =>intval($acuBajada1*$factBaja1),'bajada2' =>intval(round(($acuSubida1*$porcbaj2)/100,0)),
                'bajada3' =>intval(round(($acuSubida1*$porcbaj3)/100,0))));*/

                console.log("2.1")
                var datos = {
                    unidad:objeto[i].unidad,
                    subida1:Math.round(objeto[i].subida_1),
                    subida2:Math.round(objeto[i].subida_2),
                    subida3:Math.round(objeto[i].subida_3),
                    bajada1:Math.round(objeto[i].subida_1*(objeto[i].PorcBaj2/100)),
                    bajada2:Math.round(objeto[i].subida_1*(objeto[i].PorcBaj3/100)),
                    bajada3:Math.round(objeto[i].bajada_3),
                    error:errorEnvio
                }

                datosVectContador.push(datos)
            }
            else
            {
                /*$arr = array_map('utf8_encode', array('error'=>$errorEnvio,'subida1' => $acuSubida1,
                'subida2' =>intval($acuSubida2*$factSub2),'subida3' => intval($acuSubida3*$factSub3),
                'bajada1' =>intval($acuBajada1*$factBaja1),'bajada2' =>intval($acuBajada2+$ajusteValorTotalPuerta2Bajada),
                'bajada3' =>intval($acuBajada3+$ajusteValorTotalPuerta3Bajada)));*/
                console.log("2.2")
                var datos = {
                    unidad:objeto[i].unidad,
                    subida1:Math.round(objeto[i].subida_1),
                    subida2:Math.round(objeto[i].subida_2),
                    subida3:Math.round(objeto[i].subida_3),
                    bajada1:Math.round(objeto[i].subida_1*(objeto[i].PorcBaj2/100)),
                    bajada2:Math.round(objeto[i].subida_1*(objeto[i].PorcBaj3/100)),
                    bajada3:Math.round(objeto[i].bajada_3),
                    error:errorEnvio
                }

                datosVectContador.push(datos)
            }
        }

    }

    return datosVectContador

}

/*********************************************************************************************************/
/**prado-eco **/
function forma_procedimiento_4(objeto)
{
    /**
     *
     *         $factSub2=$lectorAjustes['FactSub2'];
     $bandera=$lectorAjustes['ApliAjus'];
     $factSub3=$lectorAjustes['FactSub3'];
     $factBaja1=$lectorAjustes['FactBaj1'];
     $factAjus=$lectorAjustes['FactAjus'];
     $aplibaja=$lectorAjustes['ApliBaja'];
     $porcbaj2 = $lectorAjustes['PorcBaj2'];
     $porcbaj3 = $lectorAjustes['PorcBaj3'];
     *
     * **/

    /**
     * obj.subida_1 = results[i].subida1
     obj.subida_2 = results[i].subida2
     obj.subida_3 = results[i].subida3
     obj.bajada_1 = results[i].bajada1
     obj.bajada_2 = results[i].bajada2
     obj.bajada_3 = results[i].bajada3
     *
     * **/


    let vectorDatosConteo = []


    for(let i=0;i<objeto.length;i++)
    {
        let valorfaltante=objeto[i].subida_1 - objeto[i].bajada_2 - objeto[i].bajada_3
        let valorconsiderar=objeto[i].subida_1-valorfaltante;
        let puerta2BajadaValorAporte = 0
        let puerta3BajadaValorAporte = 0
        if(valorconsiderar>0)
        {
            puerta2BajadaValorAporte=(objeto[i].bajada_2*100)/valorconsiderar;
            puerta3BajadaValorAporte=(objeto[i].bajada_3*100)/valorconsiderar;
        }/*else
       {
           $puerta2BajadaValorAporte=($acuBajada2*100);
               $puerta3BajadaValorAporte=($acuBajada3*100);
       }*/
        let puerta2BajadaValorAjuste=(valorfaltante*puerta2BajadaValorAporte)/100;
        let puerta3BajadaValorAjuste=(valorfaltante*puerta3BajadaValorAporte)/100;
        let ajusteValorTotalPuerta2Bajada=puerta2BajadaValorAjuste;//+$factAjus;
        let ajusteValorTotalPuerta3Bajada=puerta3BajadaValorAjuste;//+$factAjus;
        /*echo "Subida 1 : ".$acuSubida1;
        echo "Subida 2 : ".$acuSubida2;
        echo "Subida 3 : ".$acuSubida3;
        echo "Bajada 1 : ".$acuBajada1;
        echo "Bajada 2 : ".$acuBajada2;
        echo "Bajada 3 : ".$acuBajada3;
        /*for($i=0;$i<sizeof($miVectorobjetos);$i++)
        {
             $buscarClase = $miVectorobjetos[$i];
           $arr = array('subida1' => $buscarClase->getSubida1(), 'subida2' =>$buscarClase->getSubida2(),'subida3' => $buscarClase->getSubida3(),'bajada1' => $buscarClase->getBajada1(),'bajada2' => $buscarClase->getBajada2(), 'bajada3' => $buscarClase->getBajada3());
           $array2[]=array_map('utf8_encode',$arr);
         }*/



        /**CALCULO DE ERROR **/
        let sumConteoOriginalAjuste2=0.95*(puerta2BajadaValorAjuste);
        let sumConteoOriginalAjuste3=0.95*(puerta3BajadaValorAjuste);

        let puertaError1=objeto[i].bajada_2+sumConteoOriginalAjuste2;
        let puertaError2=objeto[i].bajada_3+sumConteoOriginalAjuste3;

        let error= objeto[i].subida_1-puertaError1-puertaError2;
        let errorEnvio = 0

        //console.log("1.1")
        let eerr2 = 100-(error*100/objeto[i].subida_1);
        var auxE = (100-(eerr2)).toFixed(2)
        errorEnvio = Number(auxE);

        if(errorEnvio<=0){
            errorEnvio = 0
        }


        var datos = {
            unidad:objeto[i].unidad,
            subida1:Math.round(objeto[i].subida_1),
            subida2:Math.round(objeto[i].subida_2),
            subida3:Math.round(objeto[i].subida_3),
            bajada1:Math.round(objeto[i].bajada_1),
            bajada2:Math.round(objeto[i].bajada_2+ajusteValorTotalPuerta2Bajada),
            bajada3:Math.round(objeto[i].bajada_3+ajusteValorTotalPuerta3Bajada),
            error:errorEnvio
        }

        vectorDatosConteo.push(datos)
    }

    return vectorDatosConteo

}
/********************************************************************************************************/

/**latina**/
function forma_procedimiento_5(objeto)
{


    /**
     *
     *         $factSub2=$lectorAjustes['FactSub2'];
     $bandera=$lectorAjustes['ApliAjus'];
     $factSub3=$lectorAjustes['FactSub3'];
     $factBaja1=$lectorAjustes['FactBaj1'];
     $factAjus=$lectorAjustes['FactAjus'];
     $aplibaja=$lectorAjustes['ApliBaja'];
     $porcbaj2 = $lectorAjustes['PorcBaj2'];
     $porcbaj3 = $lectorAjustes['PorcBaj3'];
     *
     * **/

    /**
     * obj.subida_1 = results[i].subida1
     obj.subida_2 = results[i].subida2
     obj.subida_3 = results[i].subida3
     obj.bajada_1 = results[i].bajada1
     obj.bajada_2 = results[i].bajada2
     obj.bajada_3 = results[i].bajada3
     *
     * **/


    let datosVectorResultConteo = []

    for(var i=0;i<objeto.length;i++)
    {
        let puerta2BajadaValorAporte = 0
        let puerta3BajadaValorAporte = 0

        let valorfaltante = objeto[i].subida_1 - objeto[i].bajada_2 - objeto[i].bajada_3;

        let valorconsiderar=objeto[i].subida_1-valorfaltante;

        if(valorconsiderar!=0)
        {
            puerta2BajadaValorAporte=(objeto[i].bajada_2*100)/valorconsiderar;
            puerta3BajadaValorAporte=(objeto[i].bajada_3*100)/valorconsiderar;
        }

        let puerta2BajadaValorAjuste=(valorfaltante*puerta2BajadaValorAporte)/100;
        let puerta3BajadaValorAjuste=(valorfaltante*puerta3BajadaValorAporte)/100;

        let ajusteValorTotalPuerta2Bajada=(puerta2BajadaValorAjuste+objeto[i].FactAjus)*objeto[i].FactAjus;
        let ajusteValorTotalPuerta3Bajada=(puerta3BajadaValorAjuste+objeto[i].FactAjus)*objeto[i].FactAjus;

        let sumConteoOriginalAjuste2=0.95*(puerta2BajadaValorAjuste);
        let sumConteoOriginalAjuste3=0.95*(puerta3BajadaValorAjuste);

        let puertaError1=objeto[i].bajada_2+sumConteoOriginalAjuste2;
        let puertaError2=objeto[i].bajada_3+sumConteoOriginalAjuste3;

        let error= objeto[i].subida_1-puertaError1-puertaError2;
        let errorEnvio = 0

        //console.log("1.1")
        let eerr2 = 100-(error*100/objeto[i].subida_1);
        var auxE = (100-(eerr2)).toFixed(2)
        errorEnvio = Number(auxE);

        if(errorEnvio<=0){
            errorEnvio = 0
        }

        if(objeto[i].ApliAjus == 1)
        {
            console.log("1")

            if(error>0)
            {

                if (objeto[i].ApliBaja==1)
                {
                    /*$arr =  array_map('utf8_encode', array('error'=>round($errorEnvio,2),'subida1' => $acuSubida1,
                    'subida2' =>intval($acuSubida2*$factSub2),'subida3' => intval($acuSubida3*$factSub3),
                    'bajada1' =>intval($acuBajada1*$factBaja1),'bajada2' =>
                    intval(round(($acuSubida1*$porcbaj2)/100,0)),
                        'bajada3' =>intval(round(($acuSubida1*$porcbaj3)/100,0))));*/

                    var datos = {
                        unidad:objeto[i].unidad,
                        subida1:Math.round(objeto[i].subida_1),
                        subida2:Math.round(objeto[i].subida_2*objeto[i].FactSub2),
                        subida3:Math.round(objeto[i].subida_3*objeto[i].FactSub3),
                        bajada1:Math.round(objeto[i].bajada_1*objeto[i].FactBaj1),
                        bajada2:Math.round(objeto[i].subida_1+objeto[i].subida_2-objeto[i].bajada_1),
                        bajada3:Math.round((objeto[i].bajada_3)),
                        error:errorEnvio
                    }

                    datosVectorResultConteo.push(datos)

                }else
                {

                    var datos = {
                        unidad:objeto[i].unidad,
                        subida1:Math.round(objeto[i].subida_1),
                        subida2:Math.round(objeto[i].subida_2*objeto[i].FactSub2),
                        subida3:Math.round(objeto[i].subida_3),
                        bajada1:Math.round(objeto[i].bajada_1*objeto[i].FactBaj1),
                        bajada2:Math.round(objeto[i].subida_2+objeto[i].subida_1-objeto[i].bajada_1),
                        bajada3:Math.round(objeto[i].bajada_3),
                        error:errorEnvio
                    }

                    datosVectorResultConteo.push(datos)
                }
            }else
            {
                console.log("1.2")
                /*$errorEnvio=0;*/
                if (objeto[i].ApliBaja==1)
                {

                    var datos = {
                        unidad:objeto[i].unidad,
                        subida1:Math.round(objeto[i].subida_1),
                        subida2:Math.round(objeto[i].subida_2*objeto[i].FactSub2),
                        subida3:Math.round(objeto[i].subida_3),
                        bajada1:Math.round(objeto[i].bajada_1*objeto[i].FactBaj1),
                        bajada2:Math.round((objeto[i].subida_1+objeto[i].subida_2-objeto[i].bajada_1)),
                        bajada3:Math.round((objeto[i].subida_1)),
                        error:errorEnvio
                    }

                    console.log("1.2 return 1")
                    datosVectorResultConteo.push(datos)

                }else
                {

                    var datos = {
                        unidad:objeto[i].unidad,
                        subida1:Math.round(objeto[i].subida_1),
                        subida2:Math.round(objeto[i].subida_2*objeto[i].FactSub2),
                        subida3:Math.round(objeto[i].subida_3),
                        bajada1:Math.round(objeto[i].bajada_1*objeto[i].FactBaj1),
                        bajada2:Math.round(objeto[i].subida_2+objeto[i].subida_1-objeto[i].bajada_1),
                        bajada3:Math.round(objeto[i].bajada_3),
                        error:errorEnvio
                    }
                    console.log("1.2 return 2")
                    datosVectorResultConteo.push(datos)
                }
            }
        }
        else
        {
            console.log("2")

            var datos = {
                unidad:objeto[i].unidad,
                subida1:objeto[i].subida_1,
                subida2:objeto[i].subida_2,
                subida3:objeto[i].subida_3,
                bajada1:objeto[i].bajada_1,
                bajada2:objeto[i].bajada_2,
                bajada3:objeto[i].bajada_3,
                error:errorEnvio
            }

            datosVectorResultConteo.push(datos)
        }
    }

    return datosVectorResultConteo;

}

function format_puertas_hibilies(objeto,num_habiles)
{
    /**
     *
     *                                 subida1:obj.subida_1,
     subida2:obj.subida_2,
     subida3:obj.subida_3,
     bajada1:obj.bajada_1,
     bajada2:obj.bajada_2,
     bajada3:obj.bajada_3,
     *
     * **/


    let objA = objeto

    switch(num_habiles){
        case 1:
            for(var i=0;i<objA.length;i++)
            {
                objA[i].subida2 = 0
                objA[i].subida3 = 0
                objA[i].bajada2 = 0
                objA[i].bajada3 = 0
            }
            break;
        case 2:

            for(var i=0;i<objA.length;i++)
            {
                objA[i].subida3 = 0
                objA[i].bajada3 = 0
            }

            break;
    }

    //console.log(objA)
    return objA
}

module.exports = {query_conteo_pasajeros_general,query_conteo_pasajeros_vuelta}