const submitBudgetEl = document.querySelector("#submit-budget");

const submitBudget = async (event) => {
  event.preventDefault();
  const sessionResponse = await fetch("/api/session/current");
  if (sessionResponse.ok) {
    const sessionR = await sessionResponse.json();
    console.log(sessionR);
    const response = await fetch(`/api/budget/${sessionR.budget_id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
    });
    if (response.ok) {
      document.location.replace("/budget");
    }
    console.log(response);
  }
};

submitBudgetEl.addEventListener("click", submitBudget);
