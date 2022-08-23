const router = require('express').Router();
const jugueteriaController = require('../controllers/jugueteriaController');

router.get('/', jugueteriaController.getJugueterias);
router.get('/:id', jugueteriaController.getJugueteria);
router.post('/add', jugueteriaController.createJugueteria);
router.put('/update/:id', jugueteriaController.updateJugueteria);
router.delete('/delete/:id', jugueteriaController.deleteJugueteria);


module.exports = router;