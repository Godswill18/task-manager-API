import jwt from 'jsonwebtoken';
import UserModel from '../models/userModel.js';

export const protectRoute = async (req, res, next) => {
  try {
     const User = await UserModel()
    const token = req.cookies.jwt;
    if (!token) {
      return res.status(401).json({ error: "Unauthorized, no token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findByPk(decoded.userId, {
      attributes: { exclude: ['password'] }
    });

    if (!user) {
      return res.status(401).json({ error: "Unauthorized, user not found" });
    }

    req.user = user;
    next();

  } catch (error) {
    console.log(error);
    console.error("Error in protectRoute middleware:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
