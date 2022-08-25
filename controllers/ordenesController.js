const db = require('../db/connection');

function calcularDescuento(subtotal,cantidad){
    if(cantidad >= 150){
        let porcentajeDescuento = Math.floor((cantidad - 150)/50) * 0.02 + 0.15;
        console.log(porcentajeDescuento);
        let descuento = subtotal * porcentajeDescuento;
        let total = subtotal - descuento;
        return {descuento, total};
    }else if(cantidad >= 100){
        let descuento = subtotal * 0.15;
        let total = subtotal - descuento;
        return {descuento, total};
    }
    else if(cantidad >= 50 ){
        let descuento = subtotal * 0.1;
        let total = subtotal - descuento;
        return {descuento, total};
    }else{
        return {descuento: 0, total: subtotal};
    }
}

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
        const {id_juguete, id_fabricante, cantidad, subtotal} = req.body;
        console.log(req.body);
        const {descuento, total} = calcularDescuento(subtotal,cantidad);
        const query = `INSERT INTO orden (id_juguete, id_fabricante, cantidad, 
                subtotal, total, descuento) 
            VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`;
        await db.query(query, [id_juguete, id_fabricante, cantidad, subtotal, total, descuento]);
        // Restar stock del juguete
        const query2 = 'UPDATE juguete SET stock = stock - $1 WHERE id = $2';
        await db.query(query2, [cantidad, id_juguete]);
        res.json({
            message: 'Orden creada correctamente'
        });
      
    }catch(err){
        console.log(err);
    }
}

const updateOrden = async (req, res) => {
    try{
        const id = req.params.id;
        const {id_juguete, id_fabricante, cantidad, subtotal, total} = req.body;
        const query = 'UPDATE orden SET id_juguete = $1, id_fabricante = $2, cantidad = $3, subtotal = $4, total = $5 WHERE id = $6 RETURNING *';
        const result = await db.query(query, [id_juguete, id_fabricante, cantidad, subtotal, total, id]);
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
