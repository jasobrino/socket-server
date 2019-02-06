
import express from 'express';
import { SERVER_PORT } from '../global/environment';
import socketIO from 'socket.io';
import http from 'http'; //para los sockets

import * as socket from '../sockets/socket';

export default class Server {

  private static _instance: Server;

  public app: express.Application;
  public port: number;

  public io: socketIO.Server;
  private httpServer: http.Server;

  private constructor() {

    this.app = express();
    this.port = SERVER_PORT;

    // inicializar server para el socket
    this.httpServer = new http.Server( this.app );
    this.io = socketIO( this.httpServer );
    // ahora preparamos los sockets
    this.escucharSockets();

  }

  // implementacion del patrón singleton
  // evita que tengamos más de una instancia del server
  public static get instance() {
    // devuelve la instancia si existe, si no la crea
    return this._instance || ( this._instance = new this() );
  }

  private escucharSockets() {

    console.log('Escuchando conexiones - sockets');

    this.io.on('connection', cliente => {

      // Conectar cliente
      socket.conectarCliente( cliente, this.io );

      // Configurar usuario
      socket.configurarUsuario( cliente, this.io );

      // Obtener lista de usuarios
      socket.obtenerUsuarios( cliente, this.io );

      // Mensajes
      socket.mensaje( cliente, this.io );

      // Desconectar
      socket.desconectar( cliente, this.io );
  
    });


  }


  start( callback: Function ) {

    // arranca el servidor express
    // this.app.listen( this.port, callback );

    // ahora usamos el httpServer para poder unsar los sockets
    // en lugar del http server implicito en express
    this.httpServer.listen( this.port, callback ); 
  }

}

