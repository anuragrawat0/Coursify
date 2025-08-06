const jwt = require('jsonwebtoken');

    function auth(req, res, next) {
    const token =  req.headers.token

    if (!token){
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
        const decodedData = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decodedData;
        next();
    }catch (error) {
        return res.status(403).json({ message: 'Invalid token.' });
    }
}

const adminRoute = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized - No user info found" });
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied - Admins only" });
  }

  next(); // user is admin, continue
};

module.exports = { auth, adminRoute };
