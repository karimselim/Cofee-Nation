const { all, byCategory, sortItems, SEGMENT_CATEGORY } = require("../_lib/catalog");

const MAX_LIMIT = 100;

module.exports = (req, res) => {
  if (req.method !== "GET") {
    res.status(405).json({ error: "Use GET" });
    return;
  }
  const { category, q, sort, max, page, limit } = req.query || {};

  if (category !== undefined && !SEGMENT_CATEGORY[String(category)]) {
    res.status(400).json({ error: `Unknown category: ${category}` });
    return;
  }

  let items = category !== undefined ? byCategory(category) : all();

  if (q) {
    const needle = String(q).toLowerCase();
    items = items.filter((p) => p.title.toLowerCase().includes(needle));
  }

  if (max !== undefined && String(max) !== "") {
    const maxPrice = Number(max);
    if (!Number.isFinite(maxPrice) || maxPrice <= 0) {
      res.status(400).json({ error: "max must be a number above 0" });
      return;
    }
    items = items.filter((p) => p.price <= maxPrice);
  }

  const allowedSorts = ["price-asc", "price-desc", "name-asc", "name-desc"];
  if (sort !== undefined && sort !== "" && !allowedSorts.includes(String(sort))) {
    res.status(400).json({ error: `Unknown sort: ${sort}` });
    return;
  }
  items = sortItems(items, sort);

  const pageNumber = Math.max(1, Number(page) || 1);
  const perPage = Math.min(MAX_LIMIT, Math.max(1, Number(limit) || 12));
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const start = (pageNumber - 1) * perPage;

  res.status(200).json({
    items: items.slice(start, start + perPage),
    total,
    page: pageNumber,
    limit: perPage,
    totalPages,
  });
};
