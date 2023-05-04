const fs = require('fs');
const path = require('path');

const folderPath = path.join(__dirname, 'secret-folder');

try {
  ReadDir();
} catch (err) {
  console.log(err);
}

function ReadDir() {
  fs.promises.readdir(folderPath, { withFileTypes: true }).then((entities) => {
    const files = entities.filter((element) => element.isFile());
    files.forEach((file) => {
      fs.stat(path.join(folderPath, file.name), (error, stats) => {
        console.log(
          `${file.name.split('.')[0]} - ${file.name.split('.')[1]} - ${Number(stats.size)}b`,
        );
      });
    });
  });
}
