const { stdin, stdout } = process;
const path = require('path');
const fs = require('fs');
const { EOL } = require('os');

const textFilePath = path.join(__dirname, 'text.txt');

fs.writeFile(textFilePath, '', (err) => {
  if (err) throw err;

  stdout.write('Что добавить в файл?\n');
});

stdin.on('data', (data) => {
  if (data.toString() == `exit${EOL}`) {
    process.exit();
  } else {
    AppendText(data.toString());
  }
});

function AppendText(text) {
  fs.appendFile(textFilePath, text, (err) => {
    if (err) throw err;
  });
}

process.on('SIGINT', () => {
  process.exit();
});
process.on('exit', () => console.log('Всего доброго!'));
