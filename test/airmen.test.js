const FAA = require('../index')
const Parser = FAA.Parser

describe('Parsing Airmen Data from FAA', function () {

  it('Validating FAA imports Against JSON Schema', function (done) {

    const parser = new Parser(FAA.Airmen)
    const sourceFile = __dirname + '/data/Sample_Airmen_Data.txt';

    var promise = parser.parse(sourceFile, airmen => {
      return new Promise((resolve, revoke) => {
        console.log(JSON.stringify(airmen, null, 2))
        resolve();
      });
    });

    promise.then(() => {
      console.log('It worked!')
      done()
    }).catch((err) => {
      throw err
    });
  });

});