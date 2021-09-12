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
    router.post('/createUser/:id_reportero/:nombres/:apepaterno/:apematerno/:sexo/:cargo/:contra/:ci',async (req,res)=>{
        let id_reportero = req.params.sexo;
        let nombres = req.params.nombres;
        let apepaterno = req.params.apepaterno;
        let apematerno = req.params.apematerno;
        let sexo = req.params.sexo;
        let cargo = req.params.sexo;
        let contra = req.params.sexo;
        let ci = req.params.sexo;
        let creacion=false;
        await client.query(`INSERT INTO REPORTERO (id_reportero,nombres,apepaterno,apematerno,sexo,cargo,contraseña,ci,habilitada) VALUES ('${id_reportero}','${nombres}','${apepaterno}','${apematerno}','${sexo}','${cargo}','${contra}','${ci}','true');`)
        .then(creacion = true)
        .catch(err=>console.log(err.stack))
        .then(()=>client.end);

        res.send(creacion);
    });
    return router;
};