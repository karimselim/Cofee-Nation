const { checkout } = require("./_lib/rules");

module.exports = (req, res) => {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Use POST" });
    return;
  }
  const result = checkout(req.body || {});
  res.status(result.status).json(result.body);
};
