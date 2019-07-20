/**
 * This is the mapping file for 
 */
var registrantTypeMap = {
    "1": "Individual",
    "2": "Partnership",
    "3": "Corporation",
    "4": "Co-Owned",
    "5": "Government",
    "8": "Non Citizen Corporation",
    "9": "Non Citizen Co-Owned"
};

var categoryMap = { // Standard
  "N": "Normal",
  "U": "Utility",
  "A": "Acrobatic",
  "T": "Transport",
  "G": "Glider",
  "B": "Balloon",
  "C": "Commuter",
  "L": "Lighter than Air",
  "P": "Power-Parachute",
  "W": "Weight-Shift-Control",
  "O": "Other"
}

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

var statusCodeMap = {
    "A": "The Triennial Aircraft Registration form was mailed and has not been returned by the Post Office",
    "D": "Expired Dealer",
    "E": "The Certificate of Aircraft Registration was revoked by enforcement action",
    "M": "Aircraft registered to the manufacturer under their Dealer Certificate",
    "N": "Non-citizen Corporations which have not returned their flight hour reports",
    "R": "Registration pending",
    "S": "Second Triennial Aircraft Registration Form has been mailed and has not been returned by the Post Office",
    "T": "Valid Registration from a Trainee",
    "V": "Valid Registration",
    "W": "Certificate of Registration has been deemed Ineffective or Invalid",
    "X": "Enforcement Letter",
    "Z": "Permanent Reserved",
    "1": "Triennial Aircraft Registration form was returned by the Post Office as undeliverable",
    "2": "N-Number Assigned – but has not yet been registered",
    "3": "N-Number assigned as a Non Type Certificated aircraft - but has not yet been registered",
    "4": "N-Number assigned as import - but has not yet been registered",
    "5": "Reserved N-Number",
    "6": "Administratively canceled",
    "7": "Sale reported",
    "8": "A second attempt has been made at mailing a Triennial Aircraft Registration form to the owner with no response",
    "9": "Certificate of Registration has been revoked",
    "10": "N-Number assigned, has not been registered and is pending cancellation",
    "11": "N-Number assigned as a Non Type Certificated (Amateur) but has not been registered that is pending cancellation",
    "12": "N-Number assigned as import but has not been registered that is pending cancellation",
    "13": "Registration Expired",
    "14": "First Notice for Re-Registration/Renewal",
    "15": "Second Notice for Re-Registration/Renewal",
    "16": "Registration Expired – Pending Cancellation",
    "17": "Sale Reported – Pending Cancellation",
    "18": "Sale Reported – Canceled",
    "19": "Registration Pending – Pending Cancellation",
    "20": "Registration Pending – Canceled",
    "21": "Revoked – Pending Cancellation",
    "22": "Revoked – Canceled",
    "23": "Expired Dealer (Pending Cancellation)",
    "24": "Third Notice for Re-Registration/Renewal",
    "25": "First Notice for Registration Renewal",
    "26": "Second Notice for Registration Renewal",
    "27": "Registration Expired",
    "28": "Third Notice for Registration Renewal",
    "29": "Registration Expired – Pending Cancellation"
};

const setRegistrant = (session, name, value) => {
    if (typeof session.aircraft.registrant == 'undefined')
        session.aircraft.registrant = {};
    session.aircraft.registrant[name] = value;
};

const addOtherName = (session, name, value) => {
    if (typeof session.aircraft.owners == 'undefined')
        session.aircraft.owners = [];
    if (value)
        session.aircraft.owners.push(value);
}

const setApprovedOps = (session, name, value) => {

  const maps = {
    "restricted": { // Restricted
      "0": "Other",
      "1": "Agriculture & Pest Control",
      "2": "Aerial Surveying",
      "3": "Aerial Advertising",
      "4": "Forest",
      "5": "Patrolling",
      "6": "Weather Control",
      "7": "Carriage of Cargo"
    },
    "experimental": { // Experimental
      "1": "Research & Development",
      "2": "Amateur Built",
      "3": "Exhibition",
      "4": "Racing",
      "5": "Crew Training",
      "6": "Market Survey",
      "7": "Kit Built",
      "8": "Light Sport",
      "9": "Unmanned Aircraft"
    },
    "provisional": { // Provisional
      "1": "Class I",
      "2": "Class II"
    },
    "multiple": { // Multiple
      "1": "Standard",
      "2": "Limited",
      "3": "Restricted"
    },
    "flight-permit": { // Special Flight Permit
      "1": "Ferry flight",
      "2": "Evacuate",
      "3": "Exceed Certificated",
      "4": "Delivery",
      "5": "Flight Testing",
      "6": "Customer Demo"
    }
  }

  const approvedOps = [];
  const chars = value.split('');
  switch (chars[0]) {
    case 1: // Standard
      approvedOps.push(`Standard - ${categoryMap[chars[1]]}`); 
      break;
    case 3: // Restricted
      for (const n=1; n<chars.length; n++) {
        if (maps['restricted'][chars[n]]) {
          approvedOps.push(`Restricted - ${maps['restricted'][chars[n]]}`); 
        }
      }
      break;
    case 4: // Experimental
      for (const n=1; n<chars.length; n++) {
        if (maps['experimental'][chars[n]]) {
          approvedOps.push(`Experimental - ${maps['experimental'][chars[n]]}`); 
        }
      }
      break;
    case 5: // Provisional
      approvedOps.push(`Provisional - ${maps['provisional'][chars[1]]}`); 
      break;
    case 6: // Multiple
      let label = null;
      switch (chars[1]) {
        case "2": 
          label="Limited";
          break;
        case "3":
          label="Restricted"
          break;
        default:
          label="Standard"
      }
      for (const n=3; n<chars.length; n++) {
        if (categoryMap[chars[n]]) {
          approvedOps.push(`${label} - ${categoryMap[chars[n]]}`); 
        }
      }
      break;
    case 8: // Special Flight Permit
      for (const n=1; n<chars.length; n++) {
        if (maps['category'][chars[n]]) {
          approvedOps.push(`Special Flight Permit - ${maps['flight-permit'][chars[n]]}`); 
        }
      }
      break;
    case 9: // Light Sport
      approvedOps.push(`Light Sport - ${categoryMap[chars[1]]}`); 
      break;
  }

  session.aircraft.approvedOps = approvedOps;
}

module.exports.beforeLine = function(line, lineNum) {
    return (lineNum > 0)? line.replace(/,/g, "") : null;
}
module.exports.fieldsets = {
    "default": {
        set: function(session, name, value) {
            if (value)
                session.aircraft[name] = value;
        },
        before: function(session, onItem) {
            if (session.aircraft) {
                onItem(session.aircraft);
                delete session.aircraft;    
            }
            session.aircraft = {};
        },
        fields: [
            { name: "tail_number", size: 5 },
            { name: "serial_number", size: 30 },
            { name: "aircraft_mfr_code", size: 7 },
            { name: "engine_mfr_code", size: 5 },
            { name: "mfr_year", size: 4 },
            { name: "type_registrant", size: 1, map: registrantTypeMap, set: setRegistrant},
            { name: "registrant_name", size: 50, set: setRegistrant },
            { name: "street1", size: 33, set: setRegistrant },
            { name: "street2", size: 33, set: setRegistrant },
            { name: "city", size: 18, set: setRegistrant },
            { name: "state", size: 2, set: setRegistrant },
            { name: "zipcode", size: 10, set: setRegistrant },
            { name: "region", size: 1, set: setRegistrant },
            { name: "county", size: 3 },
            { name: "country", size: 2 },
            { name: "last_activity_date", size: 8, type: "date", format: "YYYYMMDD" },
            { name: "certificate_issue_date", size: 8, type: "date", format: "YYYYMMDD" },
            { name: "classification", size: 1, map: categoryMap },
            { name: "approved_ops", size: 9, set: setApprovedOps },
            { name: "type_aircraft", size: 1, map: aircraftTypeMap },
            { name: "type_engine", size: 2, map: engineTypeMap },
            { name: "status_code", size: 2, map: statusCodeMap },
            { name: "mode_s_code", size: 8 },
            { name: "fractional", size: 1, set: function(session, name, value) {
                if (value.trim().toUpperCase() == "Y")
                    session.aircraft[name] = true;
                else 
                    session.aircraft[name] = false;
            } },
            { name: "airworthiness_date", size: 8, type: "date", format: "YYYYMMDD"},
            { name: "other_name_1", size: 50, set: addOtherName },
            { name: "other_name_2", size: 50, set: addOtherName },
            { name: "other_name_3", size: 50, set: addOtherName },
            { name: "other_name_4", size: 50, set: addOtherName },
            { name: "other_name_5", size: 50, set: addOtherName },
            { name: "expiration_date", size: 8, type: "date", format: "YYYY/MM/DD" },
            { name: "faa_id", size: 8 },
            { name: "kit_mfr", size: 30 },
            { name: "kit_model", size: 20 },
            { name: "mode_s_code_hex", size: 10 },
        ]
    }
};