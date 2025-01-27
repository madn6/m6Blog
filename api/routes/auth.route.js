import { signIn, signUp ,google} from '../controllers/auth.controller.js';
import express from 'express';

const router = express.Router();

router.post('/signup', signUp);
router.post('/signin', signIn);
router.post('/google', google);


export default router;
