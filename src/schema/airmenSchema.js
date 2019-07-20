

const medicalSchema = {
  type: 'object',
  properties: {
    class: {type: 'string'},
    issued: {type: 'string', format: '^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}([-|+]\d\d:\d\d)?$'},
    expires: {type: 'string', format: '^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}([-|+]\d\d:\d\d)?$'},
  }
}

const ratingEnum = [
  'Advanced',
  'Lighter than Air',
  'Aircraft',
  'Airframe',
  'Airplanes',
  'FAA Service Inspector',
  'Airplane ME',
  'Airplane MEL',
  'Airplane MELC',
  'Airplane MES',
  'Airplane SE',
  'Airplane SEL',
  'Airplane SES',
  'Airplane SME',
  'Back',
  'Chest',
  'Aircraft Engine',
  'Federal Air Regs',
  'Glider',
  'Glider Tow',
  'Glider Tow and Ground Tow',
  'Glider Tow and Self-Launch',
  'Glider Ground Tow',
  'Glider Ground Tow & Self-Launch',
  'Glider Self-Launch',
  'Group I',
  'Group II',
  'Rotocraft-Gyroplane',
  'Rotocraft-Helicopter',
  'Rotocraft Helicopter & Gyroplane',
  'Inspection',
  'Instrument',
  'Instrument Airplane',
  'Instrument Helicopter',
  'Instrument Airplane & Helicopter',
  'Instrument Powered-Lift',
  'Turbojet',
  'Lap Parachute',
  'Lighter-than-Air',
  'Link Trainer Operator',
  'Maintenance',
  'Meteorology',
  'Navigation',
  'Powered-Lift',
  'Powerplant',
  'Radio Navigation',
  'Reciprocating Engine Powered',
  'Rotocraft',
  'Seat Parachute',
  'Sport',
  'Special Purpose',
  'Turboprop'
]

const certificateSchema = {
  type: 'object',
  properties: {
    faaId: {type: 'string'},
    type: {type: 'string', enum: [
      'Pilot',
      'Pilot (Foreign)',
      'Pilot (SP)',
      'CFI',
      'AAI',
      'Ground Instructor',
      'Flight Engineer',
      'Flight Engineer (SP)',
      'Flight Engineer (Foreign)',
      'Mechanic',
      'Control Tower Operator',
      'Repairman',
      'Repairman (Experimental)',
      'Repairman (LSA)',
      'Parachute Rigger',
      'Dispatcher',
      'Flight Navigator',
      'Flight Navigator (SP)',
      'Flight Attendant'
    ]},
    level: {type: 'string', enum: [
      'ATP',
      'Commercial',
      'Private', 
      'Recreational', 
      'Sport', 
      'Student',
      'Commercial',
      'Private',
      'Historic',
      'ATP',
      'Commercial',
      'Master',
      'Senior'
    ]},
    expries: {type: 'string', format: '^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}([-|+]\d\d:\d\d)?$'},
    ratings: {type: 'array', itmes: {type: 'string', enum: ratingEnum}},
    typeRatings: {type: 'array', itmes: {type: 'string', enum: ratingEnum}},
  }
}

module.exports = {
  type: 'object',
  properties: {
    faaId: {type: 'string'},
    fullname: {type: 'string'},
    street1: {type: 'string'},
    street2: {type: 'string'},
    city: {type: 'string'},
    state: {type: 'string', maxLength: 2},
    zipcode: {type: 'string', maxLength: 10},
    country: {type: 'string'},
    region: {type: 'string'},
    medical: medicalSchema,
    certificates: {type: 'array', items: certificateSchema}
  }
}

