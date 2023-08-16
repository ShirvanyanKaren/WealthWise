const incomeChart = document.querySelector("#income-chart");
const expenseChart = document.querySelector("#expense-chart");
const incomeBar = document.querySelector("#income-bar-chart");
const expenseBar = document.querySelector("#expense-bar-chart");
const overviewTable = document.querySelector("#overview-table");
const deleteAll = document.querySelector("#delete-budget");

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

const getCurrentBudget = async (user_id, budget_id) => {
  try {
    const response = await fetch(`/api/budget/${user_id}/${budget_id}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    return response;
  } catch (error) {
    console.log(error);
  }
};

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

const calculateCategoryTotals = async (data) => {
  const categoryTotals = {};
  let totalAmount = 0;

  for (const item of data) {
    const { category, amount } = item;
    totalAmount += parseFloat(amount); // Convert amount to a number before adding
    categoryTotals[category] = (categoryTotals[category] || 0) + parseFloat(amount);
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


const renderIncomeChart = async (data) => {
  const labels = Object.keys(data.totals);
  console.log(data)
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

const renderExpenseChart = async (data) => {
  const labels = Object.keys(data.totals);
  console.log(data.totals)
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

  console.log(dataObj);

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

const deleteExpenseFromDb = async (id) => {
  const response = await fetch(`/api/expense/${id}`, {
    method: "DELETE",
  });

  if (response.ok) {
    expenseResult.textContent = "Deleted Expense Item.";
    expenseResult.style.color = "green";
  } else {
    console.log(response);
    expenseResult.textContent = response.statusText;
    expenseResult.style.color = "red";
  }
};

deleteAll.addEventListener("click", async (event) => {
  event.preventDefault();
  const confirmed = confirm("Are you sure you want to delete this budget? This action cannot be undone.");
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

const init = async () => {
  const session = await getSession();
  const budgetData = await requestHandler(session.user_id, session.budget_id);
  console.log(budgetData);
  const incomeCategoryData = await calculateCategoryTotals(budgetData.dataOne);
  const expenseCategoryData = await calculateCategoryTotals(budgetData.dataTwo);
  const budget = budgetData.dataThree;
  await renderIncomeChart(incomeCategoryData);
  await renderExpenseChart(expenseCategoryData);
  await renderOverviewTable(budgetData);
  return budgetData;
};

document.addEventListener("DOMContentLoaded", async function () {
  init();
});
