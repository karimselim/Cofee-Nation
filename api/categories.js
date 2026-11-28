const { products } = require("./_lib/catalog");

module.exports = (req, res) => {
  if (req.method !== "GET") {
    res.status(405).json({ error: "Use GET" });
    return;
  }
  const counts = products.reduce((acc, p) => {
    acc[p.category] = (acc[p.category] || 0) + 1;
    return acc;
  }, {});
  res.status(200).json({
    items: Object.entries(counts).map(([category, count]) => ({ category, count })),
  });
};
