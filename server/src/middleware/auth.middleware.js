const jwt = require("jsonwebtoken");
const db = require("../models");
const User = db.users;

const verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"] || req.headers["authorization"];

  if (!token) {
    return res.status(403).send({
      message: "Токен не предоставлен!",
    });
  }

  if (token.startsWith("Bearer ")) {
    token = token.slice(7, token.length);
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: "Не авторизован!",
      });
    }
    req.userId = decoded.id;
    next();
  });
};

const isAdmin = (req, res, next) => {
  User.findByPk(req.userId).then((user) => {
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
