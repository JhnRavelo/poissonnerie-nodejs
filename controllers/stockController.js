const { products } = require("../databases/models");

const addProduct = async (req, res) => {
  const { productName, priceOneKg, nbrDemiKg, nbrOneKg } = await req.body;
  try {
    if (!productName || !priceOneKg || !nbrDemiKg || !nbrOneKg)
      return res.json({ success: false, message: "Données non reçue" });
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
    res.json({ success: true, message: "Produit ajouté " + productName });
  } catch (error) {
    res.json({ success: false, message: "Erreur serveur" });
    console.log("ERROR ADD STOCK", error);
  }
};

const addStock = async (req, res) => {
  const { id, nbrDemiKg, nbrOneKg } = await req.body;

  if (!id || (!nbrDemiKg && !nbrOneKg))
    return res.json({
      success: false,
      message: "Données non reçue pour la mise à jour",
    });
  const updatedProduct = await products.findOne({ where: { id: id } });

  if (!updatedProduct)
    return res.json({ success: false, message: "Produit n'existe pas" });
  if (nbrDemiKg) updatedProduct.nbrDemiKg = Number(updatedProduct.nbrDemiKg) + Number(nbrDemiKg);
  if (nbrOneKg) updatedProduct.nbrOneKg = Number(updatedProduct.nbrOneKg) + Number(nbrOneKg);

  const result = await updatedProduct.save();

  if (!result)
    return res.json({ success: false, message: "Produit non mise à jour" });
  res.json({
    success: true,
    message:
      `${nbrDemiKg ? nbrDemiKg : nbrOneKg}` +
      " sachets de " +
      `${nbrDemiKg ? "demi" : "un"}` +
      " kilo ajouté à " +
      updatedProduct.productName,
  });
};

module.exports = { addProduct, addStock };
