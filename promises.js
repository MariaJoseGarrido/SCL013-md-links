const readDoc = require('./index');
const marked = require('marked');
const fetch = require('node-fetch');  //manipula los http
const chalk = require('chalk');
const file = process.argv[2]; 
const path = require('path');
const absolutePath = path.normalize(path.resolve(file)); // simplifica la ruta quita excesos de \\ arregla la ruta. resolve() la hace absoluta

console.log(chalk.bgYellow.black.bold("▮▮▮▮▮▮▮▮▮▶ U ARE USING MD-LINKS LIBRARY ◀▮▮▮▮▮▮▮▮▮" + '\n'));
if( typeof console === 'object' ) {
  console.log(
      '           ("`-’-/").___..--’’"`-._\n' +
      '            `6_ 6  )   `-.  (     ).`-.__.‘)\n' +
      '            (_Y_.)’  ._   )  `._ `. ``-..-’\n' +
      '            _..`--’_..-_/  /--’_.’ ,’\n' +
      '          (il),-’‘  (li),’  ((!.-‘\n' 
  );
}


 getMd = (absolutePath) => { // Función para detectar archivos tipo .md
  if (path.extname(absolutePath) === '.md') {
    getURL();
  } else {
    console.log(chalk.red.bold('Error. This is not an .md file'));
  }
};

getURL = () => { // Función para obtener arreglo de todos los links
  let printLinks = new Promise((resolve, reject) => {
    readDoc.readDoc(absolutePath)
      .then(datos => {
        let renderer = new marked.Renderer();
        let links = [];
        renderer.link = function (href, title, text) {
          links.push({
            href: href,
            text: text,
            file: absolutePath,
          });
        };
        marked(datos, {
          renderer: renderer
        });
        links = httpWord(links); // Filtrar por http en link
        links = linksFilter(links)
        return resolve(links)
      })
      .catch(err => {
        (console.log(err));
      })
  })
  return printLinks
}

linksFilter = (links) => { // Función que filtra por estado de links
  links.map(element => {
    fetch(element.href)
      .then(response => {
        if (response.status === 200) {
          console.log(chalk.magenta('Text: ' + element.text + '\n'), chalk.yellow('Href: ' + element.href + '\n'), ('File: '+ element.file + '\n'), chalk.green('Status: ' + response.status + '' + '[✔]' + '\n'));
        } else {
          console.log(chalk.magenta('Text: ' + element.text + '\n'), chalk.yellow('Href: ' + element.href + '\n'), ('File: '+ element.file + '\n'), chalk.red('Status: ' + response.status + '' + '[X]' + '\n'));
        }
      })
      .catch(error => 
        console.log(chalk.red('Error. This link doesn´t exist --> ' + element.href + '\n')))
        
  });
  console.log (chalk.cyanBright.bold('------Total Links Checked------> ' + links.length + '\n'))
};

httpWord = (links) => { // Función que filtra por palabra http de links
  let httpWord = [];
  links.map((element) => {
    let prefix = element.href.substring(0, 4);
    if (prefix == 'http') {
      httpWord.push(element);
    }
  })
  return httpWord;
};
getMd(absolutePath);


