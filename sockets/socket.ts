// acciones de los sockets

import { Socket } from 'socket.io';
import socketIO from 'socket.io';
import { UsuariosLista } from '../classes/usuarios-lista';
import { Usuario } from '../classes/usuario';

export const usuariosConectados = new UsuariosLista();

export const conectarCliente = ( cliente: Socket, io: socketIO.Server ) => {

  const usuario = new Usuario( cliente.id );
  usuariosConectados.agregar( usuario );

}

export const desconectar = ( cliente: Socket, io: socketIO.Server ) => {

  cliente.on('disconnect', () => {
    console.log('Cliente desconectado');
    usuariosConectados.borrarUsuario( cliente.id );

    io.emit('usuarios-activos', usuariosConectados.getLista() );

  });
  
}

// Escuchar mensajes
export const mensaje = ( cliente: Socket, io: socketIO.Server ) => {

  cliente.on('mensaje', ( payload: {de: string, cuerpo: string } ) => {
    
    console.log('mensaje recibido:', payload);
    // emitir a todos los usuarios conectados
    io.emit('mensaje-nuevo', payload );

  });
}

// Configurar usuario
export const configurarUsuario = ( cliente: Socket, io: socketIO.Server ) => {

  cliente.on('configurar-usuario', ( payload: {nombre: string}, callback: Function ) => {
    
    usuariosConectados.actualizarNombre( cliente.id, payload.nombre );
    io.emit('usuarios-activos', usuariosConectados.getLista() );

    callback({
      ok: true,
      mensaje: `Usuario ${payload.nombre} configurado`
    });

  });

}

// Obtener Usuarios
export const obtenerUsuarios = (cliente: Socket, io: socketIO.Server ) => {
  
  cliente.on('obtener-usuarios', () => {
    // manda la lista al usuario que se está conectando
    io.to( cliente.id ).emit('usuarios-activos',  usuariosConectados.getLista());

  });

}
