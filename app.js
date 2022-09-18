const client_id = "";
const client_secret = "";
const broadcaster_id = "";
let rToken = "";

const subGoal = 5;
const tempsDeRefresh = 60; // temps de refresh (en secondes)


async function getToken(client_id, client_secret, code) {
    let res = await fetch(`https://id.twitch.tv/oauth2/token?client_id=${client_id}&client_secret=${client_secret}&code=${code}&grant_type=authorization_code&redirect_uri=http://localhost`, {
        headers: new Headers({
            'Content-Type': 'application/x-www-form-urlencoded'
        }),
        method: "POST"
    });
    res = await res.json();
    return res;
}



async function refreshToken(client_id, client_secret, rToken) {
    let res = await fetch(`https://id.twitch.tv/oauth2/token?grant_type=refresh_token&refresh_token=${rToken}&client_id=${client_id}&client_secret=${client_secret}`, {
        headers: new Headers({
            'Content-Type': 'application/x-www-form-urlencoded'
        }),
        method: "POST"
    });
    res = await res.json();
    return res;
}

async function getSubCount(client_id, token, broadcaster_id) {
    let res = await fetch(`https://api.twitch.tv/helix/subscriptions?broadcaster_id=${broadcaster_id}`, {
        headers: new Headers({
            "Authorization": `Bearer ${token}`,
            "Client-Id": client_id
        })
    });
    res = await res.json();
    return res["total"];
}

(async () => {
    main()
})()


async function main() {
    console.log('connexion à l\'API de Twitch ...');
    const req = await refreshToken(client_id, client_secret, rToken);
    const token = req["access_token"];
    rToken = req["refresh_token"];
    console.log(`RToken : ${rToken}`);
    const subCount = await getSubCount(client_id, token, broadcaster_id);
    document.getElementById('sub').innerText = `${subCount}/${subGoal}`;
    document.getElementById('pourcentage').style.width = `${(subCount/subGoal)*100}%`;
    setTimeout(main, 60*1000);
}