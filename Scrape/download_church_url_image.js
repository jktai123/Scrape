
const fs = require('fs');
const path = require('path');
const axios = require('axios').default;

let fileName = "C:/Users/TAI/Documents/node_study/church/churchDetail.json";

let jsonObj = JSON.parse(fs.readFileSync(fileName, "utf8"));

// fileUrl: the absolute url of the image or video you want to download
// downloadFolder: the path of the downloaded file on your machine
const downloadFile_church = async (fileUrl, filename) => {
    const directory = './church/pic'
    if(!fs.existsSync(directory)){
        fs.mkdirSync(directory)
    }
    const localFilePath = directory+'/'+filename;
  if(!fs.existsSync(localFilePath)){
  try {
    const response = await axios({
      method: 'GET',
      url: fileUrl,
      responseType: 'stream',
    });

    const w = response.data.pipe(fs.createWriteStream(localFilePath));
    w.on('finish', () => {
      console.log(`Successfully downloaded ${filename} !`);
    });
  } catch (err) {
      console.log(`Error ${err} Fail to  download ${filename}`)
    throw new Error(err);
  }
  }
}; 


// fileUrl: the absolute url of the image or video you want to download
// downloadFolder: the path of the downloaded file on your machine
const downloadFile = async (fileUrl, downloadFolder) => {
  // Get the file name
  const fileName = path.basename(fileUrl);

  // The path of the downloaded file on our machine
  const localFilePath = path.resolve(__dirname, downloadFolder, fileName);
  try {
    const response = await axios({
      method: 'GET',
      url: fileUrl,
      responseType: 'stream',
    });

    const w = response.data.pipe(fs.createWriteStream(localFilePath));
    w.on('finish', () => {
      console.log('Successfully downloaded file!');
    });
  } catch (err) {
    throw new Error(err);
  }
}; 

(async () => {
for (let i=0; i<jsonObj.length; i++) {
        console.log(`${i+1}/${jsonObj.length} ${jsonObj[i].OrgName}`)
        url=jsonObj[i].PIC_Src;
        if(url.indexOf('http')==0){
            // console.log(url);
            await downloadFile_church(url,jsonObj[i].BelName+'_'+jsonObj[i].OrgName+'.jpg');
        
        
        if (i==300){
            break;
        }
        }
    }
})()
// // Testing
// const IMAGE_URL =
//   'https://www.kindacode.com/wp-content/uploads/2021/01/test.jpg';
// downloadFile(IMAGE_URL, 'download');

// const VIDEO_URL =
//   'https://www.kindacode.com/wp-content/uploads/2021/01/example.mp4';
// downloadFile(VIDEO_URL, 'download');