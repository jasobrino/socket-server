import Server from './classes/server';
import router from './routes/router';
import bodyParser from 'body-parser';
import cors from 'cors';


const server = Server.instance;

// BodyParser
server.app.use( bodyParser.urlencoded({ extended: true} ));
server.app.use( bodyParser.json() );

// CORS - para poder llamar los servicios desde cualquier dominio
server.app.use( cors({ origin: true, credentials: true }));

// Rutas de servicios
server.app.use('/', router);

server.start( () => {
  console.log(`Servidor corriendo en el puerto ${ server.port }`);
});


