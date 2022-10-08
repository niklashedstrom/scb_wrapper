const axios = require('axios');

class SCB {
    #paths
    #url
    #query
    #format
    #validFormats = ["px", "csv", "json", "xlsx", "json-stat", "json-stat2", "sdmx"]

    constructor(lang) {
        if(lang === undefined) {
            throw new Error('SCB needs a language string paramter to be instantiated');
          }
        this.#paths = Object.values(arguments).slice(1)
        this.#url = "http://api.scb.se/OV0104/v1/doris/" + lang + "/ssd"
        this.#format = "json"
        this.#query = {"query": [], "response": {"format": this.#format}}
    }

    async getInfo() {
        const config = {
            method: 'get',
            url: this.#url + "/" + this.#paths.join("/")
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

    getCurrentPath(){
        return this.#url + "/" + this.#paths.join("/")
    }

    async #getVariablesObject(){
        const response = await this.getInfo()
        if(!this.isLeafNode(response)){
            throw new Error("Current path is not at a leaf node");
        }
        return response["variables"];
    }

    isLeafNode(response){
        return response["variables"] !== undefined
    }

    async getVariables(){
        let variables = await this.#getVariablesObject()
        let values = {}
        for(let i = 0; i < variables.length; i++ ){
            for(let j= 0; j < variables[i]["valueTexts"].length; j++){
                values[variables[i]["text"]] = variables[i][["valueTexts"]]
            }
        }
        return values
    }

    async getVariablesCodes(){
        let variables = await this.#getVariablesObject()
        let variableCodeValues = []
        for(let i = 0; i < variables.length; i++ ){
                variableCodeValues.push(variables[i]["text"])
        }
        return variableCodeValues
    }

    async getVariableValuesFromText(text){
        let variables = await this.#getVariablesObject()
        for(let i = 0; i < variables.length; i++ ){
            if(variables[i]["text"] === text){
                return variables[i]["values"]
            }
        }
    }

    async setQuery(parameters){
        this.clearQuery()
        let variables = await this.#getVariablesObject()
        for(let i = 0; i < parameters.length; i++ ){
            for(let j= 0; j < variables.length; j++){
                if(Object.keys(parameters[i]) === variables[j]["code"]){
                    let values = []
                    Object.values(parameters[i]).forEach(element => {
                        values.push(variables[j]["values"][variables[j]["valueTexts"].indexOf(element)])
                    })
                    this.#query["query"].push(
                            '{"code":"'+ variables[j]["code"] +', "selection":{"filter":"item", "values":"'+ values +'"}},'
                    )
                }
            }
        }
    }

    getQuery(){
        return this.#query
    }

    clearQuery(){
        this.#query = {"query": [],"response": {"format": this.#format}}
    }

    setDefaulQueryFormat(format){
        if(this.#validFormats.includes(format)){
            this.#format = format
        }else{
            throw new Error("Not a valid format");
        }
    }

    getValidFormats(){
        return this.#validFormats
    }

    async getData(){
        const config = {
            method: 'post',
            url: this.#url + "/" + this.#paths.join("/"),
            json: this.#query
        }
        let res = await axios(config)
        return res.data
    }

}

module.exports = {
    SCB
};
