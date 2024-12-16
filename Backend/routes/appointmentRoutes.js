// appointmentRoutes.js
import  Router  from 'express';
import { createAppointment, getAppointments , updateAppointment } from '../controllers/appointmentController.js';
import {authMiddleware,adminMiddleware} from '../middlewares/authMiddleware.js';
const router = Router();

router.get('/', authMiddleware, getAppointments);
router.post('/', authMiddleware, createAppointment);
router.patch('/:id', [authMiddleware,adminMiddleware], updateAppointment);


export default router;
