const { products, withPrices } = require("../_lib/catalog");

module.exports = (req, res) => {
  if (req.method !== "GET") {
    res.status(405).json({ error: "Use GET" });
    return;
  }
  const slug = String((req.query && req.query.slug) || "");
  const [category, id] = slug.split("-");
  const product = products.find(
    (p) => p.category === category && String(p.id) === String(id)
  );
  if (!product) {
    res.status(404).json({ error: `No product with id ${slug}` });
    return;
  }
  res.status(200).json(withPrices(product));
};
