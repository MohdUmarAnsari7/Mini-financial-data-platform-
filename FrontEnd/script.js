let chart;
async function loadCompanies() {
    const res = await fetch(`http://localhost:8000/companies`);
    const data = await res.json();
    
    const list = document.getElementById('companyList');
    data.companies.forEach(company => {
        const li = document.createElement('li');
        li.innerText = company;
        li.onclick = () =>{
            console.log(`Clicked on ${company}`);
            loadStockData(company);
        }
        list.appendChild(li);
    });
}

async function loadStockData(symbol) {
    console.log("Function called with:", symbol);

    const res = await fetch(`http://127.0.0.1:8000/stock_data/${symbol}`);
    const result = await res.json();

    console.log(result);

    if (result.error) {
        alert(result.error);
        return;
    }

    const data = result.data;

    const labels = data.map(d => d.Date);
    const prices = data.map(d => d.Close);

    drawChart(labels, prices);
}

function drawChart(labels, data) {
    const ctx = document.getElementById('stockChart').getContext('2d');
    if (chart) chart.destroy();
    chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Closing Price',
                data: data,
            }]
        }
    });
}
loadCompanies();