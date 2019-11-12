# faa-parser
Node module for parsing various FAA data files.

```javascript
const FAA = require('../index')
const Parser = FAA.Parser

var parser = new Parser(FAA.Airport)

// https://www.faa.gov/air_traffic/flight_info/aeronav/aero_data/NASR_Subscription_2019-06-20
var sourceFile = 'path/to/APT.txt';

var promise = parser.parse(sourceFile, airport => {
  return new Promise((resolve, revoke) => {
    if (airport.state === 'NV')
      console.log(JSON.stringify(airport, null, 2))
    resolve();
  });
});

promise.then(() => {
  console.log('It worked!')
  done()
}).catch((err) => {
  throw err
});
```
