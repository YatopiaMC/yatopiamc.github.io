let stats = document.getElementById("stats");
var request = new XMLHttpRequest();
request.open("GET", "https://bstats.org/api/v1/plugins/8840/charts/servers/data?maxElements=1", true);
request.onload = () => {
    stats.innerText = `⚡ Powering ${JSON.parse(request.responseText)[0][1]} servers.`
}
request.send(null)