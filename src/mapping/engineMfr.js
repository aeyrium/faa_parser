var engineTypeMap = {
  "0": "None",
  "1": "Reciprocating",
  "2": "Turbo-prop",
  "3": "Turbo-shaft",
  "4": "Turbo-jet",
  "5": "Turbo-fan", 
  "6": "Ramjet",
  "7": "2 Cycle",
  "8": "4 Cycle",
  "9": "Unknown",
  "10": "Electric",
  "11": "Rotary"
};

module.exports.beforeLine = function(line, lineNum) {
  return (lineNum > 0)? line.replace(/,/g, "") : null;
}
module.exports.fieldsets = {
  "default": {
      set: function(session, name, value) {
          if (value)
              session.aircraftMfr[name] = value;
      },
      before: function(session, onItem) {
          if (session.aircraftMfr) {
              onItem(session.aircraftMfr);
              delete session.aircraftMfr;    
          }
          session.aircraftMfr = {};
      },
      fields: [
          { name: "code", size: 5 },
          { name: "mfr_name", size: 10 },
          { name: "model_name", size: 13 },
          { name: "type_engine", size: 2, map: engineTypeMap },
          { name: "horse_power", size: 5, type:"int" },
          { name: "thrust", size: 6, type:"int"},
      ]
  }
}