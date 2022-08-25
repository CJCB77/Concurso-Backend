const db = require('../db/connection');

const getFabricantes = async (req, res) => {
    //Get fabricante by user id query
    const id_usuario = req.query.id_usuario;
    if(id_usuario){
        try{
            const query = 'SELECT * FROM fabricante WHERE id_usuario = $1';
            const result = await db.query(query, [id_usuario]);
            return res.json(result.rows[0]);
        }catch(err){
            console.log(err);
        }
    }
    try{
        const query = 'SELECT * FROM fabricante';
        const result = await db.query(query);
        res.json(result.rows);

    }catch(err){
        console.log(err);
    }
}

const getFabricante = async (req, res) => {
    try{
        const id = req.params.id;
        const query = 'SELECT * FROM fabricante WHERE id = $1';
        const result = await db.query(query, [id]);
        res.json(result.rows[0]);
    }catch(err){
        console.log(err);
    }
}

const createFabricante = async (req, res) => {
    try{
        const {id_usuario,nombre,cedula,correo,direccion} = req.body;
        const query = 'INSERT INTO fabricante (id_usuario,nombre,cedula,correo,direccion) VALUES ($1,$2,$3,$4,$5) RETURNING *';
        const result = await db.query(query, [id_usuario,nombre,cedula,correo,direccion]);
        res.json(result.rows[0]);
    }catch(err){
        console.log(err);
    }
}

const updateFabricante = async (req, res) => {
    try{
        const id = req.params.id;
        const {id_usuario,nombre,cedula,correo,direccion} = req.body;
        const query = 'UPDATE fabricante SET id_usuario = $1, nombre = $2, cedula = $3, correo = $4, direccion = $5 WHERE id = $6 RETURNING *';
        const result = await db.query(query, [id_usuario,nombre,cedula,correo,direccion, id]);
        res.json(result.rows[0]);
    }catch(err){
        console.log(err);
    }
}

const deleteFabricante = async (req, res) => {
    try{
        const id = req.params.id;
        const query = 'DELETE FROM fabricante WHERE id = $1';
        const result = await db.query(query, [id]);
        res.json(result.rows);
    }catch(err){
        console.log(err);
    }
}

module.exports = {
    getFabricantes,
    getFabricante,
    createFabricante,
    updateFabricante,
    deleteFabricante
}
