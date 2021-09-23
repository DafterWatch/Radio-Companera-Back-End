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
            //console.log(data);
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

    //recuperar user con ci=id
    router.post('/getUserByCI/:idUser', async (req,res)=>{        
        let id_usuario = req.params.idUser;
        let respuestaBD = null;        
        //let error = undefined;
        await client.query(`SELECT * FROM Reportero WHERE id_reportero ='${id_usuario}'`)
            .then(filas => respuestaBD = filas)
            .catch(err => console.log(err.stack))
            .then(()=>client.end);        
        
        if(respuestaBD.rowCount == 0){
            res.send(false);
        }else{
            res.send(respuestaBD.rows[0]);
        }
    });

    //verificar ci
    router.post('/verificarci/:ci',async (req,res)=>{

        let ci=req.params.ci;
        let existe;

        await client.query(`SELECT * FROM Reportero WHERE ci='${ci}'`)
        .then(filas=>existe=filas)
        .catch(err=>console.log(err.stack))
        .then(()=>client.end);

        if(existe.rowCount==0){
            res.send(false);
        }else{
            res.send(true);
        }
    });

    //registrar reportero
    router.post('/crearCuenta/:id_reportero/:nombres/:apepaterno/:apematerno/:sexo/:cargo/:contra/:ci',async (req,res)=>{
        let idreport = req.params.id_reportero;
        let nombres = req.params.nombres;
        let apepaterno = req.params.apepaterno;
        let apematerno = req.params.apematerno;
        let sexo = req.params.sexo;
        let cargo = req.params.cargo;
        let contra = req.params.contra;
        let ci = req.params.ci;

        await client.query(`INSERT INTO reportero (id_reportero,nombres,apepaterno,apematerno,sexo,cargo,contraseña,ci,habilitada) VALUES ('${idreport}','${nombres}','${apepaterno}','${apematerno}','${sexo}','${cargo}','${contra}','${ci}','true');`)
        .catch(err=>{console.log(err.stack)})
        .then(()=>client.end);

        res.send(true);
    });

    router.post('/deshabilitarUser/:idUser', async (req,res)=>{        
        let id_usuario = req.params.idUser;       
        await client.query(`UPDATE reportero SET habilitada = 'false' WHERE id_reportero ='${id_usuario}'`)
            .catch(err => res.send(false))
            .then(()=>client.end);        
        res.send(true);
    });
    return router;
};