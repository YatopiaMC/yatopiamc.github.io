let table = document.getElementById("table");

var request = new XMLHttpRequest();
request.open("GET", "https://api.yatopia.net/v2/builds", true);
request.onload = () => {
    console.log(JSON.parse(request.responseText))
    let builds = JSON.parse(request.responseText)['builds'];

    for (var i = 0; i < builds.length; i++) {
        let build = builds[i];

        let row = table.insertRow(-1);
        row.insertCell(0).innerHTML = `<a class="download-button" href="https://ci.codemc.io/job/YatopiaMC/job/Yatopia/job/ver%2F1.16.3/${build['number']}/artifact/target/yatopia-1.16.3-paperclip-b${build['number']}.jar">#${build['number']} <span class="material-icons">get_app</span></a>`;
        row.insertCell(1).innerHTML = `${build['branch']['commit']['message']} [<a href="https://github.com/YatopiaMC/Yatopia/commit/${build['branch']['commit']['sha']}">commit</a>]`;
        row.insertCell(2).innerHTML = `${build['branch']['commit']['authoredAt'].split(" ")[0]}`;
    }
}
request.send(null)