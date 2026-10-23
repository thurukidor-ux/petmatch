
import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import { UserModel } from '../models/User.js';

const router = Router();
const client = new OAuth2Client();


router.post('/google', async (req, res) => {
  const { credential } = req.body;

  if (!credential) {
    return res.status(400).json({ error: 'Chybí Google credential token.' });
  }

  try {
    
    const ticket = await client.verifyIdToken({
      idToken: credential,
    });
    const payload = ticket.getPayload();
    const { email, name, sub: googleId } = payload;

    
    let user = await UserModel.findOne({ email });
    if (!user) {
      user = await UserModel.create({
        name,
        email,
        role: 'User',
        isVerified: false,
      });
    }

    
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
      },
      process.env.JWT_SECRET || 'tajnyKlicProPetMatch2026SuperBezpecny',
      { expiresIn: '24h' }
    );

    return res.json({
      message: 'Úspěšně přihlášeno přes Google!',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    console.error('Chyba při Google přihlášení:', error);
    return res.status(401).json({ error: 'Ověření Google tokenu selhalo.' });
  }
});

export default router;