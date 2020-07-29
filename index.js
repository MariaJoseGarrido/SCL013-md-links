const path = require ("path"); //controla todo los archivos y direcciones url. se importa desde node
const fs = require ("fs");//proporciona una api para interactuar con el sistema de archivos
let file = process.argv[2]; // Toma el arreglo en la posición 2 
//contiene los argumentos de la línea de comandos. El primer elemento será node , el segundo elemento será el nombre del archivo JavaScript. Los siguientes elementos serán los argumentos de línea de comando adicionales.
file = path.resolve(file);  // Convierte la ruta de relativa a absoluta
file = path.normalize(file);  // simplifica la ruta quita excesos de \\

console.log("file",file);

const getFile = (file) => {
  return new Promise((resolve, reject) => {
    fs.readFile(file, 'utf8', (err, data) => {
      if (err) {
        return reject(err)
      } else {
        resolve(data)
      }
        console.log(reject);
      })
  })
}



if (path.extname(file) === '.md') {
   getFile(file)
    .then((fileData) => {
      console.log(fileData);
    })
    .catch((error) => {
      console.error(error)
    })
} else {
    console.log('Este no es un archivo md, introduce uno')
}
  
  
















