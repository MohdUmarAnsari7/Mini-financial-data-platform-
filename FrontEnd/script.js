let chart;
let currentSymbol = null;

async function loadCompanies() {
    const res = await fetch("http://127.0.0.1:8000/companies");
    const data = await res.json();

    const list = document.getElementById("companyList");
    const s1 = document.getElementById("stock1");
    const s2 = document.getElementById("stock2");

    data.companies.forEach(company => {
        const li = document.createElement("li");
        li.innerText = company;

        li.onclick = () => {
            document.querySelectorAll(".sidebar li").forEach(li => li.classList.remove("active"));
            li.classList.add("active");
            currentSymbol = company;
            loadStockData(company);
        };

        list.appendChild(li);
        const opt1 = document.createElement("option");
        opt1.value = company;
        opt1.innerText = company;

        const opt2 = opt1.cloneNode(true);

        s1.appendChild(opt1);
        s2.appendChild(opt2);
    });
}

async function loadStockData(symbol) {
    console.log("Function called with:", symbol);
    const days = document.getElementById("daysFilter").value;
    const res = await fetch(`http://127.0.0.1:8000/stock_data/${symbol}?days=${days}`);
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

function onFilterChange() {
    if (currentSymbol) {
        loadStockData(currentSymbol);
    }
}

async function compareStocks() {
    const stock1 = document.getElementById("stock1").value;
    const stock2 = document.getElementById("stock2").value;

    const res1 = await fetch(`http://127.0.0.1:8000/stock_data/${stock1}`);
    const res2 = await fetch(`http://127.0.0.1:8000/stock_data/${stock2}`);

    const data1 = await res1.json();
    const data2 = await res2.json();

    if (data1.error || data2.error) {
        alert("Error fetching data");
        return;
    }

    const d1 = data1.data;
    const d2 = data2.data;

    const labels = d1.map(d => new Date(d.Date).toLocaleDateString());

    const prices1 = d1.map(d => d.Close);
    const prices2 = d2.map(d => d.Close);

    drawCompareChart(labels, prices1, prices2, stock1, stock2);
}

function drawCompareChart(labels, data1, data2, s1, s2) {
    const ctx = document.getElementById("stockChart").getContext("2d");

    if (chart) chart.destroy();

    chart = new Chart(ctx, {
        type: "line",
        data: {
            labels: labels,
            datasets: [
                {
                    label: s1,
                    data: data1,
                    borderColor: "#007bff",
                    tension: 0.4
                },
                {
                    label: s2,
                    data: data2,
                    borderColor: "#ff4d4d",
                    tension: 0.4
                }
            ]
        }
    });
}

async function loadInsights() {
    const res = await fetch("http://127.0.0.1:8000/top-movers");
    const data = await res.json();

    if (data.error) return;

    document.getElementById("gainer").innerText =
        `📈 Top Gainer: ${data.top_gainer.symbol} (${(data.top_gainer.daily_return * 100).toFixed(2)}%)`;

    document.getElementById("loser").innerText =
        `📉 Top Loser: ${data.top_loser.symbol} (${(data.top_loser.daily_return * 100).toFixed(2)}%)`;
}

loadCompanies();
loadInsights();