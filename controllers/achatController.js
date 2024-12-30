const { achats, products } = require("../databases/models");

const addAchat = async (req, res) => {
  const { allAchats } = await req.body;
  try {
    if (!allAchats || allAchats.length == 0)
      return res.json({ success: false, message: "Données non reçues" });
    await Promise.all(
      allAchats.map(async (achat) => {
        if (
          achat.id &&
          achat.field &&
          achat.nbr &&
          achat.price &&
          achat.total
        ) {
          const updatedProduct = await products.findOne({
            where: { id: achat.id },
          });
          if (
            updatedProduct &&
            Number(achat.nbr) <= Number(updatedProduct[achat.field])
          ) {
            updatedProduct[achat.field] =
              Number(updatedProduct[achat.field]) - Number(achat.nbr);
            await updatedProduct.save();
            const type = achat.field == "nbrDemiKg" ? "de demi" : achat.field == "nbrKg" ? "gram" : "d'un";
            const date = new Date();
            const month = date.getMonth() + 1;
            const day = date.getDate();
            const year = date.getFullYear();
            const updatedAchat = await achats.findOne({
              where: { day, month, year, productId: achat.id, type },
            });

            if (updatedAchat) {
              updatedAchat.nbr = parseFloat(updatedAchat.nbr) + parseFloat(achat.nbr);
              updatedAchat.total =
                Number(updatedAchat.total) + Number(achat.total);
              await updatedAchat.save();
            } else {
              await achats.create({
                day,
                month,
                year,
                productId: achat.id,
                type,
                nbr: achat.nbr,
                price: achat.price,
                total: achat.total,
              });
            }
          }
        }
      })
    );

    res.json({ success: true, message: "Achat réussie" });
  } catch (error) {
    res.json({ success: false, message: "Erreur serveur" });
    console.log("ERROR ADD ACHATS", error);
  }
};

const getAchat = async (req, res) => {
  try {
    const years = await achats.findAll({
      attributes: ["year"],
      group: ["year"],
      raw: true,
    });

    const arrayYears = years.map((year) => year.year);

    const allAchats = await achats.findAll({
      include: [{ model: products }],
      order: [["createdAt", "DESC"]],
    });

    res.json({ datas: allAchats, years: arrayYears, success: true });
  } catch (error) {
    res.json({ success: false, message: "Erreur serveur" });
    console.log("ERROR GET ACHAT", error);
  }
};

const getDaysInAMonth = async (req, res) => {
  try {
    const { year, month } = await req.body;

    const days = await achats.findAll({
      where: { year, month },
      attributes: ["day"],
      group: ["day"],
      order: [["createdAt", "DESC"]],
      raw: true,
    });

    const arrayDays = days.map((day) => day.day);

    res.json({ days: arrayDays, success: true });
  } catch (error) {
    res.json({ success: false, message: "Erreur serveur" });
    console.log("ERROR GET DAYS IN A MONTH", error);
  }
};

module.exports = { addAchat, getAchat, getDaysInAMonth };
