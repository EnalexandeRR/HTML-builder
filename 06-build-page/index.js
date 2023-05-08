const fs = require('fs');
const path = require('path');

const pathToFinalDist = path.join(__dirname, 'project-dist');
const pathToAssets = path.join(__dirname, 'assets');

async function CreateDistFolders() {
  await fs.promises.rm(pathToFinalDist, { recursive: true, force: true });

  return fs.promises.mkdir(pathToFinalDist, { recursive: true }).then(() => {
    fs.promises.mkdir(path.join(pathToFinalDist, 'assets'), {
      recursive: true,
    });
  });
}

async function CopyAssets(source, destination) {
  const innerData = await fs.promises.readdir(source, { withFileTypes: true });

  innerData.forEach(async (fileOrFolder) => {
    if (fileOrFolder.isFile() === false) {
      await fs.promises
        .mkdir(path.join(destination, fileOrFolder.name), {
          recursive: true,
        })
        .then(() =>
          CopyAssets(
            path.join(source, fileOrFolder.name),
            path.join(destination, fileOrFolder.name),
          ),
        );
    } else if (fileOrFolder.isFile() === true) {
      await fs.promises.copyFile(
        path.join(source, fileOrFolder.name),
        path.join(destination, fileOrFolder.name),
      );
    }
  });
}

async function MergeStyles() {
  const pathToStyles = path.join(__dirname, 'styles');
  const bundlePath = path.join(__dirname, 'project-dist', 'style.css');

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

async function BuildHtml() {
  const componentsContent = {};
  // Store component's content in object
  await fs.promises.readdir(path.join(__dirname, 'components')).then((components) => {
    components.forEach((component) => {
      fs.promises
        .readFile(path.join(__dirname, 'components', component), 'utf8')
        .then((content) => {
          componentsContent[component.split('.')[0]] = content;
        });
    });
  });

  const template = await fs.promises.readFile(path.join(__dirname, 'template.html'), 'utf8');
  let finalHtmlContent = template;

  Object.keys(componentsContent).forEach((key) => {
    finalHtmlContent = finalHtmlContent.replace(`{{${key}}}`, componentsContent[key]);
  });
  fs.promises.writeFile(path.join(pathToFinalDist, 'index.html'), finalHtmlContent, 'utf8');
}

async function BuildProject() {
  await CreateDistFolders();
  await MergeStyles();
  await CopyAssets(pathToAssets, path.join(pathToFinalDist, 'assets'));
  BuildHtml();
}

BuildProject();
