const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/connection");

class Income extends Model {}

Income.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    income_name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1, 255],
      },
    },
    user_income_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "user",
        key: "id",
      },
    },
    budget_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "budget",
        key: "id",
      },
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        isNumeric: true,
      },
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [0, 255],
      },
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1, 255],
      },
    },
    date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    hooks: {
      async beforeCreate(newIncomeData) {
        if (newIncomeData.description === null) {
          newIncomeData.description = "No description provided.";
        }
        if (newIncomeData.description.length > 255) {
          newIncomeData.description = newIncomeData.description.substring(
            0,
            255
          );
        }
        if (newIncomeData.description.length < 1) {
          newIncomeData.description = "No description provided.";
        }
        if (newIncomeData.amount === null) {
          newIncomeData.amount = 0.00;
        }
        if (typeof newIncomeData.amount === "number") {
          newIncomeData.amount = parseFloat(newIncomeData.amount).toFixed(2);
        }
        return newIncomeData;
      },
    },
    sequelize,
    timestamps: true,
    freezeTableName: true,
    underscored: true,
    modelName: "income",
  }
);

module.exports = Income;
