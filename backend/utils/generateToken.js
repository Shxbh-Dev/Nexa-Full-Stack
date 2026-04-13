import jwt from 'jsonwebtoken';

const generateToken = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });

  // Set JWT as an HTTP-Only cookie
  res.cookie('jwt', token, {
    httpOnly: true,
    // MUST be true in production for SameSite: 'none' to work
    secure: true, 
    // 'none' allows the cookie to be sent across different domains (Vercel -> Render)
    sameSite: 'none', 
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 Days
  });
};

export default generateToken;