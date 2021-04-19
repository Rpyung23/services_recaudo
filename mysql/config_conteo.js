let config_pre_and_post_consulta = (code)=>
{
    let obj = {
        status : null,
        script_conteo:null,
        bandera_post_conteo:0,
        post_procedimiento:null
    };

    switch(code)
    {
        case 'uambatena1198':
        case 'puruha1502':
            obj.status = 200
            obj.script_conteo = 1 /**Forma 1**/
            obj.bandera_post_conteo = 1 /**Existe procesamiento despues de consulta**/
            obj.post_procedimiento = 1 /**Forma 1 de procesar los datos**/
            obj.puertas_habiles = 3
            break;

        case 'transisa0645':
            obj.status = 200
            obj.script_conteo = 1 /**Forma 1**/
            obj.bandera_post_conteo = 1 /**Existe procesamiento despues de consulta**/
            obj.post_procedimiento = 3 /**Forma 3 de procesar los datos**/
            obj.puertas_habiles = 2
            break;

        case 'pradoeco896':
            obj.status = 200
            obj.script_conteo = 2 /**Forma 2**/
            obj.bandera_post_conteo = 1 /**Existe procesamiento despues de consulta**/
            obj.post_procedimiento = 4 /**Forma 4 de procesar los datos**/
            obj.puertas_habiles = 3
            break;

        case 'trunsa1152':
            obj.status = 200
            obj.script_conteo = 2 /**Forma 2**/
            obj.bandera_post_conteo = 1 /**Existe procesamiento despues de consulta**/
            obj.post_procedimiento = 2 /**Forma 1 de procesar los datos**/
            obj.puertas_habiles = 3
            break;

        case 'amazonica1198':
        case 'mazul5693':
            obj.status = 200
            obj.script_conteo = 2 /**Forma 2**/
            obj.bandera_post_conteo = 0 /**Existe procesamiento despues de consulta**/
            obj.post_procedimiento = 0 /***************/
            obj.puertas_habiles = 3
            break;

        default:
            obj.status = null
            break;
    }

    return obj
}

module.exports = {config_pre_and_post_consulta}