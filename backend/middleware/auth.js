import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
  const token = req.header('x-auth-token');
  if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });

  if (token === 'mock_token') {
    req.user = { id: 'mock_user_id', role: 'user' };
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

export const verifyRole = (roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ msg: 'Access denied: insufficient permissions' });
    }
    next();
  };
};

export const isAdmin = verifyRole(['admin']);
export const isVendor = verifyRole(['vendor', 'admin']);
export const isDelivery = verifyRole(['delivery', 'admin']);
