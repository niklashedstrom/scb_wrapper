const axios = require('axios')

class SCB {
    #paths
    #url
    #query
    #format
    #validFormats = ["px", "csv", "json", "xlsx", "json-stat", "json-stat2", "sdmx"]

    /**
     * Constructor for the SCB class.
     * @param {String} languageCode the language that should be used, either 'sv' or 'en'.
     * @param {...String} path a variable amount of strings. Can be empty.
     */
    constructor(languageCode, ...path) {
        if(languageCode === undefined) {
            throw new Error('SCB needs a language string paramter to be instantiated');
          }
        this.#paths = path.slice(1)
        this.#url = "https://api.scb.se/OV0104/v1/doris/" + languageCode + "/ssd/"
        this.#format = "json"
        this.#query = {"query": [], "response": {"format": this.#format}}
    }

    /**
     * Makes a request to the SCB API with the current path.
     * @return {Object} a json formated object containing the information of the node of the current path.
     */
    async getInfo() {
        let res = await axios.get(this.#url + this.#paths.join("/")).catch(function (error) {
            throw new Error(error.message)
          })
          return res.data
    }

    /**
     * Adds the given parameters to the paths list.
     * @param {...String} path a variable amount of strings
     */
    moveDown(...path){
        this.#paths = this.#paths.concat(path)
    }

    /**
     * Subtracts the amount of values from the back of the paths list.
     * @param {Number} steps amount of values that should be removed. Can be empty.
     */
    moveUp(steps){
        this.#paths = steps === undefined ? this.#paths.slice(0, -1) : this.#paths.slice(0, -steps)
    }

    /**
     * Resets the paths values.
     */
    moveToTop(){
        this.#paths = []
    }

    /**
     * Returns the whole current path that the API request is made with.
     * @return {String} the current path.
     */
    getCurrentPath(){
        return this.#url + this.#paths.join("/")
    }

    /**
     * An internal method that returns the variables json formated object if the curretent path is a leaf node.
     * @return {Object} a json formated object containing the varialbes information of the node of the current path.
     */
    async #getVariablesObject(){
        const response = await this.getInfo()
        if(!this.isLeafNode(response)){
            throw new Error("Current path is not at a leaf node")
        }
        return response["variables"]
    }

    /**
    * Checks if the current node is a leaf node.
    * @return {Boolean} for the current node status.
    */
    isLeafNode(response){
        return response["variables"] !== undefined
    }

    /**
    * Returns a json formated object contaning the text variables and their ranges for the current leaf node.
    * @return {Object} a json formated object contaning the variables and their ranges.
    */
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

    /**
    * Returns a list contaning the text variables for the current leaf node.
    * @return {List} contaning the text variables.
    */
    async getVariablesCodes(){
        let variables = await this.#getVariablesObject()
        let variableCodeValues = []
        for(let i = 0; i < variables.length; i++ ){
                variableCodeValues.push(variables[i]["text"])
        }
        return variableCodeValues
    }

    /**
    * Returns a list contaning values for a specific variable.
    * @param {String} text name of the variable.
    * @return {List} contaning the values.
    */
    async getVariableValuesFromText(text){
        let variables = await this.#getVariablesObject()
        for(let i = 0; i < variables.length; i++ ){
            if(variables[i]["text"] === text){
                return variables[i]["values"]
            }
        }
    }

    /**
    * Sets the query that is used for the get data request.
    * @param {Object} parameters a json formated object with the variable name as key and the range as values.
    */
    async setQuery(parameters){
        this.clearQuery()
        let variables = await this.#getVariablesObject()
        for(let i = 0; i < parameters.length; i++ ){
            for(let j= 0; j < variables.length; j++){
                if(Object.keys(parameters[i])[0] === variables[j]["text"]){
                    let values = []
                    let parameterValues = Object.values(parameters[i])[0]
                    parameterValues.forEach(element => {
                        values.push(variables[j]["values"][variables[j]["valueTexts"].indexOf(element)] )
                    });
                    this.#query["query"].push(
                            {"code": variables[j]["code"],
                            "selection":{"filter":"item","values": values}}
                    )
                }
            }
        }
    }

    /**
    * Returns the currently set query correctly formated to make a SCB API post request.
    * @return {Obejct} a json formated object.
    */
    getQuery(){
        return this.#query
    }

    /**
    * Clears the current query.
    */
    clearQuery(){
        this.#query = {"query": [],"response": {"format": this.#format}}
    }

    /**
    * Sets the default query response foramt if the input is a valid format.
    * @param {String} format the format that should be set.
    */
    setQueryResponseFormat(format){
        if(this.#validFormats.includes(format)){
            this.#format = format
        }else{
            throw new Error("Not a valid format")
        }
    }

    /**
    * Returns all the valid formats for the querys responese format.
    * @return {List} a list of all the valid formats.
    */
    getValidFormats(){
        return this.#validFormats
    }

    /**
     * Makes a request to the SCB API with the current query.
     * @return {Object} a json formated object containing the information for the currently set query.
     */
    async getData(){
        const json = JSON.stringify(this.#query);
        let res = await axios.post(this.#url + this.#paths.join("/"), json).catch(function (error) {
            throw new Error(error.message)
          })
        return res.data
    }


    /**
    * Makes a request to the SCB API from the selected paramters.
    * @param {Object} parameters a json formated object with the variable name as key and the range as values.
    * @param {Boolean} readable converts the response to a more human readable format if true.
    * @param {String} format what format to use
    */
    async getDataFromQuery(parameters, readable, format){
        let valueStructure = []
        format !== undefined ? this.setQueryResponseFormat(format) : "";
        this.clearQuery()
        let variables = await this.#getVariablesObject()
        for(let i = 0; i < parameters.length; i++ ){
            for(let j= 0; j < variables.length; j++){
                if(Object.keys(parameters[i])[0] === variables[j]["text"]){
                    let values = []
                    let parameterValues = Object.values(parameters[i])[0]
                    let title = {}
                    title[Object.keys(parameters[i])[0]] = []
                    parameterValues.forEach(element => {
                        let valuePair = {}
                        valuePair[variables[j]["values"][variables[j]["valueTexts"].indexOf(element)]] = element
                        title[Object.keys(parameters[i])[0]].push(valuePair)
                        values.push(variables[j]["values"][variables[j]["valueTexts"].indexOf(element)] )
                    });
                    valueStructure.push(title)
                    this.#query["query"].push(
                            {"code": variables[j]["code"],
                            "selection":{"filter":"item","values": values}}
                    )
                }
            }
        }
        const json = JSON.stringify(this.#query);
        let res = await axios.post(this.#url + this.#paths.join("/"), json).catch(function (error) {
            throw new Error(error.message)
          })
        if(readable){
            res.data["data"] = this.#getReadableData(res.data, valueStructure)
        }
        return res.data
    }

    #getReadableData(data, converter){
        let order = []
        data["columns"].forEach(element => {
            order.push(element["text"])
        })
        let keys = []
        data["data"].forEach(i => {
            let entry = {}
            let key = []
            for(let j = 0; j < i["key"].length; j++){
                key.push(converter.filter(e => e[order[j]] !== undefined)[0][order[j]].filter(s => s[i["key"][j]] !== undefined)[0][i["key"][j]])
            }
            entry["key"] = key
            entry["values"] = i["values"]
            keys.push(entry)
        })
        return keys
    }
}

module.exports = {
    SCB
}
