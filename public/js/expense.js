// Query Selectors
const expenseTableEL = document.querySelector("#expense-table");
const expenseResult = document.querySelector(".expense-result");
const expenseForm = document.querySelector(".expense");

// Tabulator variable
let expenseTable;

// Create new expense item
const expenseFormHandler = async (event) => {
  event.preventDefault();
  const expense_name = document.querySelector("#expense-name").value;
  const amount = document.querySelector("#expense-amount").value;
  const category = document.querySelector("#expense-category").value;
  const description = document.querySelector("#expense-desc").value;

  if (isNaN(amount)) {
    expenseResult.textContent = "Please enter a valid amount.";
    expenseResult.style.color = "red";
    return;
  }

  if (!expense_name) {
    expenseResult.textContent = "Please enter a valid expense name.";
    expenseResult.style.color = "red";
    return;
  }

  if (expense_name && amount && category) {
    const response = await fetch("/api/expense", {
      method: "POST",
      body: JSON.stringify({
        expense_name,
        description,
        amount,
        category,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.ok) {
      const parsedResponse = await response.json();
      expenseResult.textContent = `Added "${parsedResponse.expense_name}" to Expenses.`;
      expenseResult.style.color = "green";
      expenseTable.addRow([
        {
          id: parsedResponse.id,
          expense_name: parsedResponse.expense_name,
          amount: parsedResponse.amount,
          description: parsedResponse.description,
        },
      ]);
    } else {
      expenseResult.textContent = response.statusText;
      expenseResult.style.color = "red";
    }
  }
};

// Creates and populates the expense table
const createExpenseTable = async () => {
  const data = await getTableData("/api/expense");
  expenseTable = new Tabulator(expenseTableEL, {
    data: data,
    responsiveLayout: true,
    responsiveLayout: "hide",
    resizableColumns: false,
    layout: "fitDataFill",
    height: "100%",
    pagination: "local",
    paginationSize: 5,
    width: "auto",
    columns: [
      { title: "ID", field: "id", visible: false },
      {
        title: "Expense Name",
        field: "expense_name",
        frozen: true,
        resizable: false,
      },
      {
        title: "Amount",
        field: "amount",
        formatter: "money",
        formatterParams: { precision: 2, symbol: "$" },
        resizable: false,
      },
      {
        formatter: "buttonCross",
        width: 40,
        hozAlign: "center",
        vertAlign: "center",
        resizable: false,
        cellClick: function (e, cell) {
          e.preventDefault();
          let id = cell.getRow().getData().id;
          cell.getRow().delete();
          deleteExpenseFromDb(id);
        },
        cellTap: function (e, cell) {
          e.preventDefault();
          let id = cell.getRow().getData().id;
          cell.getRow().delete();
          deleteIncomeFromDb(id);
        },
      },
    ],
  });
};

// Handles the deletion of an expense item
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

// Event Listeners
expenseForm.addEventListener("submit", expenseFormHandler);
document.addEventListener("DOMContentLoaded", async () => {
  await createExpenseTable();
});
