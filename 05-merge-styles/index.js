const fs = require('fs');
const path = require('path');

const pathToStyles = path.join(__dirname, 'styles');
const bundlePath = path.join(__dirname, 'project-dist', 'bundle.css');

function MakeBundle() {
  fs.promises.readdir(pathToStyles, { withFileTypes: true }).then((files) => {
    const cssFiles = files.filter((file) => file.isFile() && file.name.split('.')[1] === 'css');

    fs.promises.writeFile(bundlePath, '').then((err) => {
      if (err) throw err;
      cssFiles.forEach((stylesFile) => {
        fs.promises
          .readFile(path.join(pathToStyles, stylesFile.name.toString()), 'utf-8')
          .then((text) => {
            fs.appendFile(bundlePath, text, (err) => {
              if (err) throw err;
            });
          });
      });
    });
  });
}

MakeBundle();
