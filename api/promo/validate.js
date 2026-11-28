const { applyPromo, priceCart } = require("../_lib/rules");

module.exports = (req, res) => {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Use POST" });
    return;
  }
  const body = req.body || {};
  let subtotal = Number(body.subtotal);
  if (!Number.isFinite(subtotal)) {
    const priced = priceCart(body.items || []);
    if (priced.error) {
      res.status(400).json({ error: priced.error });
      return;
    }
    subtotal = priced.subtotal;
  }
  const result = applyPromo(body.code, subtotal);
  if (!result.ok) {
    res.status(400).json({ error: result.error });
    return;
  }
  res.status(200).json(result);
};
