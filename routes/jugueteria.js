const router = require('express').Router();
const jugueteriaController = require('../controllers/jugueteriaController');

router.get('/', jugueteriaController.getJugueterias);
router.post('/add', jugueteriaController.createJugueteria);
router.get('/:id', jugueteriaController.getJugueteria);
router.put('/update/:id', jugueteriaController.updateJugueteria);
router.delete('/delete/:id', jugueteriaController.deleteJugueteria);


module.exports = router;