const express = require('express');
const db = require('./db/connection');
const verifyToken = require('./validation/verifyToken');

//Add cors
const cors = require('cors');


//Routes
const juguetesRoute = require('./routes/juguetes');
const usuarioRoute = require('./routes/usuario');
const jugueteriaRoute = require('./routes/jugueteria');
const fabricanteRoute = require('./routes/fabricantes');
const ordenesRoutes = require('./routes/orden'); 
const ciudadRoutes = require('./routes/ciudades');
const authRoutes = require('./routes/auth');

//Middlewares
const app = express();
app.use(express.json());
app.use(cors());


app.use('/juguetes' , juguetesRoute);
app.use('/usuario', usuarioRoute);
app.use('/jugueterias', jugueteriaRoute);
app.use('/fabricantes', fabricanteRoute);
app.use('/ordenes', ordenesRoutes);
app.use('/ciudades', ciudadRoutes);
app.use('/auth', authRoutes);

//Use env variables
require('dotenv').config();

app.get('/', (req, res) => {
    res.json({Message: 'API de Jugueteria'});
    });


const startApp = async () => {
    try{
        await db.connect()
            .then( () => console.log('DB connected'))
            .then( () => app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`)))
            .catch( err => console.log(err));
    }catch(err){
        console.log(err);
    }
}

startApp();