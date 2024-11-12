const { products } = require("../databases/models");

const addStock = async (req, res) => {
  const { productName, priceOneKg, nbrDemiKg, nbrOneKg } = await req.body;
  try {
    if (!productName || !priceOneKg || !nbrDemiKg || !nbrOneKg)
      return res.json({ success: false, message: "données non reçue" });
    const isProduct = await products.findOne({
      where: { productName: productName },
    });

    if (isProduct)
      return res.json({ success: false, message: "Ce produit existe déjà" });
    const addedProduct = await products.create({
      productName,
      priceOneKg,
      nbrDemiKg,
      nbrOneKg,
    });

    if (!addedProduct)
      return res.json({ success: false, message: "Produit non ajouté" });
    res.json({ success: true });
  } catch (error) {
    res.json({ success: false, message: "Erreur serveur" });
    console.log("ERROR ADD STOCK", error);
  }
};

module.exports = { addStock };
