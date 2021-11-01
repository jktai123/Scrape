var fs = require("fs");
var path = require("path");
// In newer Node.js versions where process is already global this isn't necessary.
var process = require("process");

var dirName = __dirname //"/Users/Tai/Downloads";
const directory = './church/pic'
const group_a=['images','documments','pdf','media','other']
group_a.forEach((item)=>{
    if(!fs.existsSync(dirName+`/${item}`)){
        fs.mkdirSync(dirName+`/${item}`)
    }
})

// fs.mkdirSync(`${dirName}/images`, { recursive: true });
// fs.mkdirSync(`${dirName}/documents`, { recursive: true });
// fs.mkdirSync(`${dirName}/pdf`, { recursive: true });
// fs.mkdirSync(`${dirName}/media`, { recursive: true });
// fs.mkdirSync(`${dirName}/other`, { recursive: true });

// Loop through all the files in the temp directory
SrcdirName=dirName+'/download'
fs.readdir(SrcdirName, function(err, files) {
  if (err) {
    console.error("Could not list the directory.", err);
    process.exit(1);
  }

  files.forEach(function(file, index) {
    console.log(path.extname(file));

    if (path.extname(file) === ".pdf") {
      let fromPath = path.join(SrcdirName, file);
      let toPath = path.join(`${dirName}/pdf`, file);
      fs.rename(fromPath, toPath, function(error) {
        if (error) {
          console.error("File moving error.", error);
        } else {
          console.log("Moved file '%s' to '%s'.", fromPath, toPath);
        }
      });
    }

    if (path.extname(file) === ".jpg" || path.extname(file) === ".png") {
      let fromPath = path.join(SrcdirName, file);
      let toPath = path.join(`${dirName}/images`, file);
      fs.rename(fromPath, toPath, function(error) {
        if (error) {
          console.error("File moving error.", error);
        } else {
          console.log("Moved file '%s' to '%s'.", fromPath, toPath);
        }
      });
    }

    if (path.extname(file) === ".mp3" || path.extname(file) === ".mp4") {
      let fromPath = path.join(SrcdirName, file);
      let toPath = path.join(`${dirName}/media`, file);
      fs.rename(fromPath, toPath, function(error) {
        if (error) {
          console.error("File moving error.", error);
        } else {
          console.log("Moved file '%s' to '%s'.", fromPath, toPath);
        }
      });
    }

    if (
      path.extname(file) === ".xlsx" ||
      path.extname(file) === ".csv" ||
      path.extname(file) === ".docx"
    ) {
      let fromPath = path.join(SrcdirName, file);
      let toPath = path.join(`${dirName}/documents`, file);
      fs.rename(fromPath, toPath, function(error) {
        if (error) {
          console.error("File moving error.", error);
        } else {
          console.log("Moved file '%s' to '%s'.", fromPath, toPath);
        }
      });
    }
  });
});