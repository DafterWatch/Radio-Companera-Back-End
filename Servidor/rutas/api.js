//const express = require('express');
const multer = require('multer');
const {Client} = require('pg');
const jsonParser = require('express').json();
const fs = require('fs');
const { NODATA } = require('dns');
const client = new Client({
    host:'localhost',
    user:'postgres',
    port:5432,
    //password:'hmfdzpkjqx',
    password:'admin',
    database:'RadioCompanieraBD'
    //database:'RadioCompaneraDB'
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
        await client.query("SELECT * FROM Reportero ORDER BY Reportero.nombre_completo")
            .then(res => data = res.rows)
            .catch(err => console.log('Error recuperando cuentas: /probe',err.stack))
            .then(()=>client.end);            
        res.send(data);
    });   

    router.post('/probefilter/:idUser', async (req,res)=>{      
        let data;
        let id_usuario = req.params.idUser;

        await client.query(`SELECT * FROM Reportero  WHERE id_reportero like '%${id_usuario}%' OR nombre_completo like '%${id_usuario}%' ORDER BY Reportero.nombre_completo`)
            .then(res => data = res.rows)
            .catch(err => console.log('Error recuperando cuentas: /probefilter',err.stack))
            .then(()=>client.end);            
        res.send(data);
    });  

    router.post('/getUser/:idUser/:contrasenia', async (req,res)=>{        
        let id_usuario = req.params.idUser;
        let contra = req.params.contrasenia;
        let respuestaBD = null;                
        await client.query(`SELECT * FROM Reportero WHERE id_reportero ='${id_usuario}' AND contrase??a = '${contra}'`)
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
    router.post('/crearCuenta/:id_reportero/:nombres/:sexo/:cargo/:contra/:ci',async (req,res)=>{
        let idreport = req.params.id_reportero;
        let nombres = req.params.nombres;
        let sexo = req.params.sexo;
        let cargo = req.params.cargo;
        let contra = req.params.contra;
        let ci = req.params.ci;

        await client.query(`INSERT INTO reportero (id_reportero,nombre_completo,sexo,cargo,contrase??a,ci,habilitada)
        VALUES ('${idreport}','${nombres}','${sexo}','${cargo}','${contra}','${ci}','true');`)
        .catch(err=>{console.log(err.stack)})
        .then(()=>client.end);

        res.send(true);
    });

    router.post('/deshabilitarUser/:idUser', async (req,res)=>{        
        let id_usuario = req.params.idUser;       
        await client.query(`UPDATE reportero SET habilitada = 'false' WHERE id_reportero ='${id_usuario}'`)
            .catch(err => res.send(false))
            .then(()=>{
                client.end;
                res.send(true);
            });                
    });

    router.post('/cambiarFotoPerfil',jsonParser,(req,res)=>{     
        let urlFoto =req.body.urlPerfil;   
        let id_usuario = req.body.idUser;       
        client.query(`UPDATE reportero SET fotoperfil = '${urlFoto}' WHERE id_reportero ='${id_usuario}'`)
            .catch(err => res.send(false))
            .then(()=>{
                client.end;
                res.send(true);
            });         
    });

    //TODO Intentar 
    router.post('/confirmarfoto/:idUser/:urlPerfil', async (req,res)=>{        
        let id_usuario = req.params.idUser;   
        let urlFot =req.params.urlPerfil;
            console.log(id_usuario);
            console.log(urlFot);

        await client.query(`UPDATE reportero SET fotoperfil = '${urlFot}' WHERE id_reportero ='${id_usuario}'`)
            .catch(err => res.send(false))
            .then(()=>{
                client.end;
                res.send(true);
            }); 
    });

    router.post('/subirArchivo',upload.single('clientFile'),(req,res)=>{
        res.send(SERVER_DIR+req.file.path);
    });
    
    router.post('/saveSchema',jsonParser,(req,res)=>{
        fs.writeFile('folderSchema.txt',req.body.schema, (err)=>{
            if(err){
                console.log('No se puede escribir en el archivo');
                res.status(500).send(false);
            }else{
                res.status(200).send(true);
            }
        });
        
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
    router.post('/postComentario',jsonParser, async (req,res)=>{
        let noticia = req.body.idNoticia;
        let fecha = req.body.fecha;
        let nom = req.body.nombre;
        let cont = req.body.contenido;
        await client.query(`INSERT INTO comentarios (id_noticia, fecha, nombre, contenido) VALUES ('${noticia}','${fecha}','${nom}','${cont}');`)
        .catch(err=>{console.log(err.stack)})
        .then(()=>client.end);
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
    router.get('/getComentarios', (req,res)=>{                    
        client.query('SELECT * FROM comentarios ORDER BY id_comentario DESC')
            .then(comentarios => res.send(comentarios.rows))
            .catch( err => {
                console.log('Error recuperando comentarios: /getComentarios',err.stack);
                res.send(false);
            });
    });
    router.post('/borrarComentario/:idComentario', async (req,res)=>{        
        let id_comentario = req.params.idComentario;       
        await client.query(`DELETE FROM comentarios WHERE id_comentario ='${id_comentario}'`)
            .catch(err => res.send(false))
            .then(()=>{
                client.end;
                res.send(true);
            }); 
    });

    router.post('/cambiarContrasenia/:idUser/:nuevaContrasenia', async (req,res)=>{        
        let id_usuario = req.params.idUser;
        let contra = req.params.nuevaContrasenia;
        let respuestaBD = null;        
        await client.query(`UPDATE reportero SET contrase??a = '${contra}' WHERE id_reportero ='${id_usuario}'`)
            .catch(err => res.send(false))
            .then(()=>{
                client.end;
                res.send(true);
            }); 
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
                }
            });     
        if(idContenido){   
            const categoriesId_query = `SELECT id_categoria FROM categorias WHERE nombre in (${req.body.categorias.join(',')});`;
            try{
                let categoriesId = await client.query(categoriesId_query);        
                categoriesId = categoriesId.rows.map(row => `(${row.id_categoria},${idContenido})`);
                let categoryNotice_query = `INSERT INTO CategoriaNoticia(id_categoria,id_noticia) VALUES `+ categoriesId.join(',');            
                client.query(categoryNotice_query);
                res.send(true);
            }catch(err){
                console.log("Error insertando CategoriaNoticias /cargarContenidoNoticia",err.stack);
                res.send(false);
            }
        }else{
            res.send(false);
        }
    });
    router.get('/getCategorias',async (req,res)=>{
        const query = "SELECT * FROM categorias";
        try{
            const categories = await client.query(query);
            res.send(categories.rows);
        }catch(err){
            console.log("Error obteniendo categorias /getCategorias ",err.stack);
            res.send(false);
        }
    });
    router.post('/createCategory',jsonParser,(req,res)=>{
        const query = "INSERT INTO categorias (nombre,estado) VALUES ($1,true)";
        const values = [req.body.category];
        client.query(query,values)
              .then(()=>res.send(true))
              .catch((err)=> {console.log("Error insertando categoria /createCategory", err.stack); res.send(false)});
        
    });
    router.post('/getReportComplet/:idNoticia',async (req,res)=>{
        let idNot = req.params.idNoticia;
        let data;
        await client.query(`select noticias.id_noticia ,noticias.fecha_publicacion,noticias.ultima_modificacion,
        contenidonoticia.imagen,contenidonoticia.contenido,contenidonoticia.etiquetas,contenidonoticia.titulo,
        reportero.id_reportero,reportero.nombre_completo as nombreReportero
    from noticias 
    inner join contenidonoticia on noticias.id_noticia=contenidonoticia.id_noticia
    inner join reportero on reportero.id_reportero=noticias.id_reportero
    where noticias.id_noticia='${idNot}'
    group by noticias.id_noticia,contenidonoticia.imagen,contenidonoticia.contenido,
    contenidonoticia.etiquetas,contenidonoticia.titulo,
    reportero.id_reportero,reportero.nombre_completo
    order by noticias.id_noticia,contenidonoticia.imagen,contenidonoticia.contenido,
    contenidonoticia.etiquetas,contenidonoticia.titulo,
    reportero.id_reportero,reportero.nombre_completo asc;`)
            .then(res => data = res.rows)
            .catch(err => console.log(err.stack))
            .then(()=>client.end);            
        res.send(data);
    });

    router.get('/getCategoriaNotice/:idNoticia',async (req,res)=>{
        let idNot = req.params.idNoticia;
        const query = `select * from categorianoticia inner join categorias on categorianoticia.id_categoria=categorias.id_categoria where id_noticia='${idNot}'`;
        const categories = await client.query(query);
        res.send(categories.rows.map(cat => cat.nombre));
    });

    router.post('/updateNoticia/:idNoticia/:idReport', async (req,res)=>{
        let NotID=req.params.idNoticia;
        let idReport=req.params.idReport;
        //reportero
        const text = `UPDATE noticias SET ultima_modificacion='${idReport}' WHERE id_noticia='${NotID}';`;       
        try {
            await client.query(text);
            res.send(true);
        } catch (error) {
            console.log('Error actualizando noticia /updateNoticia',error.stack);
            res.send(false);
        }
    });

    router.post('/updateContenidoNoticia/:idNoticia',jsonParser, async (req,res)=>{
        let NotID=req.params.idNoticia;
        const query = `update ContenidoNoticia set id_noticia=$1,imagen=$2,titulo=$3,contenido=$4,etiquetas=$5 WHERE id_noticia='${NotID}';`;        
        const values = Object.values(req.body.ContenidoNoticia);
        let idContenido =NotID;

        await client.query(query,values);
        
        const deleteCateActuales = `delete from categorianoticia where id_noticia='${NotID}';`;
        await client.query(deleteCateActuales);
         
        const categoriesId_query = `SELECT id_categoria FROM categorias WHERE nombre in (${req.body.categorias.join(',')});`;
        let categoriesId = await client.query(categoriesId_query);        
        
        categoriesId = categoriesId.rows.map(row => `(${row.id_categoria},${idContenido})`);
        
        let categoryNotice_query = `INSERT INTO CategoriaNoticia(id_categoria,id_noticia) VALUES `+ categoriesId.join(',');            
        client.query(categoryNotice_query);
        res.send(true);
    });

    router.post('/deshabilitarNotice/:idNotice', async (req,res)=>{        
        let idNot = req.params.idNotice;       
        await client.query(`UPDATE noticias SET estado = 'false' WHERE id_noticia ='${idNot}'`)
            .catch(err => res.send(false))
            .then(()=>{
                client.end;
                res.send(true);
            }); 
    });

    router.get('/getEntradas', (req,res)=>{                    
        client.query(`
        select n.id_noticia,cn.titulo,r.nombre_completo,n.fecha_publicacion,n.ultima_modificacion,n.estado from
        noticias n inner join contenidonoticia cn on n.id_noticia=cn.id_noticia
        inner join reportero r on n.id_reportero=r.id_reportero
        ORDER BY n.id_noticia DESC
                `)
            .then(entradas =>  {                
                res.send(entradas.rows);
            })
            .catch( err => {
                console.log('Error recuperando entradas: /getEntradas',err.stack);
                res.send(false);
            });
                
    });
    router.get('/getBuscarEntradas/:tituloNoticia', (req,res)=>{
        let medio = req.params.tituloNoticia;
        client.query(`
        select n.id_noticia,cn.titulo,r.nombre_completo,n.fecha_publicacion,n.estado from
        noticias n inner join contenidonoticia cn on n.id_noticia=cn.id_noticia
        inner join reportero r on n.id_reportero=r.id_reportero
		where cn.titulo like '%${medio}%'
        ORDER BY n.id_noticia DESC`
        )               
        .then(entradas => res.send(entradas.rows))
        .catch( err => {
            console.log('Error recuperando entradas: /getBuscarEntradas',err.stack);
            res.send(false);
        });     
    });
    router.get('/getFiltarEntradasFecha/:fecha', (req,res)=>{
        let fecha = req.params.fecha;
        client.query(`
        select n.id_noticia,cn.titulo,r.nombre_completo,n.fecha_publicacion,n.estado from
        noticias n inner join contenidonoticia cn on n.id_noticia=cn.id_noticia
        inner join reportero r on n.id_reportero=r.id_reportero
		where n.fecha_publicacion = '${fecha}'
        ORDER BY n.id_noticia DESC`
        )               
        .then(entradas => res.send(entradas.rows))
        .catch( err => {
            console.log('Error recuperando entradas: /getFiltarEntradasFecha',err.stack);
            res.send(false);
        });    
    });
    router.get('/getFiltarEntradasCategoria/:categoria', (req,res)=>{
        let categoria = req.params.categoria;
        client.query(`
        select n.id_noticia,cn.titulo,r.nombre_completo,n.fecha_publicacion,n.estado from
        noticias n inner join contenidonoticia cn on n.id_noticia=cn.id_noticia
        inner join reportero r on n.id_reportero=r.id_reportero
		inner join categorianoticia catn on n.id_noticia=catn.id_noticia
		inner join categorias cat on catn.id_categoria=cat.id_categoria
		where cat.nombre = '${categoria}'
                    ORDER BY N.id_noticia DESC`
        )               
        .then(entradas => res.send(entradas.rows))
        .catch( err => {
            console.log('Error recuperando entradas: /getFiltarEntradasCategoria',err.stack);
            res.send(false);
        });  
    });
    router.post('/cambiarCategoria',(req,res)=>{
        //{id_categoria,eliminar, nuevo_valor}
        let query = "UPDATE Categorias SET";        
        const id_categoria = req.body.id_categoria;
        const eliminar = req.body.eliminar;
        if(eliminar){
            query += ` estado = FALSE WHERE id_categoria = ${id_categoria}`;
        }else{
            let newvalor=req.body.nuevo_valor;
            query += ` nombre = '${newvalor}' WHERE id_categoria = ${id_categoria}`;
            console.log(query);
        }
   
        client.query(query)
        .then(()=>res.send(true))
        .catch(err => {
            console.log("Error actualizando categorias /cambiarCategoria",err.stack);
            res.send(false);
        });       
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
        await client.query("SELECT n.id_noticia, n.id_reportero, n.ultima_modificacion, n.fecha_publicacion, n.estado, Cn.id_contenido, Cn.imagen, Cn.titulo, Cn.contenido, Cn.etiquetas, ARRAY_AGG(C.nombre) as categoriasarray FROM ((Noticias n INNER JOIN ContenidoNoticia Cn ON n.id_noticia = Cn.id_noticia) INNER JOIN categorianoticia CaN ON Cn.id_noticia = CaN.id_noticia) INNER JOIN categorias C ON C.id_categoria = CaN.id_categoria where not n.estado = false GROUP BY n.id_noticia, Cn.id_contenido order by n.id_noticia asc;")
            .then(res => data = res.rows)
            .catch(err => console.log(err.stack))
            .then(()=>client.end);
        res.send(data);
    });
    router.get('/getNoticias/:idNoticia', async (req,res)=>{
        const query = {
            text: "SELECT n.id_noticia, n.id_reportero, n.ultima_modificacion, n.fecha_publicacion, n.estado, Cn.id_contenido, Cn.imagen, Cn.titulo, Cn.contenido, Cn.etiquetas, ARRAY_AGG(C.nombre) as categoriasarray FROM ((Noticias n INNER JOIN ContenidoNoticia Cn ON n.id_noticia = Cn.id_noticia) INNER JOIN categorianoticia CaN ON Cn.id_noticia = CaN.id_noticia) INNER JOIN categorias C ON C.id_categoria = CaN.id_categoria where not n.estado = false and n.id_noticia = $1 GROUP BY n.id_noticia, Cn.id_contenido order by n.id_noticia asc;",
            values : [req.params.idNoticia]
        }                
        let comentario = await client.query(query);
        res.send(comentario.rows);
    });
    router.post('/getPublicidades', async (req,res)=>{        
        let data;
        await client.query("SELECT * FROM publicidad")
            .then(res => data = res.rows)
            .catch(err => console.log(err.stack))
            .then(()=>client.end);
        res.send(data);
    });
    router.post('/getConfiguraciones', async (req,res)=>{        
        let data;
        await client.query("SELECT * FROM configuracion")
            .then(res => data = res.rows)
            .catch(err => console.log(err.stack))
            .then(()=>client.end);
        res.send(data);
    });
    router.post('/getCategorias', async (req,res)=>{        
        let data;
        await client.query("SELECT * FROM categorias where estado = true")
            .then(res => data = res.rows)
            .catch(err => console.log(err.stack))
            .then(()=>client.end);
        res.send(data);
    });
    router.get('/getCategorias/:nombre', async (req,res)=>{
        const query = {
            text: `SELECT n.id_noticia, n.id_reportero, n.ultima_modificacion, n.fecha_publicacion, n.estado, 
            Cn.id_contenido, Cn.imagen, Cn.titulo, Cn.contenido, Cn.etiquetas, ARRAY_AGG(C.nombre) as categoriasarray 
            FROM ((Noticias n INNER JOIN ContenidoNoticia Cn ON n.id_noticia = Cn.id_noticia) 
            INNER JOIN categorianoticia CaN ON Cn.id_noticia = CaN.id_noticia) 
            INNER JOIN categorias C ON C.id_categoria = CaN.id_categoria 
            where not n.estado = false and C.nombre = $1
            GROUP BY n.id_noticia, Cn.id_contenido 
            order by n.id_noticia asc`,
            values : [req.params.nombre]
        }                
        let comentario = await client.query(query);
        res.send(comentario.rows);
    });
    router.get('/getCategoriasFecha/:fecha', async (req,res)=>{
        const query = {
            text: `SELECT n.id_noticia, n.id_reportero, n.ultima_modificacion, n.fecha_publicacion, n.estado, 
            Cn.id_contenido, Cn.imagen, Cn.titulo, Cn.contenido, Cn.etiquetas, ARRAY_AGG(C.nombre) as categoriasarray 
            FROM ((Noticias n INNER JOIN ContenidoNoticia Cn ON n.id_noticia = Cn.id_noticia) 
            INNER JOIN categorianoticia CaN ON Cn.id_noticia = CaN.id_noticia) 
            INNER JOIN categorias C ON C.id_categoria = CaN.id_categoria 
            where not n.estado = false and n.fecha_publicacion = $1
            GROUP BY n.id_noticia, Cn.id_contenido 
            order by n.id_noticia asc`,
            values : [req.params.fecha]
        }                
        let comentario = await client.query(query);
        res.send(comentario.rows);
    });
    router.get('/getEntradasPublicidad', (req,res)=>{                    
        client.query(`
                select Pu.id_publicidad, Pu.titulo, Pu.Empresa, Re.nombre_completo autor,
                    Pu.fechainicio, Pu.fechafin, Pu.estado
                from publicidad Pu inner join reportero Re on Pu.id_reportero=Re.id_reportero
                order by  estado desc
                `)
            .then(publicidad => res.send(publicidad.rows))
            .catch( err => console.log('Error recuperando publicidad: /getEntradasPublicidad',err.stack) );
    });
    router.get('/getEntradasPublicidadTitulo/:titulo', (req,res)=>{                    
        let izquierda = "%"+req.params.titulo;
        let medio = "%"+req.params.titulo+"%";
        let derecha = req.params.titulo+"%";
        client.query(`
                select Pu.id_publicidad, Pu.titulo, Pu.Empresa, Re.nombre_completo autor,
                    Pu.fechainicio, Pu.fechafin, Pu.estado
                from publicidad Pu inner join reportero Re on Pu.id_reportero=Re.id_reportero
                where Pu.titulo LIKE '${izquierda}' or Pu.titulo LIKE '${medio}' or Pu.titulo LIKE '${derecha}'
                order by id_publicidad DESC
                `)
            .then(publicidad => res.send(publicidad.rows))
            .catch( err => console.log('Error recuperando publicidad: /getEntradasPublicidad',err.stack) );
    });
    router.get('/getEntradasPublicidadEmpresa/:empresa', (req,res)=>{                    
        let izquierda = "%"+req.params.empresa;
        let medio = "%"+req.params.empresa+"%";
        let derecha = req.params.empresa+"%";
        client.query(`
                select Pu.id_publicidad, Pu.titulo, Pu.Empresa, Re.nombre_completo autor,
                    Pu.fechainicio, Pu.fechafin, Pu.estado
                from publicidad Pu inner join reportero Re on Pu.id_reportero=Re.id_reportero
                where Pu.empresa LIKE '${izquierda}' or Pu.empresa LIKE '${medio}' or Pu.empresa LIKE '${derecha}'
                order by id_publicidad DESC
                `)
            .then(publicidad => res.send(publicidad.rows))
            .catch( err => console.log('Error recuperando publicidad: /getEntradasPublicidad',err.stack) );
    });
    router.get('/getEntradasPublicidadFecha/:fecha', (req,res)=>{      
        let fecha = req.params.fecha;
        client.query(`
                select Pu.id_publicidad, Pu.titulo, Pu.Empresa, Re.nombre_completo autor,
                    Pu.fechainicio, Pu.fechafin, Pu.estado
                from publicidad Pu inner join reportero Re on Pu.id_reportero=Re.id_reportero
                where fechainicio<='${fecha}' AND fechafin>='${fecha}'
                order by id_publicidad DESC
                `)
            .then(publicidad => res.send(publicidad.rows))
            .catch( err => console.log('Error recuperando publicidad: /getEntradasPublicidad',err.stack) );
    });
    router.get('/getPublcidadHabiles', (req,res)=>{                    
        client.query(`
                select * from publicidad where estado=true;
                `)
            .then(publicidad => res.send(publicidad.rows))
            .catch( err => console.log('Error recuperando publicidad: /getPublcidadHabiles',err.stack) );
    });
    router.get('/getPubliOld', (req,res)=>{                    
        client.query(`
        select * from publicidad where estado=true order by fechafin asc limit 1;
                `)
            .then(publicidad => res.send(publicidad.rows))
            .catch( err => console.log('Error recuperando publicidad: /getPublcidadHabiles',err.stack) );
    });

    router.post('/desHabilitarPubli/:idPublic', async (req,res)=>{
        let idPublic=req.params.idPublic;
        const query = `update publicidad set estado=false WHERE id_publicidad='${idPublic}';`;
        await client.query(query).then(res.send(true))
        .catch(err=> {
            if(err){
                console.log('Error insertando contenido /desHabilitarPubli',err.stack);
                res.send(false);
            }
        });
    });
    router.post('/getPublicidadEdit/:idPublicidad',async (req,res)=>{
        let idPubli = req.params.idPublicidad;
        let data;
        await client.query(`select reportero.id_reportero,reportero.nombre_completo,
        publicidad.titulo,publicidad.empresa,publicidad.fechainicio,publicidad.fechafin,publicidad.estado,publicidad.enlace,publicidad.imagePublicidad
        from publicidad inner join reportero on publicidad.id_reportero=reportero.id_reportero
        where publicidad.id_publicidad='${idPubli}'`)
            .then(res => data = res.rows)
            .catch(err => console.log(err.stack))
            .then(()=>client.end);
            //console.log(data);
        res.send(data);
    });
    router.post('/cargarPublicidad',jsonParser, async (req,res)=>{

        //INSERTAR CONTENIDO NOTICIA
        const text = `INSERT INTO Publicidad 
                     (id_publicidad,id_reportero,titulo,empresa,enlace,fechainicio,fechafin,imagePublicidad,estado) 
                     VALUES(DEFAULT, $1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`;
        const values = Object.values(req.body.ContenidoPublicidad);
        await client.query(text,values)
            .then(res.send(true))
            .catch(err=> {
                if(err){
                    console.log('Error insertando contenido /cargarPublicidad',err.stack);
                    res.send(false);
                }
            });
    });

    router.post('/updatePublicidad/:idPublic',jsonParser, async (req,res)=>{
        let idPublic=req.params.idPublic;
        const query = `update publicidad set id_reportero=$1,titulo=$2,empresa=$3,enlace=$4,fechainicio=$5,fechafin=$6,imagepublicidad=$7,estado=$8 WHERE id_publicidad='${idPublic}';`;
        const values = Object.values(req.body.ContenidoPublicidad);
    
        await client.query(query,values).then(res.send(true)).catch(err => {
            console.log("Error actualizando publicidad: /updatePublicidad", err.stack);
            res.send(false);
        })        
    });

    //historial
    //general
    router.get('/getHistorialGeneral', (req,res)=>{                    
        client.query(`
                    select noticias.id_noticia,reportero.id_reportero,reportero.nombre_completo,reportero.cargo,contenidonoticia.titulo,noticias.fecha_publicacion,noticias.ultima_modificacion
                    from noticias 
                    inner join contenidonoticia on noticias.id_noticia=contenidonoticia.id_noticia 
                    inner join reportero on noticias.id_reportero=reportero.id_reportero
                    order by noticias.id_noticia desc
                `)
            .then(datosHistorial => res.send(datosHistorial.rows))
            .catch( err => console.log('Error recuperando datosHistorial: /getHistorialGeneral',err.stack) );
    });
    //personal
    router.get('/getHistorialPersonal/:idReport', (req,res)=>{      
        let idReport = req.params.idReport;
        client.query(`
        select noticias.id_noticia,reportero.id_reportero,reportero.nombre_completo,reportero.cargo,contenidonoticia.titulo,noticias.fecha_publicacion,noticias.ultima_modificacion
        from noticias 
        inner join contenidonoticia on noticias.id_noticia=contenidonoticia.id_noticia 
        inner join reportero on noticias.id_reportero=reportero.id_reportero
        where reportero.id_reportero = '${idReport}'
        order by noticias.id_noticia desc
                `)
            .then(datosHistorial => res.send(datosHistorial.rows))
            .catch( err => console.log('Error recuperando datosHistorial: /getHistorialPersonal',err.stack) );
    });

    //filters
    router.get('/getHistorialFilter/:value', (req,res)=>{      
        let value = req.params.value;
        client.query(`
        select noticias.id_noticia,reportero.id_reportero,reportero.nombre_completo,reportero.cargo,contenidonoticia.titulo,noticias.fecha_publicacion,noticias.ultima_modificacion
from noticias 
inner join contenidonoticia on noticias.id_noticia=contenidonoticia.id_noticia 
inner join reportero on noticias.id_reportero=reportero.id_reportero
where reportero.id_reportero like '%${value}%' OR reportero.nombre_completo like '%${value}%'
order by noticias.id_noticia desc
                `)
            .then(datosHistorial => res.send(datosHistorial.rows))
            .catch( err => console.log('Error recuperando datosHistorial: /getHistorialFilter',err.stack) );
    });

    router.get('/getHistorialFilterDate/:value', (req,res)=>{      
        let value = req.params.value;
        client.query(`
        select noticias.id_noticia,reportero.id_reportero,reportero.nombre_completo,reportero.cargo,contenidonoticia.titulo,noticias.fecha_publicacion,noticias.ultima_modificacion
from noticias 
inner join contenidonoticia on noticias.id_noticia=contenidonoticia.id_noticia 
inner join reportero on noticias.id_reportero=reportero.id_reportero
where noticias.fecha_publicacion = '${value}'
order by noticias.id_noticia desc
                `)
            .then(datosHistorial => res.send(datosHistorial.rows))
            .catch( err => console.log('Error recuperando datosHistorial: /getHistorialFilterDate',err.stack) );
    });

    router.get('/getHistorialFilterDatePersonal/:value/:date', (req,res)=>{      
        let value = req.params.value;
        let date = req.params.date;
        client.query(`
        select noticias.id_noticia,reportero.id_reportero,reportero.nombre_completo,reportero.cargo,contenidonoticia.titulo,noticias.fecha_publicacion,noticias.ultima_modificacion
        from noticias 
        inner join contenidonoticia on noticias.id_noticia=contenidonoticia.id_noticia 
        inner join reportero on noticias.id_reportero=reportero.id_reportero
        where reportero.id_reportero = '${value}' AND noticias.fecha_publicacion='${date}'
        order by noticias.id_noticia desc
                `)
            .then(datosHistorial => res.send(datosHistorial.rows))
            .catch( err => console.log('Error recuperando datosHistorial: /getHistorialFilterDatePersonal',err.stack) );
    });

   

    
    return router;
    
};