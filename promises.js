const fetch = require("fetch"); //realizar peticiones http para obtener recursos de la red
const fetchUrl = fetch.fetchUrl; //

// //taller alpi!!!
// let myPromise = promise.resolver("todo bien"); //devuelve el  valor

// console.log(myPromise);

// myPromise.then( res => {

// });

// //2da promesa - el "return" de la promesa, igual a resolve
// let myOtherPromise = new promise((resolve, reject) => {
//   setTimeout(() => resolve(10), 2000);
// });



// myOtherPromise.then(res => {
//   res = res*500;
//   console.log(res);
// })

// //promise.all(aqui van todas las promesas) recibe de parametro otras promesas



// var nombre;
// process.stdout.write("hola mundo\n");//funcion que me deja imprimir mensaje en la terminal, como el console.log
// process.exit(); //para terminar la app


//fetch a un sitio web y retornar es estado http
const getHttpStatus = (url) => {
  return new Promise((resolve, reject) =>{
    fetchUrl (url, (error, meta) => {
      if(error) {
        reject(error);
      } else{
        resolve(meta.status);
      }
    });
  });
}

let url = "https://www.google.com";
getHttpStatus(url)
  .then(res =>{
    console.log("El estado de", url, "es:", res)
  })
  .catch(err => {
    console.log(err.code);
  });

console.log("mi app sigue =>");


