const path = require ("path"); //controla todo los archivos y direcciones url. se importa desde node
const fs = require ("fs");//proporciona una api para interactuar con el sistema de archivos
const chalk = require('chalk');
let file = process.argv[2]; // Toma el arreglo en la posición 2 
//contiene los argumentos de la línea de comandos. El primer elemento será node , el segundo elemento será el nombre del archivo JavaScript. Los siguientes elementos serán los argumentos de línea de comando adicionales.
file = path.resolve(file);  // Convierte la ruta de relativa a absoluta
file = path.normalize(file);  // simplifica la ruta quita excesos de \\
const marked = require("marked");
const fetch = require("node-fetch"); //manipula los http
 
console.log(chalk.cyan.bold("Estás leyendo el archivo:"),file);

let options = {
  validate:false,
  stats: false
}


const getFile = (file) => {
  return new Promise((resolve, reject) => {
    fs.readFile(file, 'utf8', (err, data) => {
      if (err) {
        return reject(err);
      }
      let links = [];
      const renderer = new marked.Renderer(); // Get reference
      renderer.link = function(href, title, text) {
        // Override function
        links.push({
          href: href,
          text: text,
          file: file
        });
      };
      marked(data, { renderer: renderer }); // Aquí imprime y crea los elementos dentro del Array
      links = linksHttp(links);

      if (
        (options.validate === false && options.stats === false) ||
        (options.validate === false && options.stats === true)
      ) {
        // Aquí solo se resuelve con el primer array generado
        resolve(links);
        return;
      } else {
        codeStatusLinks(links) // Llamada de la promesa del nuevo array con status y statusCode
          .then(links => resolve(links))
          .catch(err => console.log(err));
      }
    });
  });
};

// Filtra y retorna un nuevo array con los links que contienen 'http'
const linksHttp = links => {
  return links.filter(link => {
    return link.href.substring(0, 4) === "http";
  });
};

if (path.extname(file) === '.md') {
   getFile(file)
    .then((fileData) => {
      if (options.validate === false && options.stats === false) {
        linksInDoc(fileData);
    } else if (options.validate === true && options.stats === false) {
        printStatus(fileData);
    } else if (options.validate === false && options.stats === true) {
        printTotalLinks(fileData)
    } else if (options.validate === true && options.stats === true) {
        printTotalLinks(fileData)
        printTotalBroken(fileData)
    }
      console.log(fileData);
    })
    .catch((error) => {
      console.error(error)
    })
} else {
    console.log(chalk.red.bold('¡Esto no es un archivo md, introduce uno!'))
}
  
const RegExr = /(((https?:\/\/)|(http?:\/\/)|(www\.))[^\s\n]+)(?=\))/g;

fs.readFile(file, "utf-8", (e,file) => {
  if (e){
    console.log(e);
  }else{
    console.log((chalk.yellow("Links:")), file.match(RegExr));
  }
})  

// Función que solo muestra los links, titulos y ubicacion
const linksInDoc = (links) => {
	links.forEach(element => {
		console.log(
			chalk.green(element.href),
			chalk.yellow.bold(element.text),
			chalk.blueBright(element.file)
		)
	})
}

module.exports = getFile; 