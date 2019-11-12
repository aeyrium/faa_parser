const fs = require('fs');
const lineByLine = require('n-readlines');
const assert = require('assert');
const moment = require('moment');

module.exports = class Parser {

  constructor(mapping) {
    this.mapping = mapping;
    this.lineCount = 0;
    this.session = {};
  }

  /**
   * 
   * @param {*} sourceFile The source APT.txt file to parse into JSON objects
   * @param {*} onItem The function that takes the individual JSON objects, must return a Promise.
   * @returns Promise
   */
  parse(sourceFile, onItem) {
    this.session.onItem = onItem
    const liner = new lineByLine(sourceFile)
    let line;
    while (line = liner.next()) {
      _processLine(this, line.toString('ascii'))
      this.lineCount++
    }
    return Promise.all(this.session.promises)
  }
}

function _processLine(parser, line) {
  if (parser.mapping.beforeLine) {
    line = parser.mapping.beforeLine(line, parser.lineCount);
  }
  const recType = _getRecType(line, parser.mapping);
  // select the correct fieldset for the record type
  const fieldSet = parser.mapping.fieldsets[recType];
  if (!fieldSet.ignore) {
    try {
      if (fieldSet.before)
        fieldSet.before(parser.session);

      // reset pos pointer to the start of the line
      var pos = 0;
      fieldSet.fields.forEach((field) => {
        if (!field.ignore) { // fields may be 'ignored' so first check

          // strip out the entire field as defined in the field object and trim it of any whitespace
          var val = line.substr(pos, field.size).trim();
          //console.log("field[%s]:%s", field.name, val)

          // now that we have the trimed value, let's figure out what to do with it ...
          if (field.split) {
            // if 'split' is defined, then the value is first split into an array of values
            val = _split(val, field.split);
          } else if (field.map) {
            // if 'map' is defined, then replace the value with the map value
            val = field.map[val];
          }

          try {
            if (field.type) {
              switch (field.type) {
                case "int":
                  val = parseInt(val);
                  break;
                case "float":
                  val = parseFloat(val);
                  break;
                case "boolean":
                  val = parseFloat(val);
                  break;
                case "date":
                  val = parseDate(val, field.format);
                  break;
                // default:
                //     val = toTitleCase(val);
              }
            }
          } catch (exp) {
            console.log("WARNING: Unabled to coerce field[%s]=%s into type %s", field.name, val, field.type);
          }

          // next decide if we will asign the value using the default behavior or if custom logic is specified
          // by setting the 'set' function in the field...
          if (field.set) {
            field.set(parser.session, field.name, val);
          } else {
            fieldSet.set(parser.session, field.name, val);
          }

        }
        if (line.charAt)
          // advance the pos pointer to the next field start position
          pos += field.size;
      })

      if (fieldSet.after)
        fieldSet.after(parser.session);

    } catch (exp) {
      console.log("Exception: [line: %s][%s]", parser.lineCount, exp.message);
      console.log("Source: [%s]", line);
      console.log(exp.stack)
    }
  }
  return recType;
}

function _getRecType(line, mapping) {
  if (mapping.selector) {
    var matches = line.match(new RegExp(mapping.selector, "i"));
    assert(matches && matches.length > 0, "RegExp %j does not match on selector.", mapping.selector);
    return (matches.length > 1) ? matches[1] : matches[0];
  } else {
    return "default";
  }
}

function _split(val, size) {
  if (val) {
    if (typeof size == "number") {
      var list = [];
      for (var ndx = 0; ndx < val.length; ndx += size) {
        var part = val.substr(ndx, size).trim();
        if (part)
          list.push(part.replace(',', ''));
      }
      return list;
    } else { // assume split on character
      return val.split(size);
    }
  }
  // if val is an empty string or otherwise undefined, then return it as the val
  return val;
}

function parseDate(val, srcformat) {
  if (val) {
    var date = (srcformat) ? moment(val, srcformat) : moment(val, "MM/DD/YYYY");
    if (date.isValid()) {
      return date.format("YYYY-MM-DD");
    } else {
      throw new Error("Invalid Date %s", val);
    }
  }
  return "";
}
