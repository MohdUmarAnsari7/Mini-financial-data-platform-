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
    const labels = data.map(d => new Date(d.Date).toLocaleDateString());
    const prices = data.map(d => d.Close);
    const ma7 = data.map(d => d.MA_7);

    drawChart(labels, prices, ma7);
}

function drawChart(labels, prices, ma7) {
    const ctx = document.getElementById("stockChart").getContext("2d");

    if (chart) {
        chart.destroy();
    }

    chart = new Chart(ctx, {
        type: "line",
        data: {
            labels: labels,
            datasets: [
                {
                    label: "Closing Price",
                    data: prices,
                    borderColor: "#007bff",
                    backgroundColor: "rgba(0,123,255,0.1)",
                    borderWidth: 2,
                    tension: 0.3,
                    pointRadius: 1
                },
                {
                    label: "MA 7",
                    data: ma7,
                    borderColor: "#ff4d4d",
                    borderWidth: 2,
                    tension: 0.3,
                    pointRadius: 0
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: true
                },
                tooltip: {
                    mode: "index",
                    intersect: false
                }
            },
            interaction: {
                mode: "nearest",
                axis: "x",
                intersect: false
            },
            scales: {
                x: {
                    ticks: {
                        maxTicksLimit: 8
                    }
                }
            }
        }
    });
}
loadCompanies();