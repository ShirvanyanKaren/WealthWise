import Tabulator from "tabulator-tables";

// Create a table using Tabulator library 
const createTable = async (location, path) => {
    const tableData = await getTableData(path);
    if (!tableData) {
        return;
    }
    new Tabulator(location, {
        data: tableData,
        layout: "fitColumns",
        responsiveLayout: "hide",
        pagination: "local",
        paginationSize: 10,
        paginationCounter: "records",
        columns: [
            { title: "ID", field: "id" },
            { title: "Income Name", field: "income_name" },
            { title: "User Income ID", field: "user_income_id" },
            {
                title: "Amount",
                field: "amount",
                formatter: "money",
                formatterParams: { precision: 2, symbol: "$" },
            },
            { title: "Description", field: "description" },
            { title: "Category", field: "category" },
            {
                title: "Date",
                field: "date",
                formatter: "datetime",
                formatterParams: { outputFormat: "YYYY-MM-DD" },
            },
        ],
    });
};

// Fetch data from the server
const getTableData = async (path) => {
    try {
        const response = await fetch(path, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });

        if (response.ok) {
            return response.json();
        } else {
            throw new Error(`Error fetching data. Status: ${response.status}`);
        }
    } catch (err) {
        console.error("Error:", err);
    }
};

export { createTable };
