class cContadorAjuste
{

    constructor()
    {
        this.FactAjus=0
        this.ApliAjus=0
        this.FactBaj1=0
        this.FactSub2=0
        this.FactSub3=0
        this.ApliBaja=0
        this.PorcBaj2=0
        this.PorcBaj3=0
        this.ApliIncr=0
        this.PorcIncr=0
    }

    getApliIncr(){
        this.ApliIncr;
    }
    setApliIncr(valor){
        this.ApliIncr = valor
    }
    getPorcIncr(){
        this.PorcIncr;
    }
    setPorcIncr(valor){
        this.PorcIncr = valor
    }
    getFactAjus() {
        return this.FactAjus
    }

    setFactAjus(FactAjus_) {
        this.FactAjus = FactAjus_
    }

    getApliAjus() {
        return this.ApliAjus
    }

    setApliAjus(ApliAjus_) {
        this.ApliAjus = ApliAjus_
    }

    getFactBaj1() {
        return this.FactBaj1
    }

    setFactBaj1(FactBaj1_)
    {
        this.FactBaj1 = FactBaj1_
    }

    getFactSub2()
    {
        return this.FactSub2
    }

    setFactSub2(FactSub2_)
    {
        this.FactSub2 = FactSub2_
    }

    getFactSub3()
    {
        return this.FactSub3
    }

    setFactSub3(FactSub3_)
    {
        this.FactSub3 = FactSub3_
    }

    getApliBaja()
    {
        return this.ApliBaja
    }

    setApliBaja(ApliBaja_)
    {
        this.ApliBaja = ApliBaja_
    }

    getPorcBaj2()
    {
        return this.PorcBaj2
    }

    setPorcBaj2(PorcBaj2_)
    {
        this.PorcBaj2 = PorcBaj2_
    }

    getPorcBaj3()
    {
        return this.PorcBaj3
    }

    setPorcBaj3(PorcBaj3_)
    {
        this.PorcBaj3 = PorcBaj3_
    }


}

module.exports = cContadorAjuste