const fs = require('fs');

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