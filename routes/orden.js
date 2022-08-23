const router = require('express').Router();
const ordenController = require('../controllers/ordenesController');

router.get('/', ordenController.getOrdenes);
router.get('/:id', ordenController.getOrden);
router.post('/add', ordenController.createOrden);
router.put('/update/:id', ordenController.updateOrden);
router.delete('/delete/:id', ordenController.deleteOrden);

module.exports = router;
