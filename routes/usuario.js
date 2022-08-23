const router = require('express').Router();
const controller = require('../controllers/usuarioController');

router.get('/', controller.getUsuarios);
router.get('/:id', controller.getUsuario);
router.post('/add', controller.createUsuario);
router.put('/update/:id', controller.updateUsuario);
router.delete('/delete/:id', controller.deleteUsuario);

module.exports = router;