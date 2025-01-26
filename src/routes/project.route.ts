import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
  res.json({ message: 'Soy la ruta de los projects' });
});

export default router;