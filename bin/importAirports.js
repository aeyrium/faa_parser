#!/usr/bin/env node
const FAA = require('../index');
const path = require('path');
const cli = require('cli');
const geofirex = require('geofirex');
const fs = require('fs');
const os = require('os');
const Case = require('case');

cli.parse({
  credentails: ['c', 'Firebase credentials', 'file', false],
  destDir: ['o', 'A file to process', 'file', false],
}, ['parse', 'load']);


cli.main(async (args, options) => {
  if (cli.argc != 1) {
    cli.fatal('Insufficient number of arguments');
  } else {
    var srcPath = resolve(args[0])
    switch (cli.command) {
      case 'load':
        if (options.credentails) {
          await load(srcPath, resolve(options.credentails))
        } else {
          cli.fatal('Missing --credentials option for "load" command.')
        }
        break;
      case 'parse':
        parseFile(srcPath, resolve(options.destDir || fs.mkdtempSync('APT_')));
        break;
      default:
        cli.fatal('Invalid command.');
    }
  }
  cli.exit(0);
  cli.ok('Finished!');
})



function resolve(srcPath) {
  if (!path.isAbsolute(srcPath)) {
    srcPath = path.join(process.cwd(), srcPath);
  }
  return srcPath;
}

function load(srcPath, credPath) {
  const admin = require('firebase-admin');
  const serviceAccount = require(credPath);
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
  const geo = geofirex.init(admin);

  var stats = fs.statSync(srcPath);
  if (stats.isDirectory()) {
    return loadFromDir(srcPath, admin.firestore(), geo);
  } else {
    return loadFromFile(srcPath, admin.firestore(), geo);
  }
}

function loadFromDir(dirPath, db, geo) {
  var files = fs.readdirSync(dirPath);
  return Promise.all(files.map((filePath) => {
    var fullPath = path.join(dirPath, filePath)
    return loadFromFile(fullPath, db, geo)
  }));
}

function loadFromFile(filePath, db, geo) {
  // Read airport file
  let airport = JSON.parse(fs.readFileSync(filePath).toString('utf8'));
  // Convert the lat/lon into Firestore GeoPoint data
  let coord = airport.location.coordinates;
  airport.location = geo.point(coord[0], coord[1]).data;
  // Extract the runways so they can be stored in a sub-collection
  let runways = airport.runways;
  delete airport.runways;

  // Adjust case of city and name to Title Case
  airport.name = Case.capital(airport.name);
  airport.city = Case.capital(airport.city);

  // Create a batch action to save the airport and runway documents
  let batch = db.batch();
  let id = airport.ident || airport.locationIdent;
  batch.set(db.doc(`Airport/${id}`), airport)
  runways.forEach((runway) => {
    let rid = runway.ident.replace('/', '-');
    batch.set(db.doc(`Airport/${id}/runways/${rid}`), runway);
  })

  // Now commit the batch actions
  cli.spinner(`Loading Airport/${id} ...`)
  return batch.commit()
}

function parseFile(srcFile, destDir) {
  const parser = new FAA.Parser(FAA.Airport);
  parser.parse(srcFile, (item) => {
    let id = item.ident || item.locationIdent;
    cli.spinner(`Saving Airport/${id} ...`)
    fs.writeFileSync(`${destDir}/${id}.json`, JSON.stringify(item, null, 2), 'utf8')
  });
}



