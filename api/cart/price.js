const { priceCart, applyPromo, totalsFor } = require("../_lib/rules");

module.exports = (req, res) => {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Use POST" });
    return;
  }
  const body = req.body || {};
  const priced = priceCart(body.items || []);
  if (priced.error) {
    res.status(400).json({ error: priced.error });
    return;
  }

  let discount = 0;
  let promoCode;
  if (body.promo) {
    const promo = applyPromo(body.promo, priced.subtotal);
    if (!promo.ok) {
      res.status(400).json({ error: promo.error });
      return;
    }
    discount = promo.discount;
    promoCode = promo.code;
  }

  res.status(200).json({
    lines: priced.lines,
    ...totalsFor(priced.subtotal, discount),
    promoCode,
  });
};
