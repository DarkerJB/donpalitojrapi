// modelo/bd/Conexion.js
import mysql from 'mysql2';
import dbConfig from './Config.js';

class Conexion {
  constructor() {
    this.pool = mysql.createPool(dbConfig);

    this.pool.getConnection((err, connection) => {
      if (err) {
        console.error('Error al conectar a la base de datos:', err.message);
      } else {
        console.log('Conectado a la base de datos');
        connection.release();
      }
    });
  }

  query(queryString, params = []) {
    return this.pool.promise().query(queryString, params)
      .then(([results]) => results)
      .catch(err => {
        console.error('Error durante la consulta:', err.message);
        throw err;
      });
  }
}

const conexion = new Conexion();
export default conexion;