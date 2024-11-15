const { achats, products } = require("../databases/models");

const addAchat = async (req, res) => {
  const { allAchats } = await req.body;
  console.log(allAchats);

  if (!allAchats || allAchats.length == 0)
    return res.json({ success: false, message: "Données non reçues" });
  await Promise.all(
    allAchats.map(async (achat) => {
      if (achat.id && achat.field && achat.nbr && achat.price && achat.total) {
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
          const type = achat.field == "nbrDemiKg" ? "de demi" : "d'un";
          const date = new Date();
          const month = date.getMonth() + 1;
          const day = date.getDate();
          const year = date.getFullYear();
          const updatedAchat = await achats.findOne({
            where: { day, month, year, productId: achat.id, type },
          });

          if (updatedAchat) {
            updatedAchat.nbr = Number(updatedAchat.nbr) + Number(achat.nbr);
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
};

module.exports = { addAchat };
