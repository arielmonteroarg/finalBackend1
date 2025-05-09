export default function errorHandler(err, req, res, next) {
    console.error('❌ Error detectado:', err.message);
    res.status(500).json({ error: err.message });
  }