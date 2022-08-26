const router = require('express').Router();
const controller = require('../controllers/usuarioController');

router.get('/', controller.getUsuarios);
router.get('/:id', controller.getUsuario);
router.post('/add', controller.createUsuario);
router.put('/update/:id', controller.updateUsuario);
router.delete('/delete/:id', controller.deleteUsuario);

router.get('/verify/jugueteria/:id', controller.verifyJugueteria);
router.get('/verify/fabricante/:id', controller.verifyFabricante);

module.exports = router;