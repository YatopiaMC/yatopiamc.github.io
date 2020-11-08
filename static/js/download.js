let table = document.getElementById("table");

// we'll show it later
document.getElementById('stable').style.display = 'none'

var request = new XMLHttpRequest();
request.open("GET", "https://api.yatopia.net/v2/builds?branch=" + BRANCH, true);
request.onload = () => {
    let jsonResponse =  JSON.parse(request.responseText);
    if (jsonResponse['error'] != null) {
        document.getElementById('error').style.display = 'block'
        document.getElementById('buildsAre').style.display = 'none'
        return;
    }
    let builds = jsonResponse['builds'];
    document.getElementById('buildsAre').innerText = "These builds are for Minecraft " + VERSION + ".";

    for (var i = 0; i < builds.length; i++) {
        let build = builds[i];
        if (build['status'] === "FAILURE" || build['status'] === "BUILDING") {
            continue;
        }
        if (build['number'] === STABLE_BUILD) {
            document.getElementById('stable').outerHTML = `<a id="stable" class="download-button" href="${build['downloadUrl']}">Latest stable build: #${build['number']}<span class="material-icons">get_app</span></a>`
        }
        var commitMessage = "";
        var dateMessage = "";
        let changeSets = build['changeSets'];
        for (var i1 = 0; i1 < changeSets.length; i1++) {
            let changeSet = changeSets[i1];
            commitMessage += changeSet['message'] + ` [<a href="https://github.com/YatopiaMC/Yatopia/commit/${changeSet['sha']}">commit</a>]<br>`;
            dateMessage += changeSet['authoredAt'].split(" ")[0] + "<br>";
        }
        if ((i + 1 < builds.length) && builds[i + 1]['status'] === "FAILURE") {
            let messages = getFailureBuildsUntilSuccessfulFromLatest(builds, i + 1).split("\00");
            commitMessage += messages[0];
            dateMessage += messages[1];
        }

        let row = table.insertRow(-1);
        row.insertCell(0).innerHTML = `<a class="download-button" href="${build['downloadUrl']}">#${build['number']} <span class="material-icons">get_app</span></a>`;
        if (commitMessage.length === 0) {
            row.insertCell(1).innerHTML = `<i>No changes from previous build</i>`
        } else {
            row.insertCell(1).innerHTML = commitMessage;
        }
        if (dateMessage.length === 0) {
            row.insertCell(2).innerHTML = `<i>unknown</i>`
        } else {
            row.insertCell(2).innerHTML = dateMessage;
        }
    }
}
request.send(null)

function getFailureBuildsUntilSuccessfulFromLatest(builds, from) {
    var commitMessage = "";
    var dateMessage = "";
    for (var i = from; i < builds.length; i++) {
        let build = builds[i];
        let changeSets = build['changeSets'];
        if (build['status'] === "FAILURE") {
            for (var i1 = 0; i1 < changeSets.length; i1++) {
                let changeSet = changeSets[i1];
                commitMessage += changeSet['message'] + ` [<a href="https://github.com/YatopiaMC/Yatopia/commit/${changeSet['sha']}">commit</a>]<br>`;
                dateMessage += changeSet['authoredAt'].split(" ")[0] + "<br>";
            }
        }
        if (build['status'] === "SUCCESS" && i !== from) {
            break;
        }
    }
    return commitMessage + "\00" + dateMessage;
}
