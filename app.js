const Twitter = require('twit');
const config = require('./config.json');

const main = new Twitter({
    consumer_key: config.main.consumer_key,
    consumer_secret: config.main.consumer_secret,
    access_token: config.main.access_token,
    access_token_secret: config.main.access_token_secret
});

const proverbe = new Twitter({
    consumer_key: config.proverbe.consumer_key,
    consumer_secret: config.proverbe.consumer_secret,
    access_token: config.proverbe.access_token,
    access_token_secret: config.proverbe.access_token_secret
});

const twitelo = new Twitter({
    consumer_key: config.twitelo.consumer_key,
    consumer_secret: config.twitelo.consumer_secret,
    access_token: config.twitelo.access_token,
    access_token_secret: config.twitelo.access_token_secret
});

let favstream = main.stream('statuses/filter', {
    track: ['velkoz', 'ori', 'syndra', 'rakan', 'sense8']
});

let favstreamTwitelo = twitelo.stream('statuses/filter', {
    track: ['league of legends', 'mmr', 'twitelo', 'lyon esport', 'high elo',
        'Aatrox', 'Ahri', 'Akali', 'Alistar', 'Amumu', 'Anivia', 'Annie', 'Ashe', 'Aurelion', 'Azir',
        'Bard', 'Blitz', 'Brand', 'Braum', 'Caitlyn', 'Camille', 'Cassiopeia', 'Chogath', 'Corki', 'Darius',
        'Diana', 'Dr. Mundo', 'Draven', 'Ekko', 'Elise', 'Evelynn', 'Ezreal', 'Fiddle', 'Fiora', 'Fizz', 'Galio',
        'Gangplank', 'Garen', 'Gnar', 'Gragas', 'Graves', 'Hecarim', 'Heimerdinger', 'Illaoi', 'Irelia', 'Ivern',
        'Janna', 'Jarvan', 'Jax', 'Jayce', 'Jhin', 'Jinx', 'Kalista', 'Karma', 'Karthus', 'Kassadin', 'Katarina',
        'Kayle', 'Kennen', 'KhaZix', 'Kindred', 'Kled', 'KogMaw', 'LeBlanc', 'Lee Sin', 'Leona', 'Lissandra', 'Lucian',
        'Lulu', 'Lux', 'Malphite', 'Malzahar', 'Maokai', 'MYi', 'Miss Fortune', 'Mordekaiser', 'Morgana', 'Nami',
        'Nasus', 'Nautilus', 'Nidalee', 'Nocturne', 'Nunu', 'Olaf', 'Orianna', 'Pantheon', 'Poppy', 'Quinn', 'Rammus',
        'RekSai', 'Renekton', 'Rengar', 'Riven', 'Rumble', 'Ryze', 'Sejuani', 'Shaco', 'Shen', 'Shyvana', 'Singed',
        'Sion', 'Sivir', 'Skarner', 'Sona', 'Soraka', 'Swain', 'Syndra', 'Tahm', 'Taliyah', 'Talon', 'Taric', 'Teemo',
        'Thresh', 'Tristana', 'Trundle', 'Tryndamere', 'Twisted Fate', 'Twitch', 'Udyr', 'Urgot', 'Varus', 'Vayne', 
        'Veigar', 'VelKoz', 'Viktor', 'Vladimir', 'Volibear', 'Warwick', 'Wukong', 'Xerath', 'Xin Zhao', 'Yasuo', 
        'Yorick', 'Zed', 'Ziggs', 'Zilean', 'Zyra'
    ]
});

let rtstream = proverbe.stream('statuses/filter', {
    track: ['#proverbe', '#citation']
});

// FAVLIMIT/30 secondes
const FAVLIMIT = 1;
// FAVLIMIT/5 minutes
const FAVLIMITTWITELO = 1;
// RTLIMIT/2 minutes
const RTLIMIT = 1;

const LANG = 'fr';

let favlimit = 0;
let favlimitTwitelo = 0;
let rtlimit = 0;


// Streams on tweet
favstream.on('tweet', function (tweet) {
    if (tweet.user.lang == LANG && !tweet.retweeted_status) fav(main, tweet);
});

favstreamTwitelo.on('tweet', function (tweet) {
    if (tweet.user.lang == LANG && !tweet.user.name.toLowerCase().includes('mmr') &&
        !tweet.user.screen_name.toLowerCase().includes('mmr') &&
        !tweet.retweeted_status && !tweet.source.toLowerCase().includes('google')) favTwitelo(twitelo, tweet);
});

rtstream.on('tweet', function (tweet) {
    if (tweet.user.lang == LANG && !tweet.retweeted_status) retweet(proverbe, tweet);
});

/* Actions fonctions */

let retweet = (account, tweet) => {
    if (rtlimit < RTLIMIT) {
        rtlimit++;
        account.post('statuses/retweet/:id', {
            id: tweet.id_str
        });
    }
};

let fav = (account, tweet) => {
    if (favlimit < FAVLIMIT) {
        favlimit++;
        setTimeout(() => {
            account.post('favorites/create', {
                id: tweet.id_str
            });
        }, 40000);
    }
};

let favTwitelo = (account, tweet) => {
    if (favlimitTwitelo < FAVLIMITTWITELO) {
        favlimitTwitelo++;
        setTimeout(() => {
            account.post('favorites/create', {
                id: tweet.id_str
            });
        }, 20000);
    }
};

/* Loop reset limits */

setInterval(() => {
    console.log(`(iFonny_) Nombre de tweets fav durant les 30 dernieres secondes : ${favlimit}`)
    favlimit = 0;
}, 30000);

setInterval(() => {
    console.log(`(TwiteloFR) Nombre de tweets fav durant les 5 dernieres minutes : ${favlimitTwitelo}`)
    favlimitTwitelo = 0;
}, 300000);

setInterval(() => {
    console.log(`(Mrproverbe) Nombre de tweets rt durant les 2 dernieres minutes : ${rtlimit}`)
    rtlimit = 0;
}, 120000);