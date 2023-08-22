const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/connection");

class Expense extends Model {}

Expense.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    expense_name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1, 255],
      },
    },
    user_expense_id: {
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
    },
  },
  {
    hooks: {
      async beforeCreate(newExpenseData) {
        if (newExpenseData.description === null) {
          newExpenseData.description = "No description provided.";
        }
        if (newExpenseData.description.length > 255) {
          newExpenseData.description = newExpenseData.description.substring(
            0,
            255
          );
        }
        if (newExpenseData.description.length < 1) {
          newExpenseData.description = "No description provided.";
        }
        if (newExpenseData.amount === null) {
          newExpenseData.amount = 0.0;
        }
        if (typeof newExpenseData.amount === "number") {
          newExpenseData.amount = parseFloat(newExpenseData.amount).toFixed(2);
        }
        return newExpenseData;
      },
    },
    sequelize,
    timestamps: true,
    freezeTableName: true,
    underscored: true,
    modelName: "expense",
  }
);

module.exports = Expense;
