const readDoc = require('./index');
const marked = require('marked'); //ayuda a mejorar la velocidad del proceso, no guarda caché
const fetch = require('node-fetch');  //manipula los http a traves de peticiones y respuestas. (200 o 400), se comunica con otro
const chalk = require('chalk');
const file = process.argv[2]; //posicion de donde queremos extraer links
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

 getMd = ( absolutePath ) => { // Función para detectar archivos tipo .md
  if (path.extname(absolutePath) === '.md') {
    getURL(); //pasa a la funcion siguiente
  } else {
    console.log(chalk.red.bold('Error. This is not an .md file'));
  }
};

getURL = () => { // Función para obtener arreglo de todos los links
  let printLinks = new Promise((resolve, reject) => {
    readDoc.readDoc(absolutePath)
      .then(data => {
        let renderer = new marked.Renderer(); //trae informacion sin data privados "tokenizados" y si cahce
        let links = []; //lleno con los links del doc
        renderer.link = function (href, title, text) {
          links.push({
            href: href,
            text: text,
            file: absolutePath,
          });
        };
        marked(data, {
          renderer: renderer //Un objeto tipo texto que contiene funciones para representar tokens en HTML.
        });
        urlLinks = links.filter(element => element.href.includes('http')); //filtro links que cumplen con las condiciones
        let argv3 = process.argv[3]; // aqui agregamos los flags
        if (argv3 == "-v" || argv3 == "-validate" || argv3 == "--v"){
          linksFilter(urlLinks, false, 200); //muestra todos los links con la funcion linksFilter
          } else if (argv3 == '-s' || argv3  == '-stats'  || argv3 == "--s"){
            console.log("coming soon...")
            let add = conteoLinks(urlLinks)
            console.log(add)
          }
      })
      .catch(err => {
        (console.log(err));
      })
  })
  return printLinks
}

const linksFilter = (links, unique, num) => { //mostrar de forma especifica el estado de los links
  links.map(element => {
    fetch(element.href)
      .then(response => {
        if (response.status === num) {
          console.log(chalk.magenta('Text: ' + element.text + '\n'), chalk.yellow('Href: ' + element.href + '\n'), ('File: '+ element.file + '\n'), chalk.green('Status: ' + response.status + '' + '[✔]'));
          console.log(chalk.white('..................................'));
        } else  {
          console.log(chalk.magenta('Text: ' + element.text + '\n'), chalk.yellow('Href: ' + element.href + '\n'), ('File: '+ element.file + '\n'), chalk.red('Status: ' + response.status + '' + '[X]'));
          console.log(chalk.white('..................................'));        }
      })
      .catch(error => {
        if(unique == false)  {
          console.log(chalk.red('Error. This link doesn´t exist --> ' + element.href + '\n'));
        }
      })
    });
    console.log (chalk.cyanBright.bold('------Total Links Checked------> ' + links.length + '\n'))
  };
  getMd(absolutePath);

