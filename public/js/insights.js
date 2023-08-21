const budgetGraph = document.querySelector("#budget-graph");

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

const getBudgetByMonth = async () => {
  try {
    const response = await fetch(`/api/insights`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      throw new Error('Failed to fetch data');
    }
  } catch (error) {
    console.error(error);
  }
};

const renderMonthGraph = async (data) => {
  try {
    const labels = data.monthSavingsPerc.map(item => item.month);
    const values = data.monthSavingsPerc.map(item => parseFloat(item.savings_percent));


    const budgetData = {
        labels: labels,
        datasets: [
          {
            data: values,
            backgroundColor: colors,
            hoverBackgroundColor: colors,
            pointBorderWidth: 1,
            pointRadius: 10,
            pointHoverRadius: 15,
          },
        ],
      };

    const lineOptions = {
      title: {
        display: true,
        text: "Budget Savings by Month",
        fontSize: 20,
      },
      plugins: {
        legend: {
            display: false,
        }
      },
    };

    const budgetChartVar = new Chart(budgetGraph, {
      type: "line", 
      data: budgetData,
      options: lineOptions,
    });
  } catch (error) {
    console.error(error);
  }
};
const renderSavingsText = async () => {
    // const savingsElement = document.getElementById("savings");
  
    if (totalSavings >= 0) {
      savingsElement.classList.add("profit");
      savingsElement.classList.remove("loss");
      savingsElement.textContent = `Your monthly total savings are $${totalSavings}.`;
    } else if (totalSavings < 0) {
      savingsElement.classList.add("loss");
      savingsElement.classList.remove("profit");
      savingsElement.textContent = `Your monthly total loss is -$${Math.abs(
        totalSavings
      )}. Click here to return to your expenses and edit them.`;
    }
  };

const init = async () => {
  const data = await getBudgetByMonth();
  await renderMonthGraph(data);
};

document.addEventListener("DOMContentLoaded", async function () {
  await init();
});
