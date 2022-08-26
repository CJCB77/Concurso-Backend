const db = require('../db/connection');
const {uploadFile} = require('../db/s3');
const fs = require('fs');
const util = require('util');
const unlinkFile = util.promisify(fs.unlink);

const getJuguetes = async (req, res) => {
    //Query idUsuario
    const idUsuario = req.query.id_usuario;
    if(idUsuario){
        try{
            const query = `SELECT juguete.*, fabricante.nombre as fabricante FROM juguete
                JOIN fabricante ON juguete.id_fabricante = fabricante.id
                JOIN usuario ON fabricante.id_usuario = usuario.id
                WHERE usuario.id = $1
                `;
            const result = await db.query(query, [idUsuario]);
            return res.json(result.rows);
        }catch(err){
            console.log(err);
        }
    }

    try{
        const query = `SELECT juguete.id,juguete.nombre as nombre,id_fabricante,descripcion,precio,stock,imagen,fabricante.nombre as fabricante
            FROM juguete
            JOIN fabricante ON juguete.id_fabricante = fabricante.id`;
        const result = await db.query(query);
        res.json(result.rows);

    }catch(err){
        console.log(err);
    }
}

const getJuguete = async (req, res) => {
    try{
        const id = req.params.id;
        const query = `SELECT juguete.*, fabricante.nombre as fabricante
            FROM juguete 
            JOIN fabricante ON juguete.id_fabricante = fabricante.id
            WHERE juguete.id = $1`;
        const result = await db.query(query, [id]);
        console.log(result.rows[0]);
        res.json(result.rows[0]);
    }catch(err){
        console.log(err);
    }
}

const createJuguete = async (req, res) => {
    try{
        const file = req.file;
        console.log(file);
        console.log(req.body);
        const bucketResult = await uploadFile(file);
        //Unlink file from local storage
        await unlinkFile(file.path);
        const imagen = bucketResult.Location;
        const {id_fabricante,nombre, precio, descripcion,stock} = req.body;
        
        const query = `INSERT INTO juguete (id_fabricante,nombre, precio, descripcion,stock, imagen) 
        VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`;
        const result = await db.query(query, [id_fabricante,nombre, precio, descripcion,stock, imagen]);
        res.json(result.rows[0]);
    }catch(err){
        console.log(err);
    }
}

const updateJuguete = async (req, res) => {
    const {id_fabricante,nombre, precio, descripcion,stock, imagen} = req.body;
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
        
        const query = 'UPDATE juguete SET id_fabricante = $1, nombre = $2, precio = $3, descripcion = $4, stock = $5, imagen = $6 WHERE id = $7 Returning *';
        const result = await db.query(query, [id_fabricante,nombre, precio, descripcion,stock, imagen, id]);
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