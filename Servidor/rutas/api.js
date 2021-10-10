//const express = require('express');
const multer = require('multer');
const {Client} = require('pg');
const jsonParser = require('express').json();
const fs = require('fs');
const client = new Client({
    host:'localhost',
    user:'postgres',
    port:5432,
    password:'hmfdzpkjqx',
    database:'RadioCompaneraDB'
});

//Periodista, Operador, Admin, Jefe Prensa y Pasante
//ADMINISTRADOR : * 
//Jefe de prensa : * , !Crear cuentas
//Periodista : !Crear cuentas , !Borrar contenido ageno
//Pasante : No puede borrar nada
//Operador : Solo puede ver

let permisos = {
    CREAR_CUENTAS :             false,
    ELIMINAR_COMENTARIOS :      false,
    BORRAR_NOTICIAS_AJENAS :    false,
    BORRAR_NOTICIAS_PROPIAS :   false,
    MODIFICAR_NOTICIAS_AJENAS : false,
    MODIFICAR_NOTICIAS_PROPIAS :false,
    CREAR_NOTICIAS :            false
    //TODO COMPLETAR CON PUBLICIDADES    
}

const cargos = {
    'Administrador':        '*',
    'Jefe de prensa':       ['BORRAR_NOTICIAS_AJENAS','BORRAR_NOTICIAS_PROPIAS','MODIFICAR_NOTICIAS_AJENAS','BORRAR_NOTICIAS_PROPIAS','CREAR_NOTICIAS'],
    'Periodista':           ['BORRAR_NOTICIAS_PROPIAS','MODIFICAR_NOTICIAS_PROPIAS','CREAR_NOTICIAS'],
    'Pasante':              ['MODIFICAR_NOTICIAS_PROPIAS','CREAR_NOTICIAS'],
    'Operador':             [],
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
        await client.query(`SELECT * FROM Reportero WHERE id_reportero ='${id_usuario}' AND contraseña = '${contra}'`)
            .then(filas => respuestaBD = filas)
            .catch(err => console.log(err.stack))
            .then(()=>client.end);
        if(respuestaBD.rowCount == 0){
            res.send(false);
        }else{
            let cargo = respuestaBD.rows[0].cargo;
            const permisos_usuario = createPermisions(cargo);
            res.send({usuario:respuestaBD.rows[0], permisos : permisos_usuario});
        }
    });
    function createPermisions(cargo){
        if(cargos[cargo] === '*'){
            Object.keys(permisos).forEach(k => permisos[k] = true);
            return permisos;
        }
        let user_permission = cargos[cargo];
        for(let p of Object.keys(permisos)){
            if(user_permission.includes(p)){
                permisos[p] = true;
            }else{
                permisos[p] = false;
            }
        }
        return permisos
    }

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
    router.post('/getComentarios/:idNoticia', async (req,res)=>{        
        let idNoticia = req.params.idNoticia;
        let respuestaBD = null;
        await client.query(`SELECT * FROM Comentarios WHERE idNoticia ='${idNoticia}'`)
            .then(filas => respuestaBD = filas)
            .catch(err => console.log(err.stack))
            .then(()=>client.end);
        
        if(respuestaBD.rowCount == 0){
            res.send(false);
        }else{
            let cargo = respuestaBD.rows[0].cargo;
            res.send(respuestaBD);
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

    router.post('/cambiarFotoPerfil',jsonParser,(req,res)=>{     
        let urlFoto =req.body.urlPerfil;   
        let id_usuario = req.body.idUser;       
        client.query(`UPDATE reportero SET fotoperfil = '${urlFoto}' WHERE id_reportero ='${id_usuario}'`)
            .catch(err => res.send(false))
            .then(()=>client.end);      
            console.log(req.body);  
        res.send(true);
        
    });

    //TODO Intentar 
    router.post('/confirmarfoto/:idUser/:urlPerfil', async (req,res)=>{        
        let id_usuario = req.params.idUser;   
        let urlFot =req.params.urlPerfil;
            console.log(id_usuario);
            console.log(urlFot);

        await client.query(`UPDATE reportero SET fotoperfil = '${urlFot}' WHERE id_reportero ='${id_usuario}'`)
            .catch(err => res.send(false))
            .then(()=>client.end);        
        res.send(true);
    });

    router.post('/subirArchivo',upload.single('clientFile'),(req,res)=>{
        //TODO: SUBIR A LA BASE DE DATOS
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
    router.get('/getComentario/:idNoticia', async (req,res)=>{
        const query = {
            text: "SELECT * FROM comentarios WHERE id_noticia=$1",            
            values : [req.params.idNoticia]
        }                
        let comentario = await client.query(query);
        res.send(comentario.rows);
    });
    router.post('/postComentario',jsonParser, async (req,res)=>{
        let noticia = req.body.idNoticia;
        let fecha = req.body.fecha;
        let nom = req.body.nombre;
        let cont = req.body.contenido;
        await client.query(`INSERT INTO comentarios (id_noticia, fecha, nombre, contenido) VALUES ('${noticia}','${fecha}','${nom}','${cont}');`)
        .catch(err=>{console.log(err.stack)})
        .then(()=>client.end);
    router.get('/getComentario/:idNoticia', async (req,res)=>{
        const query = {
            text: "SELECT * FROM comentarios WHERE id_noticia=$1 ORDER BY id_comentario DESC",            
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
    router.get('/getComentarios', (req,res)=>{                    
        client.query('SELECT * FROM comentarios ORDER BY id_comentario DESC')
            .then(comentarios => res.send(comentarios.rows))
            .catch( err => console.log('Error recuperando comentarios: /getComentarios',err.stack) );
    });

    router.post('/borrarComentario/:idComentario', async (req,res)=>{        
        let id_comentario = req.params.idComentario;       
        await client.query(`DELETE FROM comentarios WHERE id_comentario ='${id_comentario}'`)
            .catch(err => res.send(false))
            .then(()=>client.end);        
        res.send(true);
    });

    router.post('/cambiarContrasenia/:idUser/:nuevaContrasenia', async (req,res)=>{        
        let id_usuario = req.params.idUser;
        let contra = req.params.nuevaContrasenia;
        let respuestaBD = null;        
        await client.query(`UPDATE reportero SET contraseña = '${contra}' WHERE id_reportero ='${id_usuario}'`)
            .catch(err => res.send(false))
            .then(()=>client.end);        
        res.send(true);
    });

    router.post('/crearNoticia',jsonParser, async (req,res)=>{
        const text = `INSERT INTO Noticias
                      (id_noticia,id_reportero,ultima_modificacion,fecha_publicacion,estado) 
                      VALUES (DEFAULT,$1,$2,$3,$4) RETURNING id_noticia`;        
        const values = Object.values(req.body);
        try {
            const dbRes = await client.query(text,values);
            res.send(dbRes.rows[0].id_noticia.toString());
        } catch (error) {
            console.log('Error insertando noticia /crearNoticia',error.stack);
            res.send(false);
        }
    });
    router.post('/cargarContenidoNoticia',jsonParser, async (req,res)=>{

        //INSERTAR CONTENIDO NOTICIA
        const text = `INSERT INTO ContenidoNoticia 
                     (id_contenido,id_noticia,imagen,titulo,contenido,etiquetas) 
                     VALUES(DEFAULT, $1,$2,$3,$4,$5) RETURNING *`;
        const values = Object.values(req.body.ContenidoNoticia);
        let idContenido = undefined;
        await client.query(text,values)
            .then(response => idContenido = response.rows[0].id_contenido)
            .catch(err=> {
                if(err){
                    console.log('Error insertando contenido /cargarContenidoNoticia',err.stack);
                    res.send(false);
                }
            });
        //INSERTAR CATEGORIAS
        const categoriesId_query = `SELECT id_categoria FROM categorias WHERE nombre in (${req.body.categorias.join(',')});`;
        let categoriesId = await client.query(categoriesId_query);        
        categoriesId = categoriesId.rows.map(row => `(${row.id_categoria},${idContenido})`);
        let categoryNotice_query = `INSERT INTO CategoriaNoticia(id_categoria,id_noticia) VALUES `+ categoriesId.join(',');            
        client.query(categoryNotice_query);
        res.send(true);
    });
    router.get('/getCategorias',async (req,res)=>{
        const query = "SELECT * FROM categorias";
        const categories = await client.query(query);
        res.send(categories.rows.map(cat => cat.nombre));
    });
    router.post('/createCategory',jsonParser,(req,res)=>{
        const query = "INSERT INTO categorias (nombre) VALUES ($1)";
        const values = [req.body.category];
        client.query(query,values)
            .catch((err)=> {console.log("Error insertando categoria /createCategory", err.stack); res.send(false)});
        res.send(true);
    });

        res.send(true);
    });
    router.post('/getComentarios', async (req,res)=>{        
        let data;
        await client.query("SELECT * FROM comentarios")
            .then(res => data = res.rows)
            .catch(err => console.log(err.stack))
            .then(()=>client.end);
        res.send(data);
    });   
    router.post('/getNoticias', async (req,res)=>{        
        let data;
        await client.query("select n.id_noticia, n.id_reportero, n.ultima_modificacion, n.fecha, n.estado, c.id_contenido, c.imagen, c.titulo, c.contenido, c.etiquetas, cat.id_categoria, cat.nombre from ((noticias n inner join contenidonoticia c on n.id_noticia = c.id_noticia) inner join categorianoticia cn on n.id_noticia = cn.id_noticia) inner join categorias cat on cn.id_categoria = cat.id_categoria")
            .then(res => data = res.rows)
            .catch(err => console.log(err.stack))
            .then(()=>client.end);
        res.send(data);
    });
    router.get('/getNoticias/:idNoticia', async (req,res)=>{
        const query = {
            text: "select n.id_noticia, n.id_reportero, n.ultima_modificacion, n.fecha, n.estado, c.id_contenido, c.imagen, c.titulo, c.contenido, c.etiquetas, cat.id_categoria, cat.nombre from ((noticias n inner join contenidonoticia c on n.id_noticia = c.id_noticia) inner join categorianoticia cn on n.id_noticia = cn.id_noticia) inner join categorias cat on cn.id_categoria = cat.id_categoria where n.id_noticia = $1",            
            values : [req.params.idNoticia]
        }                
        let noticia = await client.query(query);
        res.send(noticia.rows);
    });
    return router;
    
};