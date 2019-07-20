const FAA = require('../index')
const Parser = FAA.Parser

describe('Parsing Aircraft Data from FAA', function () {

  it('Validating Aircraft imports', function (done) {
    var parser = new Parser(FAA.Aircraft)
    this.timeout(600000);
    var sourceFile = __dirname + '/data/Sample_Aircraft_Data.txt';

    parser.parse(sourceFile, aircraft => {
      console.log(aircraft)
    }, session => {
      done()
    });
  });

  // it('Validate AircraftMfr imports', function(done) {
  //   var parser = new Parser(FAA.AircraftMfr)
  //   this.timeout(600000);
  //   var sourceFile = __dirname + '/data/Sample_AircraftMfr_Data.txt';

  //   parser.start(sourceFile, aircraftMfr => {
  //     //console.log(aircraftMfr)
  //   }, session => {
  //     done()
  //   });
  // })

  // it('Validate EngineMfr imports', function(done) {
  //   var parser = new Parser(FAA.EngineMfr)
  //   this.timeout(600000);
  //   var sourceFile = __dirname + '/data/Sample_EngineMfr_Data.txt';

  //   parser.start(sourceFile, aircraftMfr => {
  //     //console.log(aircraftMfr)
  //   }, session => {
  //     done()
  //   });
  // })

});