const router = require('express').Router();
const fabricanteController = require('../controllers/fabricantesController');

router.get('/', fabricanteController.getFabricantes);
router.get('/:id', fabricanteController.getFabricante);
router.post('/add', fabricanteController.createFabricante);
router.put('/update/:id', fabricanteController.updateFabricante);
router.delete('/delete/:id', fabricanteController.deleteFabricante);

module.exports = router;
