const mdLinks = require('./index');
const marked = require('marked');
const fetch = require('node-fetch');  //manipula los http
const chalk = require('chalk');
const file = process.argv[2];
const path = require('path');
const absolutePath = path.normalize(path.resolve(file)); // simplifica la ruta quita excesos de \\ arregla la ruta. resolve() la hace absoluta


function getMd(absolutePath) { // Función para detectar archivos tipo .md
  if (path.extname(absolutePath) === '.md') {
    getURL();
  } else {
    console.log(chalk.red.bold('Error. Esto no es un .md - Ingresa uno!'));
  }
};

function getURL() { // Función para obtener arreglo de todos los links
  let printLinks = new Promise((resolve, reject) => {
    mdLinks.readDoc(absolutePath)
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
        links = httpWord(links); // Filtrar por prefijo http
        links = linksFilter(links)
        return resolve(links)
      })
      .catch(err => {
        (console.log(err));
      })
  })
  return printLinks
}

function linksFilter(links) { // Función que filtra por estado de links
  links.map(element => {
    fetch(element.href)
      .then(response => {
        if (response.status === 200) {
          console.log(chalk.magenta('Texto: ' + element.text + '\n'), chalk.yellow('Href: ' + element.href + '\n'), ('File: '+ element.file + '\n'), chalk.green('Status: ' + response.status + '' + '[✔]'));
        } else {
          console.log(chalk.magenta('Text: ' + element.text + '\n'), chalk.yellow('Href: ' + element.href + '\n'), ('File: '+ element.file + '\n'), chalk.red('Status: ' + response.status + '' + '[X]'));
        }
      })
      .catch(error => 
        console.log(chalk.red('Error. This link doesn´t exist --> ' + element.href)))
        
  });
  console.log (chalk.cyanBright.bold('------Total Links Checked------> ' + links.length))
};

function httpWord(links) { // Función que filtra por palabra http de links
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


