const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/connection");

class Budget extends Model {}
Budget.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    budget_name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1, 255],
      },
    },
    user_budget_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "user",
        key: "id",
      },
    },
    month:  {
      type: DataTypes.STRING,
      allowNull: true,
     },
    total_expense: {
      type: DataTypes.DECIMAL(10, 2),
      validate: {
        isNumeric: true,
      },
    },
    total_income: {
      type: DataTypes.DECIMAL(10, 2),
      validate: {
        isNumeric: true,
      },
    },
    total_savings: {
      type: DataTypes.DECIMAL(10, 2),
      validate: {
        isNumeric: true,
      },
    },
  },
  {
    hooks: {
      async beforeCreate(newBudgetData) {
        if (typeof newBudgetData.total_expense === 'number') {
          newBudgetData.total_expense = parseFloat(newBudgetData.total_expense).toFixed(2);
        }
        if (typeof newBudgetData.total_income === 'number') {
          newBudgetData.total_income = parseFloat(newBudgetData.total_income).toFixed(2);
        }
        if (typeof newBudgetData.total_savings === 'number') {
          newBudgetData.total_savings = parseFloat(newBudgetData.total_savings).toFixed(2);
        }
        return newBudgetData;
      }
    },
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: "budget",
  }
);

module.exports = Budget;
