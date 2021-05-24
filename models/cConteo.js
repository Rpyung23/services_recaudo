let cContadorAjuste = require("../models/cContadorAjuste")

class cConteo {

     /*subida1 : 0,
     subida2 : 0,
     subida3 : 0,
     bajada1 : 0,
     bajada2 : 0,
     bajada3 : 0,
     error : 0,
     oContadorAjuste:cContadorAjuste,*/


    constructor()
    {
        this.unidad = 0
        this.subida1 = 0
        this.subida2 = 0
        this.subida3 = 0
        this.bajada1 = 0
        this.bajada2 = 0
        this.bajada3 = 0
        this.error = 0
        this.oContadorAjuste=new cContadorAjuste()
    }
    getOContadorAjuste()
    {
        return this.oContadorAjuste
    }

    setOContadorAjuste(oContadorAjuste_)
    {
        this.oContadorAjuste = oContadorAjuste_
    }

    getUnidad(){
        return this.unidad
    }

    setUnidad(unidad_){
        this.unidad = unidad_
    }

    getSubida1()
    {
        return this.subida1
    }

    setSubida1(subida1_)
    {
        this.subida1 = subida1_
    }

    getSubida2()
    {
        return this.subida2
    }

    setSubida2(subida2_)
    {
        this.subida2 = subida2_
    }

    getSubida3()
    {
        return this.subida3
    }

    setSubida3(subida3_)
    {
        this.subida3 = subida3_
    }

    getBajada1()
    {
        return this.bajada1
    }

    setBajada1(bajada1_)
    {
        this.bajada1 = bajada1_
    }

    getBajada2()
    {
        return this.bajada2
    }

    setBajada2(bajada2_)
    {
        this.bajada2 = bajada2_
    }

    getBajada3()
    {
        return this.bajada3
    }

    setBajada3(bajada3_)
    {
        this.bajada3 = bajada3_
    }

    getError()
    {
        return this.error
    }

    setError(error_)
    {
        this.error = error_
    }

}

module.exports = cConteo;