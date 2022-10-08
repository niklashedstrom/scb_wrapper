const axios = require('axios');

class SCB {
    #paths
    url

    constructor(lang) {
        if(lang === undefined) {
            throw new Error('SCB needs a language string paramter to be instantiated');
          }
        this.#paths = Object.values(arguments).slice(1)
        this.url = "http://api.scb.se/OV0104/v1/doris/" + lang + "/ssd"
    }

    async getInfo() {
        const config = {
            method: 'get',
            url: this.url + "/" + this.#paths.join("/")
        }
        let res = await axios(config)
        return res.data
    }

    moveDown(){
        this.#paths = this.#paths.concat(Object.values(arguments))
    }

    moveUp(steps){
        this.#paths = steps === undefined ? this.#paths.slice(0, -1) : this.#paths.slice(0, -steps)
    }

    getCurrentPath = function(){
        return this.url + "/" + this.#paths.join("/")
    }

    //getTitle()

    async isLeafNode(response){
        return response["variables"] !== undefined
    }

    async getVariables(){
        const response = await this.getInfo()
        if(!this.isLeafNode(response)){
            throw new Error("Current path is not a leaf node");
        }
        let variables = response["variables"];
        let values = {}
        for(let i = 0; i < variables.length; i++ ){
            for(let j= 0; j < variables[i]["valueTexts"].length; j++){
                values[variables[i]["text"]] = variables[i][["valueTexts"]]
            }
        }
        return values
    }

    async getVariablesCodes(){
        const response = await this.getInfo()
        if(!this.isLeafNode(response)){
            throw new Error("Current path is not a leaf node");
        }
        let variables = response["variables"];
        let variableCodeValues = []
        for(let i = 0; i < variables.length; i++ ){
                variableCodeValues.push(variables[i]["text"])
        }
        return variableCodeValues
    }


    async getVariableValuesFromText(text){
        const response = await this.getInfo()
        if(!this.isLeafNode(response)){
            throw new Error("Current path is not a leaf node");
        }
        let variables = response["variables"];
        for(let i = 0; i < variables.length; i++ ){
            if(variables[i]["text"] === text){
                return variables[i]["values"]
            }
        }
    }


    setQuery(){

    }

    getQuery(){

    }

    clearQuery(){

    }

    getData(){

    }

    getUrl(){

    }

}

module.exports = {
    SCB
};
