const router = require('express').Router();
const { authRequired } = require('../middlewares/auth');
const eventController = require('../controllers/eventController');

router.post('/', authRequired, eventController.createEvent);
router.get('/', eventController.getEvents);
router.get('/:id', eventController.getEventById);
router.put('/:id', authRequired, eventController.updateEvent);
router.delete('/:id', authRequired, eventController.deleteEvent);
router.post('/:id/register', authRequired, eventController.registerForEvent);

module.exports = router;
