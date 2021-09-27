//const express = require('express');
const multer = require('multer');
const {Client} = require('pg');
const jsonParser = require('express').json();
const fs = require('fs');
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
    'superadministrador':   {counts:true, settings:true},
    'operador':             {counts:false, settings:false},
    'periodista':           {counts:false, settings:false},
    'administrador':        {counts:false, settings:false},
    'jefePrensa':           {counts:false, settings:false},
    'pasante':              {counts:false, settings:false}
}
const storage = multer.diskStorage({
    destination: (req,file,cb)=>{
        cb(null,'./archivos/');
    },
    filename: (req,file,cb)=>{
        cb(null, Date.now()+ file.originalname);
    }
});
const upload = multer({storage:storage});
const SERVER_DIR = 'http://localhost:3000/'

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
            let cargo = respuestaBD.rows[0].cargo;
            res.send({usuario:respuestaBD.rows[0], permisos : cargos[cargo]});
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

        await client.query(`INSERT INTO reportero (id_reportero,nombres,apepaterno,apematerno,sexo,cargo,contraseña,ci,habilitada)
        VALUES ('${idreport}','${nombres}','${apepaterno}','${apematerno}','${sexo}','${cargo}','${contra}','${ci}','true');`)
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

    router.post('/subirArchivo',upload.single('clientFile'),(req,res)=>{        
        //console.log(req.file);
        res.send(SERVER_DIR+req.file.path);
    });
    router.post('/pruebaM',jsonParser,(req,res)=>{
        console.log(req.body);
        
        res.send(true);
    });
    router.post('/saveSchema',jsonParser,(req,res)=>{
        fs.writeFile('folderSchema.txt',req.body.schema, (err)=>{
            if(err){
                console.log('No se puede escribir en el archivo');
                res.status(500).send(false);
            }
        });
        res.status(200).send(true);
    });
    router.get('/getSchema',(req,res)=>{               
        let schema = fs.readFileSync('folderSchema.txt','utf-8');
        res.send(schema);
    });
    router.get('/getComentario/:idNoticia', async (req,res)=>{
        const query = {
            text: "SELECT * FROM comentarios WHERE id_noticia=$1",            
            values : [req.params.idNoticia]
        }                
        let comentario = await client.query(query);
        res.send(comentario.rows);
    });
    router.post('/postComentario',jsonParser, (req,res)=>{
        const query = {
            text: 'INSERT INTO comentarios VALUES ($1,$2,$3,$4)',
            values:Object.values(req.body)
        }
        let error = true;
        client
            .query(query)
            .then()
            .catch(err => {console.log('Error insertando comentario postComentario'); error = err.stack})
        res.send(true);
    });
    router.post('/getComentarios', (req,res)=>{                    
        client.query('SELECT * FROM comentarios')
            .then(comentarios => res.send(comentarios.rows))
            .catch( err => console.log('Error recuperando comentarios: /getComentarios',err.stack) );
    });

    return router;
};