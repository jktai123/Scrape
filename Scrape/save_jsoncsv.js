const fs = require('fs')
const save_jsoncsv = (dir,f_lead,data) => {
    const directory = __dirname + '/'+dir;
    if(!fs.existsSync(directory)){
     fs.mkdirSync(directory)
    }
    writerStream = fs.createWriteStream( `${directory}/${f_lead}.json`);
    writerStream.write(JSON.stringify(data, undefined, 2), 'UTF8');
    writerStream.end();

    const { Parser } = require('json2csv');
    const json2csvParser = new Parser();
    const csv = json2csvParser.parse(data);
    

    fs.writeFile(`${directory}/${f_lead}.csv`, csv, function(err) {
        if (err) {
            return console.log(err);
        }
        
        console.log(` ${f_lead}.csv file was saved!`);
 
    });
 };
 module.exports = save_jsoncsv;