const db = require('../db/connection');

const getUsuarios = async (req, res) => {
    try{
        const query = 'SELECT * FROM usuario';
        const result = await db.query(query);
        res.json(result.rows);

    }catch(err){
        console.log(err);
    }
}

const getUsuario = async (req, res) => {
    try{
        const id = req.params.id;
        const query = 'SELECT * FROM usuario WHERE id = $1';
        const result = await db.query(query, [id]);
        res.json(result.rows);
    }catch(err){
        console.log(err);
    }
}

const createUsuario = async (req, res) => {
    console.log(req.body);
    try{
        const {username,password,rol} = req.body;
        const query = 'INSERT INTO usuario (username,password,rol) VALUES ($1,$2,$3)';
        const result = await db.query(query, [username,password,rol]);
        res.json(result.rows);
    }catch(err){
        console.log(err);
    }
}

const updateUsuario = async (req, res) => {
    try{
        const id = req.params.id;
        const {username,password,rol} = req.body;
        const query = 'UPDATE usuario SET username = $1, password = $2, rol = $3 WHERE id = $4';
        const result = await db.query(query, [username,password,rol, id]);
        res.json(result.rows);
    }catch(err){
        console.log(err);
    }
}

const deleteUsuario = async (req, res) => {
    try{
        const id = req.params.id;
        const query = 'DELETE FROM usuario WHERE id = $1';
        const result = await db.query(query, [id]);
        res.json(result.rows);
    }catch(err){
        console.log(err);
    }
}

module.exports = {
    getUsuarios,
    getUsuario,
    createUsuario,
    updateUsuario,
    deleteUsuario
}