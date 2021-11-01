const { GoogleSpreadsheet } = require('google-spreadsheet');
const creds = require('./JKGoogleSheet.json'); // the file saved above
const doc_Id='18sT6CKuJzMPJnp4JDcOt3484rDVyj5YGh6IBLOB7S9I'
//Stock '1jx9hL4CZuyET00_6LYbcz4d23WLv7iMsLbcPR3xqGbo'
const doc = new GoogleSpreadsheet(doc_Id);
(async () => {
await doc.useServiceAccountAuth(creds);
// const doc = new GoogleSpreadsheet('<YOUR-DOC-ID>');

await doc.loadInfo(); // loads document properties and worksheets
console.log(`${doc.title}--- ${doc.sheetCount}`);
//await doc.updateProperties({ title: 'renamed doc' });

// create a sheet and set the header row
// const sheet = await doc.addSheet({ title:'新4',headerValues: ['name', 'email'] });
const sheet = doc.sheetsByTitle['新4'];
// append rows
const larryRow = await sheet.addRow({ email: 'Larry Page', name: 'larry@google.com' });
const moreRows = await sheet.addRows([
  { name: 'Sergey Brin', email: 'sergey@google.com' },
  { name: 'Eric Schmidt', email: 'eric@google.com' },
]);

// read rows
const sheet1 = doc.sheetsByTitle['0050'];
const rows = await sheet1.getRows(); // can pass in { limit, offset }
// console.log('--->'+rows.length);
// read/write row values
const ky= await sheet1.headerValues;
for (let i = 0; i < rows.length;i++){
        console.log(`${i+1}--${rows[i][sheet1.headerValues[0]]} -${rows[i][sheet1.headerValues[1]]} -- ${rows[i][sheet1.headerValues[2]]}`);    
}
console.log(rows[0][ky[3]]); // 'Larry Page'
rows[1].email = 'sergey@abc.xyz'; // update a value
await rows[1].save(); // save updates
await rows[1].delete(); // delete a row
for (let i = 0; i < rows.length;i++){
        console.log(`After Delete ${i+1}--${rows[i].name} -- ${rows[i].email}`);    
}
// Working with cells
await sheet.loadCells('A1:E10'); // loads a range of cells
console.log(sheet.cellStats); // total cells, loaded, how many non-empty
const c1 = sheet.getCell(0, 2); // access cells using a zero-based index
const c6 = sheet.getCellByA1('C6'); // or A1 style notation
// access everything about the cell
console.log(c1.value);
console.log(c1.formula);
console.log(c1.formattedValue);
// update the cell contents and formatting
c1.value = 123.456;
c6.formula = '=A1';
c1.textFormat = { bold: true };
c6.note = 'This is a note!';
await sheet.saveUpdatedCells(); // save all updates in one call

for (let i = 0; i < doc.sheetCount;i++){
    let sht=doc.sheetsByIndex[i]
    console.log(`${i+1} --- ${sht.title}- ${sht.rowCount}- ${sht.columnCount}`);    
}


// adding / removing sheets
// const newSheet = await doc.addSheet({ title: 'hot new sheet!' });
// await newSheet1.delete();
// const firstSheet = doc.sheetsByIndex[5]; // in the order they appear on the sheets UI
// const otherSheet = doc.sheetsByTitle['底背離']; // accessible via ID if you already know it

})()