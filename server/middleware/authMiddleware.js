// authMiddleware.js
// JWT token'ı kontrol eden özgün bir middleware

const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  // Tokenı header'dan al ("Bearer ...")
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Yetkisiz: Token yok!" });
  }

  const token = authHeader.split(" ")[1];

  try {
    // Tokenı doğrula
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Kullanıcı bilgisi req.user'a eklenir
    next();
  } catch (err) {
    return res.status(401).json({ error: "Geçersiz veya süresi dolmuş token!" });
  }
};