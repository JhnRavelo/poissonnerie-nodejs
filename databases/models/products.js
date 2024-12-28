module.exports = (sequelize, DataTypes) => {
  const products = sequelize.define("products", {
    id: {
      primaryKey: true,
      allowNull: false,
      type: DataTypes.INTEGER,
      autoIncrement: true,
    },
    productName: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    priceOneKg: {
      allowNull: true,
      type: DataTypes.INTEGER,
    },
    nbrKg: {
      allowNull: true,
      type: DataTypes.FLOAT,
    },
    nbrDemiKg: {
      allowNull: true,
      type: DataTypes.INTEGER,
    },
    nbrOneKg: {
      allowNull: true,
      type: DataTypes.INTEGER,
    },
  });

  products.associate = (models) => {
    products.hasMany(models.achats, { foreignKey: "productId" });
  };

  return products;
};
