const https = require('https');
const fs = require('fs');
const path = require('path');
const uuidv1 = require('uuid/v1');
const csvToJSON = require('csvtojson');

// Write function to fetch CSV writeFileSync
const downloadCSV = (url='https://prod-edxapp.edx-cdn.org/assets/courseware/v1/07d100219da1a726dad5eddb090fa215/asset-v1:Microsoft+DEV283x+2T2017+type@asset+block/customer-data.csv') => {
  console.log('Downloading CSV file at: ', url);

  const fetchFile = (urlF, callback) => {
    https.get(urlF, (response) => {
      let buff = '';

      response.on('data', (chunk) => {
        buff += chunk;
      })

      response.on('end', () => {
        // console.log('buff is typeof: ', typeof buff);
        // console.log('buff contains: ', buff);
        callback(null, buff);
      })
    }).on('error', (error) => {
      console.log(`An error has occurred: ${error.message}`);
      callback(error);
    })
  }

  const folderName = uuidv1();  // Create a unique string based on system timestamp

  fs.mkdirSync(folderName);     // Create folder name using unique string (folderName)

  fetchFile(url, (error, data) => {  // Call fetchFile functon
    if(error) {
      return console.log('An error occurred: ' + error);
    }

    fs.writeFileSync(path.join(__dirname, folderName, 'url.txt'), url); // Write URL downloaded out to url.txt

    csvToJSON()
    .fromString(data)
    .on("end_parsed", (jsonArrayObj) => {
      // console.log('buff is typeof: ', typeof jsonArrayObj);
      fs.writeFileSync(path.join(__dirname, folderName, 'file.json'), JSON.stringify(jsonArrayObj));
      console.log('Your download is complete, and can be found in folder: ', folderName);
    });
  })
}

downloadCSV(process.argv[2]);
