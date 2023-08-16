const incomeTableEL = document.querySelector("#income-table");
const incomeResult = document.querySelector(".income-result");

let incomeTable;

const incomeFormHandler = async (event) => {
  event.preventDefault();
  const income_name = document.querySelector("#income-name").value;
  const amount = document.querySelector("#income-amount").value;
  const category = document.querySelector("#income-category").value;
  const description = document.querySelector("#income-desc").value;

  if (isNaN(amount)) {
    incomeResult.textContent = "Please enter a valid amount.";
    incomeResult.style.color = "red";
    return;
  }

  if (!income_name) {
    incomeResult.textContent = "Please enter a valid income name.";
    incomeResult.style.color = "red";
    return;
  }

  if (income_name && amount && category) {
    const response = await fetch("/api/revenue", {
      method: "POST",
      body: JSON.stringify({
        income_name,
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
      incomeResult.textContent = `Added "${parsedResponse.income_name}" to Income.`;
      incomeResult.style.color = "green";
      incomeTable.addRow([
        {
          id: parsedResponse.id,
          income_name: parsedResponse.income_name,
          amount: parsedResponse.amount,
          description: parsedResponse.description,
        },
      ]);
    } else {
      incomeResult.textContent = response.statusText;
      incomeResult.style.color = "red";
    }
  }
};

const createIncomeTable = async () => {
  const data = await getTableData("/api/revenue");
  incomeTable = new Tabulator(incomeTableEL, {
    data: data,
    responsiveLayout: true,
    responsiveLayout: "hide",
    resizableColumns: false,
    layout: "fitDataFill",
    height: "100%",
    pagination: "local",
    paginationSize: 5,
    width: "30vh",
    columns: [
      { title: "ID", field: "id", visible: false },
      { title: "Income Name", field: "income_name" },
      {
        title: "Amount",
        field: "amount",
        formatter: "money",
        formatterParams: { precision: 2, symbol: "$" },
      },
      {
        formatter: "buttonCross",
        width: 30,
        hozAlign: "center",
        vertAlign: "center",
        resizable: false,
        cellClick: function (e, cell) {
          e.preventDefault();
          let id = cell.getRow().getData().id;
          cell.getRow().delete();
          deleteIncomeFromDb(id);
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
resizable: false;
const deleteIncomeFromDb = async (id) => {
  const response = await fetch(`/api/revenue/${id}`, {
    method: "DELETE",
  });

  if (response.ok) {
    incomeResult.textContent = "Deleted Income Item.";
    incomeResult.style.color = "green";
  } else {
    console.log(response);
    incomeResult.textContent = response.statusText;
    incomeResult.style.color = "red";
  }
};

document.querySelector(".income").addEventListener("submit", incomeFormHandler);

document.addEventListener("DOMContentLoaded", async () => {
  await createIncomeTable();
});
