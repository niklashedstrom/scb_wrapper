# SCB Wrapper

This is a nodejs wrapper for the Statistics Sweden (Statistiska centralbyrån) API. It can be located here [SCB](http://www.scb.se/en/api). 

## How to install
```
npm i scb_wrapper
```

## How to use

There is a [API Description](https://www.scb.se/contentassets/79c32c72783a4f67b202ad3189f921b9/api_description.pdf) to understand and use the api better.

To use the wrapper you need import the wrapper and instantiate the SCB class with either "sv" for swedish or "en" for english.
```javascript
const scb_wrapper = require('scb_wrapper')

let scb = new scb_wrapper.SCB("sv")
```
The  SCB class can also be instaniated with a variable amount of pre determined steps down the path.
```javascript
let scb = new scb_wrapper.SCB("sv", "BE", "BE0001", "BE0001G", "BE0001T06AR")
```
 ***getInfo()*** : Can be used to get the inforamtion of the current path.
```javascript
scb.getInfo().then(res => {
    console.log(res)
})
```
***moveDown(...path)*** : Can be used to move down the path to a specific node.
```javascript
scb.moveDown(path)
```
Example:
```javascript
scb.moveDown("BE")
scb.moveDown("BE0001")
//or do it directly
scb.moveDown("BE", "BE0001")
```
***moveUp(steps)*** : Can be used to move up the path a speficic amount of steps.
```javascript
scb.moveUp(steps)
```
Example:
```javascript
scb.moveUp(1) or scb.moveUp() //to move up one step
scb.moveUp(3) //to move up three steps
```
***moveToTop()*** :  Can be used to move to the top node.
```javascript
scb.moveToTop()
```
***getCurrentPath()*** : Can be used to get the current path.
```javascript
scb.getCurrentPath()
```
***isLeafNode(response)*** : Can used to check if the current node is a leaf/end node. Will return true if the current node is a leaf node false otherwise.
```javascript
scb.getInfo().then(resp => {
    console.log(scb.isLeafNode(res))
});
```
***getVariables()*** : Can be used to get all the possible variables that can be used for a query request. Can only be used at leaf node.
```javascript
scb.getVariables().then(res => {
    console.log(res)
})
```
***getVariablesCodes()*** : Can be used to get all the variables code/keys for a query request. Can only be used at leaf node.
```javascript
scb.getVariablesCodes().then(res => {
    console.log(res)
})
```
***getVariableValuesFromText(text)*** : Can be used to get a all the variables for a specific code/key. Can only be used at leaf node.
```javascript
scb.getVariableValuesFromText(variableCode).then(res => {
    console.log(res)
})
```
Example:
```javascript
let  scb = new  functions.SCB("sv", "BE", "BE0001", "BE0001G", "BE0001T06AR")

scb.getVariableValuesFromText("tilltalsnamn").then(res => {
    console.log(res)
})//Will return all the available values for the key "tilltalsnamn"
```
***setQuery(parameters)*** : Can be used to set a query that can be used to make a post request. The in parameters is a json formated object contaning the key/code and variable combos that is to be used in the query.
```javascript
scb.setQuery(parameters).then(response  => {
})
```
Example:
```javascript
let  scb = new  functions.SCB("sv", "BE", "BE0001", "BE0001G", "BE0001T06AR")

let parameters = [
{"tilltalsnamn" : ["Niklas"]},
{"tabellinnehåll" : ["Antal bärare"]},
{"år" : ["2021"]},
]

scb.setQuery(parameters).then(response  => {
})
```
***getQuery()*** : Can be used to get the currently set query.
```javascript
scb.getQuery()
```
***clearQuery()*** : Can be used to clear the currently set query.
```javascript
scb.clearQuery()
```
***setQueryResponseFormat(format)*** : Can be used to set the response format that will be used when making a post request.
```javascript
scb.setQueryResponseFormat(format)
```
Example:
```javascript
scb.setQueryResponseFormat("json")
```
***getValidFormats()*** : Can be used to get all the valid repsonse formats available.
```javascript
scb.getValidFormats()
```
***getData()*** : Can be used to get data from the currently set query.
```javascript
scb.getData().then(res => {
    console.log(res)
})
```
Example:
```javascript
let  scb = new  functions.SCB("sv", "BE", "BE0001", "BE0001G", "BE0001T06AR")

let parameters = [
{"tilltalsnamn" : ["Niklas"]},
{"tabellinnehåll" : ["Antal bärare"]},
{"år" : ["2021"]},
]

scb.setQuery(parameters).then(response  => {
    scb.getData().then(res => {
        console.log(res)
    })
})
```
***getDataFromQuery(parameters, readable, format)*** : Can be used to get the data directly with the from the parameters that a used. Readable is a boolean to be used to determind if the response should be in human readable text or not.
```javascript
scb.getDataFromQuery(parameters, readable, format).then(res => {
    console.log(res)
})
```
Example:
```javascript
let  scb = new  functions.SCB("sv", "BE", "BE0001", "BE0001G", "BE0001T06AR")

let parameters = [
{"tilltalsnamn" : ["Niklas"]},
{"tabellinnehåll" : ["Antal bärare"]},
{"år" : ["2021"]},
]

scb.getDataFromQuery(parameters, true, "json").then(res => {
    console.log(JSON.stringify(res))
}) // Will return how many were named Niklas in the year 2021
```

### Insperation
The insperation for this nodejs wrapper come from the python SCB wrapper [pyscbwrapper](https://github.com/kirajcg/pyscbwrapper).