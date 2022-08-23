const router = require('express').Router();
const controller = require('../controllers/juguetesController');

//Multer para subir las imagenes de los juguetes
const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    } ,
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + '.' + file.originalname.split('.')[file.originalname.split('.').length -1]);
    }
});

const upload = multer({ storage: storage });


router.get('/', controller.getJuguetes);
router.get('/:id', controller.getJuguete);
router.post('/add', upload.single('imagen') , controller.createJuguete);
router.put('/update/:id', upload.single('imagen') , controller.updateJuguete);
router.delete('/delete/:id', controller.deleteJuguete);

module.exports = router;