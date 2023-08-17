// Query Selectors
const incomeChart = document.querySelector("#income-chart");
const expenseChart = document.querySelector("#expense-chart");
const incomeBar = document.querySelector("#income-bar-chart");
const expenseBar = document.querySelector("#expense-bar-chart");
const overviewTable = document.querySelector("#overview-table");
const deleteAll = document.querySelector("#delete-budget");
const savings = document.querySelector("#savings").value;
const totalSavingsElement = document.querySelector("#savings");

const totalSavingsText = totalSavingsElement.textContent;
const totalSavings = parseFloat(totalSavingsText.match(/-?\d+(\.\d+)?/)[0]);

const colors = [
  "#FF6384",
  "#36A2EB",
  "#FFCE56",
  "#33FF99",
  "#9966FF",
  "#FF5733",
  "#4CAF50",
  "#FFC0CB",
  "#8A2BE2",
  "#00FFFF",
  "#FF4500",
  "#ADFF2F",
  "#9370DB",
  "#7FFF00",
  "#8B4513",
  "#FFD700",
];

let table;

// Get all income items for a user and budget id
const getIncomeItems = async (user_id, budget_id) => {
  try {
    const response = await fetch(`/api/revenue/${user_id}/${budget_id}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    return response;
  } catch (error) {
    console.log(error);
  }
};

// Get all expense items for a user and budget id
const getExpenseItems = async (user_id, budget_id) => {
  try {
    const response = await fetch(`/api/expense/${user_id}/${budget_id}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    return response;
  } catch (error) {
    console.log(error);
  }
};

// Get current budget plan
const getCurrentBudget = async (user_id, budget_id) => {
  try {
    const response = await fetch(`/api/budget/${user_id}/${budget_id}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    console.log(response);
    return response;
  } catch (error) {
    console.log(error);
  }
};

// Get current budget plan by budget id
const getOneBudget = async (budget_id) => {
  try {
    const response = await fetch(`/api/budget/${budget_id}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    console.log(response);
    return response;
  } catch (error) {
    console.log(error);
  }
};

// Handle all requests
const requestHandler = async (user_id, budget_id) => {
  let dataOne, dataTwo, dataThree;

  try {
    const [responseOne, responseTwo, responseThree] = await Promise.all([
      getIncomeItems(user_id, budget_id),
      getExpenseItems(user_id, budget_id),
      getCurrentBudget(user_id, budget_id),
    ]);

    dataOne = await responseOne.json();
    dataTwo = await responseTwo.json();
    dataThree = await responseThree.json();
  } catch (error) {
    console.log(error);
  }
  const data = { dataOne, dataTwo, dataThree };
  return data;
};

// Get current session
const getSession = async () => {
  try {
    const response = await fetch("/api/session/current", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    if (response.ok) {
      const data = await response.json();
      return data;
    }
  } catch (error) {
    console.log(error);
  }
};

// Calculate totals for each category
const calculateCategoryTotals = async (data) => {
  const categoryTotals = {};
  let totalAmount = 0;

  for (const item of data) {
    const { category, amount } = item;
    totalAmount += parseFloat(amount);
    categoryTotals[category] =
      (categoryTotals[category] || 0) + parseFloat(amount);
  }

  const categoryPercentages = {};
  for (const category in categoryTotals) {
    const percentage = (categoryTotals[category] / totalAmount) * 100;
    categoryPercentages[category] = percentage.toFixed(2);
  }

  return {
    totals: categoryTotals,
    percentages: categoryPercentages,
  };
};

// Renders the income chart
const renderIncomeChart = async (data) => {
  const labels = Object.keys(data.totals);
  console.log(data);
  const values = Object.values(data.totals);
  const chartData = {
    labels: labels,
    datasets: [
      {
        data: values,
        backgroundColor: colors,
        hoverBackgroundColor: colors,
      },
    ],
  };

  const chartOptions = {
    title: {
      display: true,
      text: "Income by Category",
    },
  };

  const incomeChartVar = new Chart(incomeChart, {
    type: "pie",
    data: chartData,
    options: chartOptions,
  });
};

// Renders the expense chart
const renderExpenseChart = async (data) => {
  const labels = Object.keys(data.totals);
  console.log(data.totals);
  const values = Object.values(data.totals);
  const chartData = {
    labels: labels,
    datasets: [
      {
        data: values,
        backgroundColor: colors,
        hoverBackgroundColor: colors,
      },
    ],
  };

  const chartOptions = {
    title: {
      display: true,
      text: "Income by Category",
      fontSize: 20,
    },
  };

  const expenseChartVar = new Chart(expenseChart, {
    type: "pie",
    data: chartData,
    options: chartOptions,
  });
};

// Renders the overview table
const renderOverviewTable = async (data) => {
  const dataObj = [
    ...data.dataOne.map(({ income_name, user_income_id, ...rest }) => ({
      ...rest,
      name: income_name,
      user_id: user_income_id,
      type: "Income",
    })),
    ...data.dataTwo.map(({ expense_name, user_expense_id, ...rest }) => ({
      ...rest,
      name: expense_name,
      user_id: user_expense_id,
      type: "Expense",
    })),
  ];

  table = new Tabulator(overviewTable, {
    data: dataObj,
    layout: "fitColumns",
    columns: [
      { title: "ID", field: "id", visible: false },
      { title: "Name", field: "name" },
      { title: "Amount", field: "amount" },
      { title: "Category", field: "category" },
      { title: "Type", field: "type" },
      { title: "User ID", field: "user_id", visible: false },
      { title: "Budget ID", field: "budget_id", visible: false },
      { title: "Description", field: "description" },
    ],
  });
};

// Delete all items in a budget and the budget itself when the delete button is clicked
deleteAll.addEventListener("click", async (event) => {
  event.preventDefault();
  const confirmed = confirm(
    "Are you sure you want to delete this budget? This action cannot be undone."
  );
  if (confirmed) {
    const session = await getSession();
    console.log(session.budget_id);
    const response = await fetch(`/api/budget/${session.budget_id}`, {
      method: "DELETE",
    });
    if (response.ok) {
      window.location.replace("/");
    } else {
      console.log(response);
    }
  }
});

// Render the total savings text
const renderSavingsText = async () => {
  const savingsElement = document.getElementById("savings");

  if (totalSavings >= 0) {
    savingsElement.classList.add("profit");
    savingsElement.classList.remove("loss");
    savingsElement.textContent = `Your monthly total savings are $${totalSavings}. Click here to return to your expenses and edit them.`;
  } else if (totalSavings < 0) {
    savingsElement.classList.add("loss");
    savingsElement.classList.remove("profit");
    savingsElement.textContent = `Your monthly total loss is -$${Math.abs(
      totalSavings
    )}. Click here to return to your expenses and edit them.`;
  }
};

// Initialize the page
const init = async () => {
  const session = await getSession();
  const budgetData = await requestHandler(session.user_id, session.budget_id);
  const incomeCategoryData = await calculateCategoryTotals(budgetData.dataOne);
  const expenseCategoryData = await calculateCategoryTotals(budgetData.dataTwo);
  await renderIncomeChart(incomeCategoryData);
  await renderExpenseChart(expenseCategoryData);
  await renderOverviewTable(budgetData);
  await renderSavingsText(totalSavings);
  return budgetData;
};

// Calls init when the page loads
document.addEventListener("DOMContentLoaded", async function () {
  init();
});
