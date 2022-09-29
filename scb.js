const axios = require('axios');

class SCB {

    constructor(lang) {
        this.leng = arguments
        this.url = "http://api.scb.se/OV0104/v1/doris/" + lang + "/ssd/BE/BE0101/BE0101A/BefolkningNy"
    }

    async getInfo() {
        const config = {
            method: 'get',
            url: this.url
        }
        let res = await axios(config)
        console.log(JSON.stringify(res.data))
    }

    goDown(){

    }

    goUp(){

    }

    getVariables(){

    }

    getVariablesCodes(){

    }

    getVariableCodeValues(code){

    }

    setQuery(){

    }

    getQuery(){

    }

    clearQuery(){

    }

    getData(){

    }


  }
