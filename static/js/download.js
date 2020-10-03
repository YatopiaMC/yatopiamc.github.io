let table = document.getElementById("table");

const STABLE_BUILD = 90;
// we'll show it later
document.getElementById('stable').style.display = 'none'

var request = new XMLHttpRequest();
request.open("GET", "https://api.yatopia.net/v2/builds", true);
request.onload = () => {
    console.log(JSON.parse(request.responseText))
    let jsonResponse =  JSON.parse(request.responseText);
    if (jsonResponse['error'] != null) {
        document.getElementById('error').style.display = 'block'
        return;
    }
    let builds = JSON.parse(request.responseText)['builds'];
    var version = builds[0]['branch']['name'].replace('ver/', '');
    document.getElementById('buildsAre').innerText = "These builds are for Minecraft " + version + ".";

    for (var i = 0; i < builds.length; i++) {
        let build = builds[i];
        if (build['number'] === STABLE_BUILD) {
            document.getElementById('stable').outerHTML = `<a id="stable" class="download-button" href="${build['downloadUrl']}">Latest stable build: #${build['number']}<span class="material-icons">get_app</span></a>`
        }

        let row = table.insertRow(-1);
        row.insertCell(0).innerHTML = `<a class="download-button" href="${build['downloadUrl']}">#${build['number']} <span class="material-icons">get_app</span></a>`;
        row.insertCell(1).innerHTML = `${build['branch']['commit']['message']} [<a href="https://github.com/YatopiaMC/Yatopia/commit/${build['branch']['commit']['sha']}">commit</a>]`;
        row.insertCell(2).innerHTML = `${build['branch']['commit']['authoredAt'].split(" ")[0]}`;
    }
}
request.send(null)