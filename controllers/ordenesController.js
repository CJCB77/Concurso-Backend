const db = require('../db/connection');
const PDFDocument = require('pdfkit');
const transporter = require('../utilities/mailer');

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

const getOrdenPDF = async (req, res) => {
    const {id} = req.params;
    const resultOrden = await db.query('SELECT * FROM orden WHERE id = $1', [id]);
    const resultJuguete = await db.query('SELECT * FROM juguete WHERE id = $1', [resultOrden.rows[0].id_juguete]);
    const resultJugueteria = await db.query('SELECT * FROM jugueteria WHERE id = $1', [resultOrden.rows[0].id_jugueteria]);
    const orden = resultOrden.rows[0];
    const juguete = resultJuguete.rows[0];
    const jugueteria = resultJugueteria.rows[0];


    //Format orden.fecha_creacion to YYYY-MM-DD
    const fecha = orden.fecha_creacion.toISOString().split('T')[0];
    const fechaSplit = fecha.split('-');
    const fechaFormatted = fechaSplit[2] + '/' + fechaSplit[1] + '/' + fechaSplit[0];

    const doc = new PDFDocument({
        bufferPages: true,
    });


    const stream = res.writeHead(200, {
        'Content-Type': 'application/pdf',
        'Content-disposition': `attachment; filename=${id}_orden_${orden.fecha_creacion}.pdf`
        });

    doc.on('data', (data) => {
        stream.write(data);
    }).on('end', async () => {
        stream.end();
    }).on('error', (err) => {
        console.log(err);
    })

    doc.fontSize(22);
    doc.font('Helvetica-Bold');
    doc.text(`Orden # ${id}`, {
        align: 'center',
        underline: true,
    });
    doc.moveDown();
    
    doc.fontSize(18);
    doc.font('Helvetica-Bold');
    doc.text(`Fecha de emision: `, {
        continued: true,
    });
    doc.font('Helvetica');
    doc.text(fechaFormatted);
    doc.moveDown();   

    doc.font('Helvetica-Bold');
    doc.text(`Jugueteria: `, {
        continued: true,
    });
    doc.font('Helvetica');
    doc.text(jugueteria.nombre);
    doc.moveDown();

    doc.font('Helvetica-Bold');
    doc.text(`Ruc: `, {
        continued: true,
    });
    doc.font('Helvetica');
    doc.text(jugueteria.ruc);
    doc.moveDown();

    doc.font('Helvetica-Bold');
    doc.text(`Direccion: `, {
        continued: true,
    });
    doc.font('Helvetica');
    doc.text(jugueteria.direccion);
    doc.moveDown();

    doc.font('Helvetica-Bold');
    doc.text(`Telefono: `, {
        continued: true,
    });
    doc.font('Helvetica');
    doc.text(jugueteria.telefono);
    doc.moveDown();
    doc.moveDown();

    //Datos del pedido
    doc.fontSize(22);
    doc.font('Helvetica-Bold');
    doc.text(`Datos del pedido `, {
        align: 'center',
        underline: true,
    });
    doc.fontSize(18);
    doc.moveDown();
    doc.moveDown();

    doc.font('Helvetica-Bold');
    doc.text(`Juguete: `, {
        continued: true,
        align: 'left',
    });
    doc.font('Helvetica');
    doc.text(juguete.nombre);
    doc.moveDown();

    doc.font('Helvetica-Bold');
    doc.text(`Cantidad: `, {
        continued: true,
        align: 'left',
    });
    doc.font('Helvetica');
    doc.text(orden.cantidad,{
        align: 'right',
    });
    doc.moveDown();

    doc.font('Helvetica-Bold');
    doc.text(`Subtotal: `, {
        continued: true,
        align: 'left',
    });
    doc.font('Helvetica');
    doc.text(orden.subtotal,{
        align: 'right',
    });
    doc.moveDown();

    doc.font('Helvetica-Bold');
    doc.text(`Descuento: `, {
        continued: true,
        align: 'left',
    });
    doc.font('Helvetica');
    doc.text(orden.descuento, {
        align: 'right',
    });
    doc.moveDown();

    doc.fontSize(24);
    doc.font('Helvetica-Bold');
    doc.text(`Total: `, {
        continued: true,
        align: 'left',
    });
    doc.font('Helvetica');
    doc.text(orden.total,{
        align: 'right',
    });
    doc.moveDown();

    doc.end();
}

const getOrdenes = async (req, res) => {
    try{
        const query = `SELECT orden.*, juguete.nombre as juguete 
            FROM orden
            JOIN juguete ON orden.id_juguete = juguete.id
            ORDER BY fecha_creacion DESC
            `;
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
        const {id_juguete, id_jugueteria, cantidad, subtotal} = req.body;
        console.log(req.body);
        const {descuento, total} = calcularDescuento(subtotal,cantidad);
        const query = `INSERT INTO orden (id_juguete, id_jugueteria, cantidad, 
                subtotal, total, descuento) 
            VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`;
        const orden = await db.query(query, [id_juguete, id_jugueteria, cantidad, subtotal, total, descuento]);
        // Restar stock del juguete
        const query2 = 'UPDATE juguete SET stock = stock - $1 WHERE id = $2';

        //Crear pdf a enviar
        const doc = new PDFDocument();
        doc.fontSize(22);
        doc.font('Helvetica-Bold');
        doc.text(`Orden # ${orden.rows[0].id}`, {
            align: 'center',
            underline: true,
        });
        doc.moveDown();
        
    
        doc.font('Helvetica-Bold');
        doc.text(`Cantidad: `, {
            continued: true,
            align: 'left',
        });
        doc.font('Helvetica');
        doc.text(orden.rows[0].cantidad,{
            align: 'right',
        });
        doc.moveDown();
    
        doc.font('Helvetica-Bold');
        doc.text(`Subtotal: `, {
            continued: true,
            align: 'left',
        });
        doc.font('Helvetica');
        doc.text(orden.rows[0].subtotal,{
            align: 'right',
        });
        doc.moveDown();
    
        doc.font('Helvetica-Bold');
        doc.text(`Descuento: `, {
            continued: true,
            align: 'left',
        });
        doc.font('Helvetica');
        doc.text(orden.rows[0].descuento, {
            align: 'right',
        });
        doc.moveDown();
    
        doc.fontSize(24);
        doc.font('Helvetica-Bold');
        doc.text(`Total: `, {
            continued: true,
            align: 'left',
        });
        doc.font('Helvetica');
        doc.text(orden.rows[0].total,{
            align: 'right',
        });
        doc.moveDown();
    
        doc.end();
        // send mail with defined transport object
        transporter.sendMail({
            from: '"Orden de pedido generada" <coral.johnny.2@gmailcom>', // sender address
            to: "johnny7_coral@hotmail.com", // list of receivers
            subject: "Se genero un nuevo pedido de juguete ✔", // Subject line
            text: "Se genero orden de pedido de juguete, adjunta al email la orden", // plain text body
            //html: "<b>Hello world?</b>", // html body, can use template literals
            attachments: [
                {
                    filename: `orden_${orden.rows[0].fecha_creacion}.pdf`,
                    content: doc
                }
            ]

        });

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
    deleteOrden,
    getOrdenPDF
}
