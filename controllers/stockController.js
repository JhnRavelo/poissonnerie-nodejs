const { products } = require("../databases/models");

const addProduct = async (req, res) => {
  const { productName, priceOneKg, nbrDemiKg, nbrOneKg, nbrKg } = await req.body;
  try {
    if (!productName || !priceOneKg || !nbrDemiKg || !nbrOneKg || !nbrKg)
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
      nbrKg: parseFloat(nbrKg),
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
  const { id, nbrDemiKg, nbrOneKg, nbrKg } = await req.body;

  try {
    if (!id || (!nbrDemiKg && !nbrOneKg && !nbrKg))
      return res.json({
        success: false,
        message: "Données non reçue pour la mise à jour",
      });
    const updatedProduct = await products.findOne({ where: { id: id } });

    if (!updatedProduct)
      return res.json({ success: false, message: "Produit n'existe pas" });
    if (nbrDemiKg)
      updatedProduct.nbrDemiKg =
        Number(updatedProduct.nbrDemiKg) + Number(nbrDemiKg);
    if (nbrOneKg)
      updatedProduct.nbrOneKg =
        Number(updatedProduct.nbrOneKg) + Number(nbrOneKg);
    if (nbrKg)
      updatedProduct.nbrKg =
        parseFloat(updatedProduct.nbrKg) + parseFloat(nbrKg);

    const result = await updatedProduct.save();

    if (!result)
      return res.json({ success: false, message: "Produit non mise à jour" });
    res.json({
      success: true,
      message:
        `${nbrDemiKg ? nbrDemiKg : nbrOneKg ? nbrOneKg : nbrKg}` +
        `${(nbrDemiKg || nbrOneKg) ? " sachet(s) " : ""}` +
        `${nbrDemiKg ? "de demi" : nbrOneKg ? "d'un" : ""}` +
        " kilo(s) ajouté à " +
        updatedProduct.productName,
    });
  } catch (error) {
    console.log("ERROR ADD STOCK", error);
    res.json({ success: false, message: "Erreur serveur" });
  }
};

const getStocks = async (req, res) => {
  try {
    const allProducts = await products.findAll();

    if (!allProducts)
      return res.json({ success: false, message: "Aucun données" });
    res.json({ success: true, datas: allProducts });
  } catch (error) {
    console.log("ERROR GET STOCKS", error);
    res.json({ success: false, message: "Erreur serveur" });
  }
};

const deleteStock = async (req, res) => {
  try {
    const id = req?.params?.id;

    if (!id) return res.json({ success: false, message: "Données non envoyé" });
    const deletedProduct = await products.findOne({ where: { id } });

    if (!deletedProduct)
      return res.json({ success: false, message: "Produit n'existe pas" });
    const result = await deletedProduct.destroy();

    if (!result)
      return res.json({ success: false, message: "Produit non effacé" });
    res.json({
      success: true,
      message: "Le produit " + deletedProduct.productName + " a été supprimé",
    });
  } catch (error) {
    res.json({ success: false, message: "Erreur serveur" });
    console.log("ERROR DELETE STOCK", error);
  }
};

const updateStock = async (req, res) => {
  const { id, productName, priceOneKg, nbrDemiKg, nbrOneKg, nbrKg } = await req.body;
  try {
    if (!productName || !priceOneKg || !nbrDemiKg || !nbrOneKg || !id || !nbrKg)
      return res.json({ success: false, message: "Données non reçue" });
    const updatedProduct = await products.findOne({ where: { id } });

    if (!updatedProduct)
      return res.json({ success: false, message: "Produit n'existe pas" });
    updatedProduct.set({ productName, priceOneKg, nbrDemiKg, nbrOneKg, nbrKg: parseFloat(nbrKg) });
    const result = await updatedProduct.save();

    if (!result)
      return res.json({ success: false, message: "Produit non mise à jour" });

    res.json({
      success: true,
      message: updatedProduct.productName + " a été mise à jour",
    });
  } catch (error) {
    res.json({ success: false, message: "Erreur serveur" });
    console.log("ERROR UPDATED PRODUCT", error);
  }
};

module.exports = { addProduct, addStock, getStocks, deleteStock, updateStock };
