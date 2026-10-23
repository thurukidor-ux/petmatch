
import jwt from 'jsonwebtoken';

export const requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;

 
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Přístup odepřen: Chybí platný autorizační token.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'tajnyKlicProPetMatch2026SuperBezpecny');
    
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Neplatný nebo expirovaný token.' });
  }
};