const DataController = require('../controller/DataController');
const router = require("express").Router();

router.post('/sensor', DataController.add);
router.put('/update', DataController.update);
router.delete('/delete/:id', DataController.delete);
router.get('/list', DataController.list);
router.get('/detail/:id', DataController.detail);
router.get('', DataController.listen);

module.exports = router;
