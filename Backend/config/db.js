import mysql from "mysql2";

import dotenv from "dotenv";
dotenv.config();

const connection = mysql.createConnection({
  
  // host: process.env.DB_HOST,
  // user: process.env.DB_USER,
  // password: process.env.DB_PASSWORD,
  // database: process.env.DB_NAME,
  //  waitForConnections: true,
  // connectionLimit: 10,
  // queueLimit: 0

  host:"localhost",
  user:"root",
  password:"admin",
  database:"simulador_lamparas"


  
  
});

connection.connect((err) => {
  if (err) {
    console.error("Error conectando a MySQL:", err);
  } else {
    console.log("✅ Conectado a la base de datos simulador_lamparas");
  }
});

export default connection;
