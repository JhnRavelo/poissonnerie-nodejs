module.exports = (sequelize, DataTypes) => {
  const achats = sequelize.define("achats", {
    id: {
      primaryKey: true,
      allowNull: false,
      type: DataTypes.INTEGER,
      autoIncrement: true,
    },
    type: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    nbr: {
      allowNull: true,
      type: DataTypes.INTEGER,
    },
    total: {
      allowNull: true,
      type: DataTypes.INTEGER,
    },
    price: {
      allowNull: true,
      type: DataTypes.INTEGER,
    },
    year: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    month: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    day: {
      allowNull: true,
      type: DataTypes.STRING,
    },
  });

  achats.associate = (models) => {
    achats.belongsTo(models.products, {
      foreignKey: "productId",
      onDelete: "CASCADE",
    });
  };

  return achats;
};
