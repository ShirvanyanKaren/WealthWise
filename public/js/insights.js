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
      const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
      ];
  
      const monthsData = data.monthSavingsPerc;
  
      const sortedMonthsData = monthsData.sort((a, b) => {
        return months.indexOf(a.month) - months.indexOf(b.month);
      });
  
      const labels = sortedMonthsData.map(item => item.month);
      const values = sortedMonthsData.map(item => parseFloat(item.savings_percent));
  
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
  
const renderSavingsText = async (data) => {
    const savingsElement = document.getElementById("avg-savings");
    const monthlySavings = parseFloat(data.averageMonthlySavings).toFixed(0);
    // console.log(monthlySavings);
    if (monthlySavings >= 0) {
      savingsElement.classList.add("profit");
      savingsElement.classList.remove("loss");
      savingsElement.textContent = `Your monthly average savings are $${monthlySavings}.`;
    } else if (monthlySavings < 0) {
      savingsElement.classList.add("loss");
      savingsElement.classList.remove("profit");
      savingsElement.textContent = `Your monthly average savings are -$${Math.abs(
        monthlySavings
      )}`;
    }
  };

  const renderTotalSavings = async (data) => {
    const totalSavingsElement = document.getElementById("total-savings");
    const totalSavings = data.totalMonthlySavings;
    if (totalSavings >= 0) {
        totalSavingsElement.classList.add("profit");
        totalSavingsElement.classList.remove("loss");
      totalSavingsElement.textContent = `Your total savings are $${totalSavings}.`;
    } else if (totalSavings < 0) {
        totalSavingsElement.classList.add("loss");
        totalSavingsElement.classList.remove("profit");
      totalSavingsElement.textContent = `Your total loss is -$${Math.abs(
        totalSavings
      )}`;
    }
  };

const init = async () => {
  const data = await getBudgetByMonth();
  await renderMonthGraph(data);
  await renderSavingsText(data);
  await renderTotalSavings(data);
};

document.addEventListener("DOMContentLoaded", async function () {
  await init();
});
