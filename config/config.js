require('dotenv').config(); //import dotenv buat isi posgres

const pg = require('pg'); //modul pg

module.exports = {
  development: {
    username: 'postgres',
    password: 'douchenugget911',
    database: 'personal-web',
    host: '127.0.0.1',
    dialect: 'postgres',
    dialectModule: pg,
    // dialectOptions: {
    //   ssl: {
    //     require: true,
    //     rejectUnauthorized: false,
    //   },
    // },
  },
  production: {
    username: process.env.POSTGRES_USERNAME,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DATABASE,
    host: process.env.POSTGRES_HOST,
    dialect: 'postgres',
    dialectModule: pg,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  },
};
