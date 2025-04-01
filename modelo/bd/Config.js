require('dotenv').config({ path: __dirname + '/.env' });

console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD ? '****' : '(vacío)');
console.log('DB_NAME:', process.env.DB_NAME);

if (!process.env.DB_HOST || !process.env.DB_USER || !process.env.DB_NAME) {
  console.error("Error: Faltan variables de entorno en el archivo .env");
  process.exit(1); // Detiene la ejecución si faltan valores esenciales
}

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'donpalitojrbd'
};

module.exports = dbConfig;