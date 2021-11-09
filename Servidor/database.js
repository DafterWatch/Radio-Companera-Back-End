const {Client} = require('pg');
const client = new Client({
    host:'localhost',
    user:'postgres',
    port:5432,
    //password:'hmfdzpkjqx',
    password:'admin',
    database:'RadioCompanieraBD'
    //database:'RadioCompaneraDB'
});

client.connect();

client.query("SELECT * FROM Reportero", (err,res)=>{
    if(!err){
        console.log(res.rows);
        console.log(res.rows[0].contraseña);
    }else{
        console.log(err.message);
    }
    client.end;
});