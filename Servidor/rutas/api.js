//const express = require('express');
const {Client} = require('pg');
const client = new Client({
    host:'localhost',
    user:'postgres',
    port:5432,
    password:'admin',
    database:'RadioCompanieraBD'
});
//TODO: Completar en base a los cargos
//Periodista, Operador, Admin, Jefe Prensa y Pasante
const cargos = {
    'superadministrador':{counts:true, settings:true},
    'operador':{counts:false, settings:false},
    'periodista':{counts:false, settings:false},
    'admin':{counts:false, settings:false},
    'jefePrensa':{counts:false, settings:false},
    'pesante':{counts:false, settings:false}
}

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
            let cargo = respuestaBD.rows[0].cargo;
            res.send({usuario:respuestaBD.rows[0], permisos : cargos[cargo]});
        }
    });
    router.post('/cambiarContrasenia/:idUser/:nuevaContrasenia', async (req,res)=>{        
        let id_usuario = req.params.idUser;
        let contra = req.params.nuevaContrasenia;              
        await client.query(`UPDATE reportero SET contraseña = '${contra}' WHERE id_reportero ='${id_usuario}'`)
            .catch(err => res.send(false))
            .then(()=>client.end);        
        res.send(true);
    });
    return router;
};