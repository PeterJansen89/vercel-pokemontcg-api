const axios = require("axios");

module.exports = async (req, res) => {
  const { set, number } = req.query;

  if (!set || !number) {
    return res.status(400).json({ error: "Missing parameters" });
  }

  const query = `set.name:${set} number:${number}`;
  const API_KEY = process.env.PTCG_API_KEY;

  try {
    const response = await axios.get("https://api.pokemontcg.io/v2/cards", {
      params: { q: query, pageSize: 1 },
      headers: { "X-Api-Key": API_KEY }
    });

    const card = response.data?.data?.[0];
    if (!card) return res.json({ found: false });

    return res.json({
      found: true,
      name: card.name,
      set: card.set?.name,
      id: card.id,
      productId: card.tcgplayer?.productId || null,
      marketPrice: card.tcgplayer?.prices?.normal?.market || null
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};