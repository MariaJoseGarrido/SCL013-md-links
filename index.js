const fs = require('fs'); //proporciona una API para interactuar con el sistema de archivos

module.exports = () => {

};

const readDoc = (path) => { // Función para leer archivo según su ruta
  let content = new Promise((resolve, reject) => {
    fs.readFile(path, 'utf8', (err, data) => {
      if (err) {
        reject(err);
      }
      resolve(data);
    });
  })
  return content
}

module.exports.readDoc = readDoc;