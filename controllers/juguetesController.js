const db = require('../db/connection');
const {uploadFile} = require('../db/s3');
const fs = require('fs');
const util = require('util');
const unlinkFile = util.promisify(fs.unlink);

const getJuguetes = async (req, res) => {
    try{
        const query = `SELECT juguete.id,juguete.nombre as nombre,id_jugueteria,descripcion,precio,stock,imagen,jugueteria.nombre as jugueteria
            FROM juguete
            JOIN jugueteria ON juguete.id_jugueteria = jugueteria.id`;
        const result = await db.query(query);
        res.json(result.rows);

    }catch(err){
        console.log(err);
    }
}

const getJuguete = async (req, res) => {
    try{
        const id = req.params.id;
        const query = 'SELECT * FROM juguete WHERE id = $1';
        const result = await db.query(query, [id]);
        res.json(result.rows);
    }catch(err){
        console.log(err);
    }
}

const createJuguete = async (req, res) => {
    try{
        const file = req.file;
        console.log(file);
        const bucketResult = await uploadFile(file);
        //Unlink file from local storage
        await unlinkFile(file.path);
        const imagen = bucketResult.Location;
        const {id_jugueteria,nombre, precio, descripcion,stock} = req.body;
        
        const query = `INSERT INTO juguete (id_jugueteria,nombre, precio, descripcion,stock, imagen) 
        VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`;
        const result = await db.query(query, [id_jugueteria,nombre, precio, descripcion,stock, imagen]);
        res.json(result.rows[0]);
    }catch(err){
        console.log(err);
    }
}

const updateJuguete = async (req, res) => {
    const {id_jugueteria,nombre, precio, descripcion,stock, imagen} = req.body;
    try{
        const id = req.params.id;
        if(req.file){
            const file = req.file;
            console.log(file);
            const bucketResult = await uploadFile(file);
            //Unlink file from local storage
            await unlinkFile(file.path);
            imagen = bucketResult.Location;
        }
        
        const query = 'UPDATE juguete SET id_jugueteria = $1, nombre = $2, precio = $3, descripcion = $4, stock = $5, imagen = $6 WHERE id = $7 Returning *';
        const result = await db.query(query, [id_jugueteria,nombre, precio, descripcion,stock, imagen, id]);
        res.json(result.rows[0]);
    }catch(err){
        console.log(err);
    }
}

const deleteJuguete = async (req, res) => {
    try{
        const id = req.params.id;
        const query = 'DELETE FROM juguete WHERE id = $1';
        const result = await db.query(query, [id]);
        res.json(result.rows[0]);
    }catch(err){
        console.log(err);
    }
}



module.exports = {
    getJuguetes,
    getJuguete,
    createJuguete,
    updateJuguete,
    deleteJuguete
}