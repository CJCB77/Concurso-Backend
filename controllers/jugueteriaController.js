const db = require('../db/connection');

const getJugueterias = async (req, res) => {
    try{
        const query = `SELECT jugueteria.*, ciudad.nombre as ciudad_nombre
            FROM jugueteria
            JOIN ciudad ON jugueteria.ciudad = ciudad.id
            `;
        const result = await db.query(query);
        res.json(result.rows);

    }catch(err){
        console.log(err);
    }
}

const getJugueteria = async (req, res) => {
    try{
        const id = req.params.id;
        const query = `SELECT jugueteria.*, ciudad.nombre as ciudad_nombre 
            FROM jugueteria 
            JOIN ciudad ON jugueteria.ciudad = ciudad.id
            WHERE jugueteria.id = $1`;
        const result = await db.query(query, [id]);
        res.json(result.rows[0]);
    }catch(err){
        console.log(err);
    }
}

const createJugueteria = async (req, res) => {
    console.log(req.body);
    try{
        const {id_usuario,nombre,ruc,titular,ciudad,direccion,telefono} = req.body;
        console.log(req.body);
        const query = 'INSERT INTO jugueteria (id_usuario,nombre,ruc,titular,ciudad,direccion,telefono) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *';
        const result = await db.query(query, [id_usuario,nombre,ruc,titular,ciudad,direccion,telefono]);
        res.json(result.rows[0]);
    }catch(err){
        console.log(err);

    }
}

const updateJugueteria = async (req, res) => {
    try{
        const id = req.params.id;
        const {id_usuario,nombre,ruc,titular,ciudad,direccion,telefono} = req.body;
        const query = `UPDATE jugueteria SET id_usuario = $1, nombre = $2, ruc = $3, titular = $4, 
            ciudad = $5, direccion = $6, telefono = $7 WHERE id = $8 RETURNING *`;
        const result = await db.query(query, [id_usuario,nombre,ruc,titular,ciudad,direccion,telefono, id]);
        res.json(result.rows[0]);
    }catch(err){
        console.log(err);
    }
}

const deleteJugueteria = async (req, res) => {
    try{
        const id = req.params.id;
        const query = 'DELETE FROM jugueteria WHERE id = $1';
        const result = await db.query(query, [id]);
        res.json(result.rows);
    }catch(err){
        console.log(err);
    }
}

module.exports = {
    getJugueterias,
    getJugueteria,
    createJugueteria,
    updateJugueteria,
    deleteJugueteria
}