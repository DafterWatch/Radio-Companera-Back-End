//const express = require('express');
const {Client} = require('pg');
const client = new Client({
    host:'localhost',
    user:'postgres',
    port:5432,
    password:'admin',
    database:'RadioCompanieraBD'
});

module.exports = (router) =>{
    client.connect();
    router.post('/probe', async (req,res)=>{
        //client.connect();
        /*client.query("SELECT * FROM Reportero", (err,res)=>{
            if(!err){
                console.log(res.rows);
                console.log(res.rows[0].contraseña);
            }else{
                console.log(err.message);
            }
            client.end;
        });*/           
        let data;
        await client.query("SELECT * FROM Reportero")
            .then(res => data = res.rows)
            .catch(err => console.log(err.stack))
            .then(()=>client.end);
        res.send(data);
    });   
    router.post('/getUser/:idUser/:contrasenia', async (req,res)=>{        
        let id_usuario = req.params.idUser;
        let contra = req.params.contrasenia;
        let respuestaBD = null;        
        //let error = undefined;
        await client.query(`SELECT * FROM Reportero WHERE id_reportero ='${id_usuario}' AND contraseña = '${contra}'`)
            .then(filas => respuestaBD = filas)
            .catch(err => console.log(err.stack))
            .then(()=>client.end);        
        
        if(respuestaBD.rowCount == 0){
            res.send(false);
        }else{
            res.send(respuestaBD.rows[0]);
        }
    });
    //registrar reportero
    router.post('/createUser/:nomuser/:s..',async (req,res)=>{
        let nomuser = req.params.nomuser;
        let nomuser2 = req.params.nomuser;
        let nomuser22 = req.params.nomuser;
        let nomuser21 = req.params.nomuser;

        await client.query('insert .... sql')
        .then(()=>client.end)
        .catch(err=>console.log(err.stack))
        .then(()=>client.end);

        res.send("datos");
    });
    return router;
};