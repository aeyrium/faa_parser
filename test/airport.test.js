const FAA = require('../index')
const Parser = FAA.Parser

describe('Parsing Airport Data from FAA', function () {

  it('Validating FAA imports Against JSON Schema', function (done) {
    var parser = new Parser(FAA.Airport)

    // https://www.faa.gov/air_traffic/flight_info/aeronav/aero_data/NASR_Subscription_2019-06-20
    var sourceFile = __dirname + '/data/Sample_Airport_Data.txt';

    parser.parse(sourceFile, airport => {
      if (airport.state === 'NV')
        console.log(JSON.stringify(airport, null, 2))
    }, session => { done() });
  });

});