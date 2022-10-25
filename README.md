# SCB Wrapper

This is a nodejs wrapper for the Statistics Sweden (Statistiska centralbyrån) API. It can be located here [SCB](http://www.scb.se/en/api).



## How to install
```
npm i scb_wrapper
```

## How to use

There is a [API Description](https://www.scb.se/contentassets/79c32c72783a4f67b202ad3189f921b9/api_description.pdf) to understand and use the api better.

```javascript
const scb_wrapper = require('scb_wrapper')

let scb = new scb_wrapper.SCB()
```


### Insperation
The insperation for this nodejs wrapper come from the python SCB wrapper [pyscbwrapper](https://github.com/kirajcg/pyscbwrapper).