// Query Selectors
const newBudgetForm = document.querySelector("#new-budget-form");
const errorElement = document.querySelector("#error-message");
const dropdown = document.querySelector("#budget-dropdown");

// Event Handlers for New Budget Form
const newBudgetHandler = async (event) => {
  event.preventDefault();
  try {
    const newBudgetName = document.querySelector("#budget-name").value.trim();
    const budgetMonth = document.querySelector("#month-dropdown").value;
    console.log(budgetMonth);
    console.log(newBudgetName);
    if (newBudgetName) {
      const response = await fetch("/api/budget", {
        method: "POST",
        body: JSON.stringify({ newBudgetName, budgetMonth }),
        headers: { "Content-Type": "application/json" },
      });
      console.log(response);
      if (response.ok) {
        console.log(response);
        document.location.replace("/items");
      } else {
        let errorMessage = "";
        switch (response.status) {
          case 401:
            errorMessage = "Budget already exists!";
            break;
          case 402:
            errorMessage = "Please select a month.";
            break;
          case 500:
            errorMessage = "Server error.";
            break;
          default:
            errorMessage = "Unknown error.";
            break;
        }
        errorElement.textContent = errorMessage;
      }
    }
  } catch (err) {
    console.log(err);
  }
};

// Event Listeners for New Budget Form Drop down
dropdown.addEventListener("change", (event) => {
  console.log(event.target.value);
  const budgetId = event.target.value;
  if (budgetId) {
    document.location.replace(`/items/${budgetId}`);
  }
});

// Event Listeners for New Budget Form
newBudgetForm.addEventListener("submit", newBudgetHandler);
