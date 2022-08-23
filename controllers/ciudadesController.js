const db = require('../db/connection');

const getCiudades = async (req, res) => {
    try{
        const query = 'SELECT * FROM ciudad';
        const result = await db.query(query);
        res.json(result.rows);
    }catch(err){
        console.log(err);
    }
}

const getCiudad = async (req, res) => {
    try{
        const query = 'SELECT * FROM ciudad WHERE id = $1';
        const result = await db.query(query, [req.params.id]);
        res.json(result.rows[0]);
    }catch(err){
        console.log(err);
    }
}

const createCiudad = async (req, res) => {
    try{
        const {nombre} = req.body;
        const query = 'INSERT INTO ciudad (nombre) VALUES ($1) RETURNING *';
        const result = await db.query(query, [nombre]);
        res.json(result.rows[0]);
    }catch(err){
        console.log(err);
    }
}

const updateCiudad = async (req, res) => {
    try{
        const id = req.params.id;
        const {nombre} = req.body;
        const query = 'UPDATE ciudad SET nombre = $1 WHERE id = $2 RETURNING *';
        const result = await db.query(query, [nombre, id]);
        res.json(result.rows);
    }catch(err){
        console.log(err);
    }
}

const deleteCiudad = async (req, res) => {
    try{
        const id = req.params.id;
        const query = 'DELETE FROM ciudad WHERE id = $1 RETURNING *';
        const result = await db.query(query, [id]);
        res.json(result.rows[0]);
    }catch(err){
        console.log(err);
    }
}

module.exports = {
    getCiudades,
    getCiudad,
    createCiudad,
    updateCiudad,
    deleteCiudad
}

