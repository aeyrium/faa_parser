var setAddress = function (session, name, value) {
  if (typeof session.airmencert.address == 'undefined')
    session.airmencert.address = {};
  if (value)
    session.airmencert.address[name] = value;
}

var setMedical = function (session, name, value) {
  if (typeof session.airmencert.medical == 'undefined')
    session.airmencert.medical = {};
  if (value)
    session.airmencert.medical[name] = value;
}

var CERT_TYPES = {
  "P": "Pilot",
  "Y": "Pilot (Foreign)",
  "B": "Pilot (SP)",
  "F": "CFI",
  "A": "AAI",
  "G": "Ground Instructor",
  "E": "Flight Engineer",
  "H": "Flight Engineer (SP)",
  "X": "Flight Engineer (Foreign)",
  "M": "Mechanic",
  "T": "Control Tower Operator",
  "R": "Repairman",
  "I": "Repairman (Experimental)",
  "L": "Repairman (LSA)",
  "W": "Parachute Rigger",
  "D": "Dispatcher",
  "N": "Flight Navigator",
  "J": "Flight Navigator (SP)",
  "Z": "Flight Attendant"
};

var CERT_LEVELS = {
  "A": "ATP",
  "C": "Commercial",
  "P": "Private",
  "V": "Recreational",
  "T": "Sport",
  "S": "Student",
  "Z": "Commercial",
  "Y": "Private",
  "X": "Historic",
  "B": "ATP",
  "K": "Commercial",
  "U": "Master",
  "W": "Senior"
};

var RATINGS = {
  "ADV": "Advanced",
  "AIR": "Lighter than Air",
  "AIRCR": "Aircraft",
  "AIRFR": "Airframe",
  "AIRPL": "Airplanes",
  "ALL": "FAA Service Inspector",
  "AME": "Airplane ME",
  "AMEL": "Airplane MEL",
  "AMELC": "Airplane MELC",
  "AMES": "Airplane MES",
  "ASE": "Airplane SE",
  "ASEL": "Airplane SEL",
  "ASES": "Airplane SES",
  "ASME": "Airplane SME",
  "BACK": "Back",
  "CHEST": "Chest",
  "ENGINE": "Aircraft Engine",
  "FAR": "Federal Air Regs",
  "GL": "Glider",
  "GLAT": "Glider Tow",
  "GLATGT": "Glider Tow and Ground Tow",
  "GLATSL": "Glider Tow and Self-Launch",
  "GLGT": "Glider Ground Tow",
  "GLGTSL": "Glider Ground Tow & Self-Launch",
  "GLSL": "Glider Self-Launch",
  "GROUP I": "Group I",
  "GROUP II": "Group II",
  "GYRO": "Rotocraft-Gyroplane",
  "HEL": "Rotocraft-Helicopter",
  "HELGY": "Rotocraft Helicopter & Gyroplane",
  "INSPT": "Inspection",
  "INST": "Instrument",
  "INSTA": "Instrument Airplane",
  "INSTH": "Instrument Helicopter",
  "INSTI": "Instrument Airplane & Helicopter",
  "INSTP": "Instrument Powered-Lift",
  "JET": "Turbojet",
  "LAP": "Lap Parachute",
  "LTA": "Lighter-than-Air",
  "LTO": "Link Trainer Operator",
  "MAINT": "Maintenance",
  "METEOR": "Meteorology",
  "NAV": "Navigation",
  "PLIFT": "Powered-Lift",
  "POWER": "Powerplant",
  "RADIO": "Radio Navigation",
  "RECIP": "Reciprocating Engine Powered",
  "ROTOR": "Rotocraft",
  "SEAT": "Seat Parachute",
  "SPORT": "Sport",
  "SPUR": "Special Purpose",
  "TROP": "Turboprop"
};

function resolveMap(rating, name, key, mapping) {
  var val = mapping[key];
  if (val) {
    rating[name] = val;
  }
}

var setRatings = function (session, name, value) {
  if (value) {
    for (var ndx = 0; ndx < value.length; ndx++) {
      if (value[ndx].indexOf('/') > -1) {
        var parts = value[ndx].split('/');
        var rating = {
          name: parts[1]
        };
        resolveMap(rating, "level", parts[0], CERT_LEVELS);

        value[ndx] = rating;
      } else {
        value[ndx] = {
          name: RATINGS[value[ndx]]
        }
      }
    }
    session.certrec[name] = value;
  } else {
    session.certrec[name] = [];
  }
}

var certRecordFields = {
  set: function (session, name, value) {
    if (value)
      session.certrec[name] = value;
  },
  before: function (session) {
    delete session.certrec;
    session.certrec = {};
  },
  after: function (session) {
    if (typeof session.airmencert.certificates == 'undefined')
      session.airmencert.certificates = [];
    session.airmencert.certificates.push(session.certrec);
  },
  fields: [{
      name: "faaId",
      size: 8,
      ignore: true
    },
    {
      name: "RECORD_TYPE",
      size: 2,
      ignore: true
    },
    {
      name: "type",
      size: 1,
      map: CERT_TYPES
    },
    {
      name: "level",
      size: 1,
      map: CERT_LEVELS
    },
    {
      name: "expires",
      size: 8,
      type: "date",
      format: "ddMMYYY"
    },
    {
      name: "ratings",
      size: 110,
      split: 10,
      set: setRatings
    },
    {
      name: "typeRatings",
      size: 990,
      split: 10,
      set: setRatings
    }
  ]
}

module.exports.selector = "^.{8}(.{2})";
module.exports.fieldsets = {
  "00": {
    set: function (session, name, value) {
      session.airmencert[name] = value;
    },
    before: function (session, onItem) {
      if (typeof session.airmencert != 'undefined') {
        onItem(session.airmencert);
        delete session.airmencert;
      }
      session.airmencert = {};
    },
    after: function (session, onItem) {

    },
    fields: [{
        name: "faaId",
        size: 8
      },
      {
        name: "RECORD_TYPE",
        size: 2,
        ignore: true
      },
      {
        name: "FIRST_MIDDLE_NAME",
        size: 30,
        set: function (session, name, value) {
          session.airmencert.fullname = value;
        }
      },
      {
        name: "LAST_SUFFIX_NAME",
        size: 30,
        set: function (session, name, value) {
          session.airmencert.fullname += (' ' + value);
        }
      },
      {
        name: "street1",
        size: 33,
        set: setAddress
      },
      {
        name: "street2",
        size: 33,
        set: setAddress
      },
      {
        name: "city",
        size: 17,
        set: setAddress
      },
      {
        name: "state",
        size: 2,
        set: setAddress
      },
      {
        name: "zipcode",
        size: 10,
        set: setAddress
      },
      {
        name: "country",
        size: 18,
        set: setAddress
      },
      {
        name: "region",
        size: 2
      },
      {
        name: "class",
        size: 1,
        set: setMedical
      },
      {
        name: "issued",
        size: 6,
        set: setMedical,
        type: "date",
        format: "MMYYYY"
      },
      {
        name: "expires",
        size: 6,
        set: setMedical,
        type: "date",
        format: "MMYYYY"
      },
      {
        name: "END",
        size: 922,
        ignore: true
      }
    ]
  },
  "01": certRecordFields,
  "02": certRecordFields,
  "03": certRecordFields,
  "04": certRecordFields,
  "05": certRecordFields,
  "06": certRecordFields,
  "07": certRecordFields,
  "08": certRecordFields,
}