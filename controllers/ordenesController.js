const db = require('../db/connection');

const getOrdenes = async (req, res) => {
    try{
        const query = 'SELECT * FROM orden';
        const result = await db.query(query);
        res.json(result.rows);
    }catch(err){
        console.log(err);
    }
}

const getOrden = async (req, res) => {
    try{
        const id = req.params.id;
        const query = 'SELECT * FROM orden WHERE id = $1';
        const result = await db.query(query, [id]);
        res.json(result.rows[0]);
    }catch(err){
        console.log(err);
    }
}

const createOrden = async (req, res) => {
    try{
        const {id_jugute, id_fabricante, cantidad, subtotal, total} = req.body;
        const query = 'INSERT INTO orden (id_jugute, id_fabricante, cantidad, subtotal, total) VALUES ($1,$2,$3,$4,$5) RETURNING *';
        const result = await db.query(query, [id_jugute, id_fabricante, cantidad, subtotal, total]);
        res.json(result.rows[0]);
    }catch(err){
        console.log(err);
    }
}

const updateOrden = async (req, res) => {
    try{
        const id = req.params.id;
        const {id_jugute, id_fabricante, cantidad, subtotal, total} = req.body;
        const query = 'UPDATE orden SET id_jugute = $1, id_fabricante = $2, cantidad = $3, subtotal = $4, total = $5 WHERE id = $6 RETURNING *';
        const result = await db.query(query, [id_jugute, id_fabricante, cantidad, subtotal, total, id]);
        res.json(result.rows[0]);
    }catch(err){
        console.log(err);
    }

}

const deleteOrden = async (req, res) => {
    try{
        await db.query('DELETE FROM orden WHERE id = ?', [req.params.id])
            .then( orden => res.json(orden))
            .catch( err => console.log(err));
    }catch(err){
        console.log(err);
    }
}

module.exports = {
    getOrdenes,
    getOrden,
    createOrden,
    updateOrden,
    deleteOrden
}
