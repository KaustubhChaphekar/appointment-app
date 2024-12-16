// authRoutes.js
import  Router  from 'express';
import { registerUsers, loginUser } from '../controllers/authController.js';
const router = Router();

router.post('/register', registerUsers);
router.post('/login', loginUser);

export default router;
