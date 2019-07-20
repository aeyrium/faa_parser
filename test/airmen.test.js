const FAA = require('../index')
const Parser = FAA.Parser
const validate = require('jsonschema').validate
const airmenSchema = require('../src/schema/airmenSchema')
const expect = require('chai').expect

describe('Parsing Airmen Data from FAA', function () {

  it('Validating FAA imports Against JSON Schema', function (done) {
    
    const parser = new Parser(FAA.Airmen)
    const sourceFile = __dirname + '/data/Sample_Airmen_Data.txt';

    parser.start(sourceFile, airmen => {
      const result = validate(airmen, airmenSchema)
      expect(result.valid, result.errors)
    }, session => {
      done()
    });

  });

});