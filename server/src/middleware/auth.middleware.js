const jwt = require("jsonwebtoken");
const db = require("../models");
const User = db.users;

const verifyToken = async (req, res, next) => {
  try {
    let token = req.headers["x-access-token"] || req.headers["authorization"];

    if (!token) {
      return res.status(403).send({
        message: "Токен не предоставлен!",
      });
    }

    if (token.startsWith("Bearer ")) {
      token = token.slice(7, token.length);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.id);

    if (!user) {
      return res.status(401).send({
        message: "Пользователь не найден!",
      });
    }

    req.user = {
      user_id: user.id,
      email: user.email,
      role: user.role,
    };

    next();
  } catch (err) {
    return res.status(401).send({
      message: "Не авторизован!",
    });
  }
};

const isAdmin = (req, res, next) => {
  User.findByPk(req.user.user_id).then((user) => {
    if (user.role === "admin") {
      next();
      return;
    }

    res.status(403).send({
      message: "Требуется роль администратора!",
    });
  });
};

const authMiddleware = {
  verifyToken,
  isAdmin,
};

module.exports = authMiddleware;
