/*LIBRERÍAS*/
const express = require('express');
const app = express();
const http = require('http').Server(app);

const cors = require('cors');
app.use(
    cors({
        origin:'*'
}));

const api = require('./rutas/api')(app);

const PORT = process.env.PORT || 3000;

app.set('port',PORT);
http.listen(app.get('port'), ()=>{
    console.log('Server corriendo en ', app.get('port'));
});