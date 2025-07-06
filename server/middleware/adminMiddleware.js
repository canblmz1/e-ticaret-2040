// adminMiddleware.js
// Sadece admin kullanıcıların erişimine izin verir

module.exports = function (req, res, next) {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    return res.status(403).json({ error: "Yasak: Sadece adminler erişebilir!" });
  }
};