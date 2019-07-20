var aircraftTypeMap = {
    "1": "Glider",
    "2": "Balloon",
    "3": "Blimp/Dirigible",
    "4": "Fixed wing single engine",
    "5": "Fixed wing multi engine", 
    "6": "Rotorcraft",
    "7": "Weight-shift-control",
    "8": "Powered Parachute",
    "9": "Gyroplane"
};

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

var categoryMap = {
    "1": "Land",
    "2": "Sea",
    "3": "Amphibian"
};

var builderCertCode = {
    "0": "Type Certificated",
    "1": "Not Type Certificated",
    "2": "Light Sport"
};

var weightMap = {
    "1": "Up to 12,499lbs",
    "2": "12,500lbs - 19,999lbs",
    "3": "20,000lbs and Over",
    "4": "UAV up to 55"
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
            { name: "code", size: 7 },
            { name: "mfr_name", size: 30 },
            { name: "model_name", size: 20 },
            { name: "type_aircraft", size: 1, map: aircraftTypeMap },
            { name: "type_engine", size: 2, map: engineTypeMap },
            { name: "aircraft_cat_code", size: 1, map: categoryMap },
            { name: "builder_cert_code", size: 1, map: categoryMap },
            { name: "engine_count", size: 2, type:"int" },
            { name: "seat_count", size: 3, type:"int" },
            { name: "aircraft_weight", size: 7, type:"int" },
            { name: "cruising_speed", size: 4, type:"int" },
        ]
    }
}