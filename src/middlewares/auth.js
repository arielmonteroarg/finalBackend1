const authMiddleware = (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    res.redirect('/usuarios/login'); // o donde corresponda
  }
  };

  
  
  export default authMiddleware;