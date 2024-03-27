import 'dotenv/config';
import mysql from 'mysql';


        const hostname = process.env.HOST ;
        const portdb = process.env.PORT_DB;
        const username = process.env.USER;
        const dbpassword = process.env.PASSWORD;
        
        export const db_publico = process.env.DB_PUBLICO;
        export const db_vendas = process.env.DB_VENDAS;
        export const db_estoque = process.env.DB_ESTOQUE;
        export const db_financeiro = process.env.DB_FINANCEIRO;

        let port:any | undefined;

        if(portdb !== undefined){
            port  = parseInt(portdb);
        }

       export const conn =   mysql.createPool({
            connectionLimit : 10,
            host: hostname,
            user: username,
            port: port,
            password: dbpassword,
        })


    conn;
        const t ={
            "porta":port,
            "host":hostname,
            "username":username,
            "senha":dbpassword
        }
       //console.log(t)



/*

import 'dotenv/config'
const mysql = require('mysql')

    const hostname = process.env.HOST  
    const portdb = process.env.PORT_DB
    const username = process.env.USER
    const dbpassword = process.env.PASSWORD

    export  var publico = "galvotelhas_publico"//process.env.DATABASE_PUBLICO;
        export var estoque = "galvotelhas_estoque"//process.env.DATABSE_ESTOQUE;
        export var vendas = "galvotelhas_vendas"//process.env.DATABSE_VENDAS;
        export       var financeiro ="galvotelhas_financeiro"// process.env.DATABSE_FINANCEIRO;

export var teste='teste';


  export var con:any = mysql.createPool({
            connectionLimit : 10,
            host: hostname,
            user: username,
            port: portdb,
            password: dbpassword,
            database: estoque,
            database2: publico,
            database3: vendas,
        })


///export {con,vendas,publico,estoque,financeiro}



*/