const fs = require('fs');
const path = require('path');

const pathToCopy = path.join(__dirname, 'files-copy');

function copyDir() {
  fs.mkdir(pathToCopy, { recursive: true }, () => {
    fs.promises.readdir(pathToCopy).then((files) => {
      files.forEach((file) => {
        console.log(file);
        fs.unlink(path.join(pathToCopy, file), () => {});
      });
    });
    fs.promises.readdir(path.join(__dirname, 'files')).then((files) => {
      files.forEach((file) => {
        fs.promises.copyFile(path.join(__dirname, 'files', file), path.join(pathToCopy, file));
      });
    });
  });
}

copyDir();
