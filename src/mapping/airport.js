// Common Setters and Maps

var setBase = function (session, name, val) {
  if (val) {
    if (typeof session.runway.base == 'undefined')
      session.runway.base = {};
    session.runway.base[name] = val;
  }
}

var setRecip = function (session, name, val) {
  if (val) {
    if (typeof session.runway.recip == 'undefined')
      session.runway.recip = {};
    session.runway.recip[name] = val;
  }
}

var convertDegreeToDecimal = function (degree) {
  var decimal = (parseFloat(degree.substr(0, degree.length - 1))) / 3600;
  var heading = degree.substr(-1);
  return (heading == 'S' || heading == 'W') ? -decimal : decimal;
}

var yesNo = { "Y": true, "N": false }

module.exports.selector = "^.{3}";
module.exports.fieldsets = {
  "APT": {
    set: function (session, name, val) {
      if (val)
        session.airport[name] = val;
    },
    before: function (session) {
      if (typeof session.airport != 'undefined') {
        var promise = session.onItem(session.airport);
        if (session.promises) {
          session.promises.push(promise)
        } else {
          session.promises = [promise]
        }
      }
      session.airport = {};
    },
    fields: [
      { name: "REC_TYPE", size: 3, ignore: true },
      { name: "faaId", size: 11, ignore: true },
      { name: "type", size: 13 },
      { name: "locationIdent", size: 4 },
      { name: "effectiveDate", size: 10, type: "date", format: "MM/dd/YYYY", ignore: true },

      // ------------------ DEMOGRAPHIC DATA ---------------------
      { name: "faaRegionCode", size: 3, ignore: true },
      { name: "faaDistrictCode", size: 4, ignore: true },

      { name: "state", size: 2 },
      { name: "STATE_NAME", size: 20, ignore: true },
      { name: "county", size: 21, ignore: true },
      { name: "countyState", size: 2, ignore: true },
      { name: "city", size: 40 },

      { name: "name", size: 50 },
      { name: "ownership", size: 2, ignore: true },
      { name: "usage", size: 2, ignore: true },

      // ------------------ OWNERSHIP DATA ---------------------
      {
        name: "OWNER_NAME", size: 35, set: function (session, name, val) {
          if (typeof session.airport.owner == 'undefined')
            session.airport.owner = {};

          session.airport.owner.name = val;

        }, ignore: true
      },
      {
        name: "OWNER_STREET1", size: 72, set: function (session, name, val) {
          session.airport.owner.address = {
            street1: val
          };

        }, ignore: true
      },
      {
        name: "OWNER_CITY_STATE_ZIPCODE", size: 45, set: function (session, name, val) {

          var re = /^([^,]+),\s*([^\s]+)\s*(.*)$/i;
          var cityStateZip = val.match(re);

          if (cityStateZip) {
            session.airport.owner.address.city = cityStateZip[1];
            session.airport.owner.address.state = cityStateZip[2];
            session.airport.owner.address.zipcode = cityStateZip[3];
          }
        }, ignore: true
      },
      {
        name: "OWNER_PHONE", size: 16, set: function (session, name, val) {
          session.airport.owner.phone = val;

        }, ignore: true
      },

      {
        name: "MANAGER_NAME", size: 35, set: function (session, name, val) {
          if (typeof session.airport.manager == 'undefined')
            session.airport.manager = {};

          session.airport.manager.name = val;

        }, ignore: true
      },
      {
        name: "MANAGER_STREET1", size: 72, set: function (session, name, val) {
          session.airport.manager.address = {
            street1: val
          };

        }, ignore: true
      },
      {
        name: "MANAGER_CITY_STATE_ZIPCODE", size: 45, set: function (session, name, val) {

          var re = /^([^,]+),\s*([^\s]+)\s*(.*)$/i;
          var cityStateZip = val.match(re);

          if (cityStateZip) {
            session.airport.manager.address.city = cityStateZip[1];
            session.airport.manager.address.state = cityStateZip[2];
            session.airport.manager.address.zipcode = cityStateZip[3];
          }
        }, ignore: true
      },
      {
        name: "MANAGER_PHONE", size: 16, set: function (session, name, val) {
          session.airport.phone = val;
        }
      },

      // ------------------ GEOGRAPHIC DATA ---------------------
      { name: "LATITUDE_FORMATTED", size: 15, ignore: true },
      {
        name: "LATITUDE_SECONDS", size: 12, set: function (session, name, value) {
          session.airport.location = {
            type: "Point",
            coordinates: [convertDegreeToDecimal(value)]
          }
        }
      },
      { name: "LONGITUDE_FORMATTED", size: 15, ignore: true },
      {
        name: "LONGITUDE_SECONDS", size: 12, set: function (session, name, value) {
          session.airport.location.coordinates.push(convertDegreeToDecimal(value));
        }
      },
      { name: "locationDetermination", size: 1, map: { "E": "ESTIMATED", "S": "SURVEYED" }, ignore: true },

      { name: "elevation", size: 7, type: "int" },
      { name: "elevationDetermination", size: 1, map: { "E": "ESTIMATED", "S": "SURVEYED" }, ignore: true },

      { name: "magneticVariation", size: 3 },
      { name: "magneticVariationEpochYear", size: 4, ignore: true },

      { name: "patternAltitude", size: 4, type: "int" },
      { name: "sectional", size: 30, ignore: true },
      { name: "nearestCityDistance", size: 2, type: "int", ignore: true },
      { name: "bizCenterDirection", size: 3, type: "int", ignore: true },

      { name: "landArea", size: 5, type: "float", ignore: true },

      // ------------------ FAA SERVICES --------------------- 
      {
        name: "BDRY_ARTCC_IDENT", size: 4, set: function (session, name, value) {
          session.airport.boundaryARTCC = {
            ident: value
          }
        }, ignore: true
      },
      {
        name: "BDRY_ARTCC_COMP_IDENT", size: 3, set: function (session, name, value) {
          session.airport.boundaryARTCC.computerIdent = value;
        }, ignore: true
      },
      {
        name: "BDRY_ARTCC_NAME", size: 30, set: function (session, name, value) {
          session.airport.boundaryARTCC.name = value;
        }, ignore: true
      },
      {
        name: "RESP_ARTCC_IDENT", size: 4, set: function (session, name, value) {
          session.airport.responsibleARTCC = {
            ident: value
          }
        }, ignore: true
      },
      {
        name: "RESP_ARTCC_COMP_IDENT", size: 3, set: function (session, name, value) {
          session.airport.responsibleARTCC.computerIdent = value;
        }, ignore: true
      },
      {
        name: "RESP_ARTCC_NAME", size: 30, set: function (session, name, value) {
          session.airport.responsibleARTCC.name = value;
        }, ignore: true
      },
      { name: "fssOnPrem", size: 1, map: yesNo, ignore: true },
      {
        name: "FSS_IDENT", size: 4, set: function (session, name, value) {
          session.airport.fssPrimary = {
            ident: value
          }
        }, ignore: true
      },
      {
        name: "FSS_NAME", size: 30, set: function (session, name, value) {
          session.airport.fssPrimary.name = value;
        }, ignore: true
      },
      {
        name: "FSS_LOCAL_PHONE", size: 16, set: function (session, name, value) {
          session.airport.fssPrimary.localPhone = value;
        }, ignore: true
      },
      {
        name: "FSS_TOLLFREE_PHONE", size: 16, set: function (session, name, value) {
          session.airport.fssPrimary.tollfreePhone = value;
        }, ignore: true
      },


      {
        name: "ALT_FSS_IDENT", size: 4, set: function (session, name, value) {
          session.airport.fssAlternate = {
            ident: value
          }
        }, ignore: true
      },
      {
        name: "ALT_FSS_NAME", size: 30, set: function (session, name, value) {
          session.airport.fssAlternate.name = value;
        }, ignore: true
      },
      {
        name: "ALT_FSS_TOLLFREE_PHONE", size: 16, set: function (session, name, value) {
          session.airport.fssAlternate.tollfreePhone = value;
        }, ignore: true
      },

      { name: "notamIdent", size: 4, ignore: true },
      { name: "notamAvailable", size: 1, map: yesNo, ignore: true },

      // ------------------ FEDERAL STATUS ---------------------
      { name: "activationDate", size: 7, ignore: true },
      { name: "statusCode", size: 2, map: { "CI": "Closed Indefinitely", "CP": "Closed Permanently", "O": "Operational" }, ignore: true },
      { name: "arffCertTypeAndDate", size: 15, ignore: true },
      { name: "npiasFedAgreementCode", size: 7, split: 1, ignore: true },
      { name: "airspaceAnalysisDetermination", size: 13, ignore: true },
      { name: "isInternational", size: 1, map: yesNo, ignore: true },
      { name: "hasCustoms", size: 1, map: yesNo, ignore: true },
      { name: "isJointUse", size: 1, map: yesNo, ignore: true },
      { name: "isMiliataryAllowed", size: 1, map: yesNo, ignore: true },

      // ------------------ AIRPORT INSPECTION DATA ---------------------
      { name: "inspectionMethod", size: 2, ignore: true },
      { name: "inspectionAgency", size: 1, ignore: true },
      { name: "lastInspected", size: 8, type: "date", format: "MMddYYYY", ignore: true },
      { name: "lastRequested", size: 8, type: "date", format: "MMddYYYY", ignore: true },

      // ------------------ AIRPORT SERVICES ---------------------
      { name: "fuelTypes", size: 40, split: 5, ignore: true },
      { name: "airframeRepair", size: 5, ignore: true },
      { name: "powerPlantRepair", size: 5, ignore: true },
      { name: "oxygenBottleTypes", size: 8, ignore: true },
      { name: "oxygenBulkTypes", size: 8, ignore: true },

      // ------------------ AIRPORT FACILITIES ---------------------
      { name: "lightSchedule", size: 7, ignore: true },
      { name: "beaconLightSchedule", size: 7, ignore: true },
      { name: "hasTower", size: 1, map: yesNo },
      { name: "unicom", size: 7 },
      { name: "ctaf", size: 7 },
      { name: "hasSegmentedCircle", size: 4, map: { "Y": true, "N": false, "NONE": false, "Y-L": true }, ignore: true },
      { name: "beaconLenseColor", size: 3, map: { "CG": "CLEAR-GREEN", "CY": "CLEAR-YELLOW", "CGY": "CLEAR-GREEN-YELLOW", "SCG": "SPLIT-CLEAR-GREEN", "C": "CLEAR", "Y": "YELLOW", "G": "GREEN", "N": "NONE" }, ignore: true },
      { name: "hasLandingFee", size: 1, map: yesNo },
      { name: "hasMedicalUse", size: 1, map: yesNo, ignore: true },


      // -------------------- BASED AIRCRAFT ----------------------
      { name: "numberSingleEngineAircraft", size: 3, type: "int", ignore: true },
      { name: "numberMultiEngineAircraft", size: 3, type: "int", ignore: true },
      { name: "numberJetEngineAircraft", size: 3, type: "int", ignore: true },
      { name: "numberRotocraft", size: 3, type: "int", ignore: true },
      { name: "numberGliders", size: 3, type: "int", ignore: true },
      { name: "numberMilitaryAircraft", size: 3, type: "int", ignore: true },
      { name: "numberUltraLightAircraft", size: 3, type: "int", ignore: true },

      // ------------------ ANNUAL OPERATIONS ----------------------
      { name: "commercialServiceOperations", size: 6, type: "int", ignore: true },
      { name: "commuterServiceOperations", size: 6, type: "int", ignore: true },
      { name: "airTaxiOperations", size: 6, type: "int", ignore: true },
      { name: "gaLocalOperations", size: 6, type: "int", ignore: true },
      { name: "itinerantOperations", size: 6, type: "int", ignore: true },
      { name: "militaryAircraftOperations", size: 6, type: "int", ignore: true },

      { name: "operationDataLastUpdated", size: 10, type: "date", format: "MM/dd/YYYY", ignore: true },

      // --------------- ADDITIONAL AIRPORT DATA -------------------
      { name: "positionSource", size: 16, ignore: true },
      { name: "positionSourceDate", size: 10, type: "date", ignore: true },
      { name: "elevationSource", size: 16, ignore: true },
      { name: "elevationSourceDate", size: 10, type: "date", ignore: true },
      { name: "hasContractFuel", size: 1, map: yesNo, ignore: true },
      { name: "transientStorageFacilities", size: 12, split: 4, ignore: true },
      { name: "otherServices", size: 71, split: ',', ignore: true },
      { name: "hasWindIndicator", size: 3, map: { "N": false, "Y": true, "Y-L": true }, ignore: true },
      { name: "ident", size: 7 },
      { name: "RECORD_END", size: 312, ignore: true }
    ]
  },
  "ATT": {
    fields: [
      { name: "REC_TYPE", size: 3, ignore: true },
      { name: "SITE_NUM", size: 11, ignore: true },
      { name: "STATE", size: 2, ignore: true },
      { name: "SEQ_NUM", size: 2, ignore: true },
      {
        name: "SCHEDULE", size: 108, set: function (session, name, val) {
          session.airport.attendance.push(val);
        }, ignore: true
      },
      { name: "RECORD_END", size: 1403, ignore: true }
    ],
  },
  "RWY": {
    set: function (session, name, val) {
      if (val)
        session.runway[name] = val;
    },
    before: function (session) {
      delete session.runway;
      session.runway = {};
    },
    after: function (session) {
      if (typeof session.airport.runways == "undefined")
        session.airport.runways = [];
      session.airport.runways.push(session.runway);
    },
    fields: [
      { name: "REC_TYPE", size: 3, ignore: true },
      { name: "SITE_NUM", size: 11, ignore: true },
      { name: "STATE", size: 2, ignore: true },
      { name: "ident", size: 7 },
      { name: "length", size: 5, type: "int" },
      { name: "width", size: 4, type: "int" },
      { name: "surfaceTypeAndCondition", size: 12 },
      { name: "surfaceTreatment", size: 5, ignore: true },
      { name: "pavementClass", size: 11, ignore: true },
      { name: "lightEdgeIntensity", size: 5, ignore: true },

      /**
       * Base Info
       */
      { name: "ident", size: 3, set: setBase },
      { name: "trueAlignment", size: 3, set: setBase, type: "int" },
      { name: "typeOfILS", size: 10, set: setBase, ignore: true },
      { name: "isRightTraffic", size: 1, set: setBase, map: yesNo },
      { name: "markingsType", size: 5, set: setBase, map: { "PIR": "PRECISION INSTRUMENT", "NPI": "NONPRECISION INSTRUMENT", "BSC": "BASIC", "NRS": "NUMBERS ONLY", "NSTD": "NONSTANDARD", "BUOY": "BUOYS", "STOL": "SHORT TAKEOFF AND LANDING", "NONE": "NONE" }, ignore: true },
      { name: "markingsCondition", size: 1, set: setBase, map: { "G": "GOOD", "F": "FAIR", "P": "POOR" }, ignore: true },

      { name: "BASE_LATITUDE_FORMATTED", size: 15, ignore: true },
      {
        name: "BASE_LATITUDE_SECONDS", size: 12, set: function (session, name, value) {
          if (value)
            session.runway.base.location = {
              type: "Point",
              coordinates: [convertDegreeToDecimal(value)]
            }
        }, ignore: true
      },
      { name: "BASE_LONGITUDE_FORMATTED", size: 15, ignore: true },
      {
        name: "BASE_LONGITUDE_SECONDS", size: 12, set: function (session, name, value) {
          if (value)
            session.runway.base.location.coordinates.push(convertDegreeToDecimal(value));
        }, ignore: true
      },
      { name: "elevationAtEnd", size: 7, set: setBase, type: "float" },
      { name: "thresholdCrossingHeight", size: 3, set: setBase, type: "float", ignore: true },
      { name: "visualGlidePathAngle", size: 4, set: setBase, type: "float", ignore: true },
      { name: "BASE_LATITUDE_THRESHOLD_FORMATTED", size: 15, ignore: true },
      {
        name: "BASE_LATITUDE_THRESHOLD_SECONDS", size: 12, set: function (session, name, value) {
          if (value) {
            session.runway.base.locationOfThreshold = {
              type: "Point",
              coordinates: [convertDegreeToDecimal(value)]
            }
          }
        }, ignore: true
      },
      { name: "BASE_LONGITUDE_THRESHOLD_FORMATTED", size: 15, ignore: true },
      {
        name: "BASE_LONGITUDE_THRESHOLD_SECONDS", size: 12, set: function (session, name, value) {
          if (value)
            session.runway.base.locationOfThreshold.coordinates.push(convertDegreeToDecimal(value));
        }, ignore: true
      },
      { name: "elevationAtThreashold", size: 7, set: setBase, type: "float", ignore: true },
      { name: "lengthOfThreashold", size: 4, set: setBase, type: "float", ignore: true },
      { name: "touchDownElevation", size: 7, set: setBase, type: "float" },

      { name: "visualGSIndicators", size: 5, set: setBase, ignore: true },
      { name: "visualRangeEquipment", size: 3, set: setBase, ignore: true },
      { name: "hasRVVEquipment", size: 1, set: setBase, map: yesNo, ignore: true },
      { name: "approachLightSystem", size: 8, set: setBase, ignore: true },
      { name: "hasBaseIdentifierLights", size: 1, set: setBase, map: yesNo, ignore: true },
      { name: "hasCenterlineLight", size: 1, set: setBase, map: yesNo, ignore: true },
      { name: "hasEndTouchDownLights", size: 1, set: setBase, map: yesNo, ignore: true },

      { name: "controlObjDesc", size: 11, set: setBase, ignore: true },
      { name: "controlObjMarked", size: 4, set: setBase, ignore: true },
      { name: "faaPart77", size: 5, set: setBase, ignore: true },
      { name: "controlObjClearanceSlope", size: 2, set: setBase, ignore: true },
      { name: "controlObjHeighAboveRunway", size: 5, set: setBase, type: "int", ignore: true },
      { name: "controlObjDistanceFromRunway", size: 5, set: setBase, type: "int", ignore: true },
      { name: "controlObjCenterlineOffset", size: 7, set: setBase, type: "int", ignore: true },


      /**
       * Recip Info
       */
      { name: "ident", size: 3, set: setRecip },
      { name: "trueAlignment", size: 3, set: setRecip, type: "int" },
      { name: "typeOfILS", size: 10, set: setRecip, ignore: true },
      { name: "isRightTraffic", size: 1, set: setRecip, map: yesNo },
      { name: "markingsType", size: 5, set: setRecip, map: { "PIR": "PRECISION INSTRUMENT", "NPI": "NONPRECISION INSTRUMENT", "BSC": "BASIC", "NRS": "NUMBERS ONLY", "NSTD": "NONSTANDARD", "BUOY": "BUOYS", "STOL": "SHORT TAKEOFF AND LANDING", "NONE": "NONE" }, ignore: true },
      { name: "markingsCondition", size: 1, set: setRecip, map: { "G": "GOOD", "F": "FAIR", "P": "POOR" }, ignore: true },

      { name: "BASE_LATITUDE_FORMATTED", size: 15, ignore: true },
      {
        name: "BASE_LATITUDE_SECONDS", size: 12, set: function (session, name, value) {
          if (value)
            session.runway.base.location = {
              type: "Point",
              coordinates: [convertDegreeToDecimal(value)]
            }
        }, ignore: true
      },
      { name: "BASE_LONGITUDE_FORMATTED", size: 15, ignore: true },
      {
        name: "BASE_LONGITUDE_SECONDS", size: 12, set: function (session, name, value) {
          if (value)
            session.runway.base.location.coordinates.push(convertDegreeToDecimal(value));
        }, ignore: true
      },
      { name: "elevationAtEnd", size: 7, set: setRecip, type: "float" },
      { name: "thresholdCrossingHeight", size: 3, set: setRecip, type: "float", ignore: true },
      { name: "visualGlidePathAngle", size: 4, set: setRecip, type: "float", ignore: true },
      { name: "BASE_LATITUDE_THRESHOLD_FORMATTED", size: 15, ignore: true },
      {
        name: "BASE_LATITUDE_THRESHOLD_SECONDS", size: 12, set: function (session, name, value) {
          if (value) {
            session.runway.base.locationOfThreshold = {
              type: "Point",
              coordinates: [convertDegreeToDecimal(value)]
            }
          }
        }, ignore: true
      },
      { name: "BASE_LONGITUDE_THRESHOLD_FORMATTED", size: 15, ignore: true },
      {
        name: "BASE_LONGITUDE_THRESHOLD_SECONDS", size: 12, set: function (session, name, value) {
          if (value)
            session.runway.base.locationOfThreshold.coordinates.push(convertDegreeToDecimal(value));
        }, ignore: true
      },
      { name: "elevationAtThreashold", size: 7, set: setRecip, type: "float", ignore: true },
      { name: "lengthOfThreashold", size: 4, set: setRecip, type: "float", ignore: true },
      { name: "touchDownElevation", size: 7, set: setRecip, type: "float" },

      { name: "visualGSIndicators", size: 5, set: setRecip, ignore: true },
      { name: "visualRangeEquipment", size: 3, set: setRecip, ignore: true },
      { name: "hasRVVEquipment", size: 1, set: setRecip, map: yesNo, ignore: true },
      { name: "approachLightSystem", size: 8, set: setRecip, ignore: true },
      { name: "hasBaseIdentifierLights", size: 1, set: setRecip, map: yesNo, ignore: true },
      { name: "hasCenterlineLight", size: 1, set: setRecip, map: yesNo, ignore: true },
      { name: "hasEndTouchDownLights", size: 1, set: setRecip, map: yesNo, ignore: true },

      { name: "controlObjDesc", size: 11, set: setRecip, ignore: true },
      { name: "controlObjMarked", size: 4, set: setRecip, ignore: true },
      { name: "faaPart77", size: 5, set: setRecip, ignore: true },
      { name: "controlObjClearanceSlope", size: 2, set: setRecip, ignore: true },
      { name: "controlObjHeighAboveRunway", size: 5, set: setRecip, type: "int", ignore: true },
      { name: "controlObjDistanceFromRunway", size: 5, set: setRecip, type: "int", ignore: true },
      { name: "controlObjCenterlineOffset", size: 7, set: setRecip, type: "int", ignore: true },


      { name: "lengthSource", size: 16, ignore: true },
      { name: "lengthSourceDate", size: 10, type: "date", ignore: true },
      { name: "weightLimitSingleWheel", size: 6, type: "float", ignore: true },
      { name: "weightLimitDualWheel", size: 6, type: "float", ignore: true },
      { name: "weightLimit2DualWheel1", size: 6, type: "float", ignore: true },
      { name: "weightLimit2DualWheel2", size: 6, type: "float", ignore: true },

      /**
       * Base End Data
       */
      { name: "gradient", size: 5, set: setBase, ignore: true },
      { name: "gradientDirection", size: 4, set: setBase, ignore: true },
      { name: "positionSource", size: 16, set: setBase, ignore: true },
      { name: "positionSourceDate", size: 10, set: setBase, type: "date", ignore: true },
      { name: "elevationSource", size: 16, set: setBase, ignore: true },
      { name: "elevationSourceDate", size: 10, set: setBase, type: "date", ignore: true },
      { name: "thresholdPositionSource", size: 16, set: setBase, ignore: true },
      { name: "thresholdPositionSourceDate", size: 10, set: setBase, type: "date", ignore: true },
      { name: "thresholdElevationSource", size: 16, set: setBase, ignore: true },
      { name: "thresholdElevationSourceDate", size: 10, set: setBase, type: "date", ignore: true },
      { name: "tdznElevationSource", size: 16, set: setBase, ignore: true },
      { name: "tdznElevationSourceDate", size: 10, set: setBase, type: "date", ignore: true },
      { name: "tora", size: 5, set: setBase, type: "int", ignore: true },
      { name: "toda", size: 5, set: setBase, type: "int", ignore: true },
      { name: "asda", size: 5, set: setBase, type: "int", ignore: true },
      { name: "lda", size: 5, set: setBase, type: "int", ignore: true },
      { name: "lasho", size: 5, set: setBase, type: "int", ignore: true },
      { name: "lashoIntersetRunwayIdent", size: 7, set: setBase, ignore: true },
      { name: "lashoEntity", size: 40, set: setBase, ignore: true },
      { name: "BASE_LAHSO_LATITUDE_FORMATTED", size: 15, ignore: true },
      {
        name: "BASE_LAHSO_LATITUDE_SECONDS", size: 12, set: function (session, name, value) {
          if (value) {
            session.runway.base.lashoLocation = {
              type: "Point",
              coordinates: [convertDegreeToDecimal(value)]
            }
          }
        }, ignore: true
      },
      { name: "BASE_LAHSO_LONGITUDE_FORMATTED", size: 15, ignore: true },
      {
        name: "BASE_LAHSO_LONGITUDE_SECONDS", size: 12, set: function (session, name, value) {
          if (value)
            session.runway.base.lashoLocation.coordinates.push(convertDegreeToDecimal(value))
        }, ignore: true
      },
      { name: "lashoPositionSource", size: 16, set: setBase, ignore: true },
      { name: "lashoPositionSourceDate", size: 10, set: setBase, type: "date", ignore: true },

      /**
       * Reciprocal End Data
       */
      { name: "gradient", size: 5, set: setRecip, ignore: true },
      { name: "gradientDirection", size: 4, set: setRecip, ignore: true },
      { name: "positionSource", size: 16, set: setRecip, ignore: true },
      { name: "positionSourceDate", size: 10, set: setRecip, type: "date", ignore: true },
      { name: "elevationSource", size: 16, set: setRecip, ignore: true },
      { name: "elevationSourceDate", size: 10, set: setRecip, type: "date", ignore: true },
      { name: "thresholdPositionSource", size: 16, set: setRecip, ignore: true },
      { name: "thresholdPositionSourceDate", size: 10, set: setRecip, type: "date", ignore: true },
      { name: "thresholdElevationSource", size: 16, set: setRecip, ignore: true },
      { name: "thresholdElevationSourceDate", size: 10, set: setRecip, type: "date", ignore: true },
      { name: "tdznElevationSource", size: 16, set: setRecip, ignore: true },
      { name: "tdznElevationSourceDate", size: 10, set: setRecip, type: "date", ignore: true },
      { name: "tora", size: 5, set: setRecip, type: "int", ignore: true },
      { name: "toda", size: 5, set: setRecip, type: "int", ignore: true },
      { name: "asda", size: 5, set: setRecip, type: "int", ignore: true },
      { name: "lda", size: 5, set: setRecip, type: "int", ignore: true },
      { name: "lasho", size: 5, set: setRecip, type: "int", ignore: true },
      { name: "lashoIntersetRunwayIdent", size: 7, set: setRecip, ignore: true },
      { name: "lashoEntity", size: 40, set: setRecip, ignore: true },
      { name: "BASE_LAHSO_LATITUDE_FORMATTED", size: 15, ignore: true },
      {
        name: "BASE_LAHSO_LATITUDE_SECONDS", size: 12, set: function (session, name, value) {
          if (value) {
            session.runway.recip.lashoLocation = {
              type: "Point",
              coordinates: [convertDegreeToDecimal(value)]
            }
          }
        }, ignore: true
      },
      { name: "BASE_LAHSO_LONGITUDE_FORMATTED", size: 15, ignore: true },
      {
        name: "BASE_LAHSO_LONGITUDE_SECONDS", size: 12, set: function (session, name, value) {
          if (value)
            session.runway.recip.lashoLocation.coordinates.push(convertDegreeToDecimal(value))
        }, ignore: true
      },
      { name: "lashoPositionSource", size: 16, set: setRecip, ignore: true },
      { name: "lashoPositionSourceDate", size: 10, set: setRecip, type: "date", ignore: true },


      { name: "RECORD_END", size: 388, ignore: true }
    ]
  },
  "ARS": {
    set: function (session, name, val) {
      if (val)
        session.arrestDevices[name] = val;
    },
    before: function (session) {
      delete session.arrestDevices;
      session.arrestDevices = {};
    },
    after: function (session) {
      if (typeof session.airport.arrestDevices == "undefined")
        session.airport.arrestDevices = [];
      session.airport.arrestDevices.push(session.arrestDevices);
    },
    fields: [
      { name: "REC_TYPE", size: 3, ignore: true },
      { name: "SITE_NUM", size: 11, ignore: true },
      { name: "STATE", size: 2, ignore: true },
      { name: "baseIdent", size: 7 },
      { name: "recipIdent", size: 3 },
      { name: "type", size: 9 },
      { name: "RECORD_END", size: 1494, ignore: true }
    ]
  },
  "RMK": {
    set: function (session, name, val) {
      if (val)
        session.remark[name] = val;
    },
    before: function (session) {
      delete session.remark;
      session.remark = {};
    },
    fields: [
      { name: "REC_TYPE", size: 3, ignore: true },
      { name: "SITE_NUM", size: 11, ignore: true },
      { name: "STATE", size: 2, ignore: true },
      { name: "name", size: 13, ignore: true },
      { name: "text", size: 1500, ignore: true }
    ]
  }
}

