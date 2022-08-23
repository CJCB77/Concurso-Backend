const router = require('express').Router();
const ciudadController = require('../controllers/ciudadesController');

router.get('/', ciudadController.getCiudades);
router.get('/:id', ciudadController.getCiudad);
router.post('/add', ciudadController.createCiudad);
router.put('/update/:id', ciudadController.updateCiudad);
router.delete('/delete/:id', ciudadController.deleteCiudad);

module.exports = router;