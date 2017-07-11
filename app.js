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
    track: ['velkoz', 'gland', 'ori', 'syndra', 'rakan', 'sense8']
});

let favstreamTwitelo = twitelo.stream('statuses/filter', {
    track: ['league of legends', 'mmr', 'ranked', 'twitelo', 'yasuo', 'riven', 'lyon esport', 'cassiopeai', 'draven', 'anivia', 'taliyah', 'high elo']
});

let rtstream = proverbe.stream('statuses/filter', {
    track: ['#proverbe', '#citation']
});

// FAVLIMIT/10 secondes
const FAVLIMIT = 5;
const FAVLIMITTWITELO = 5;
// RTLIMIT/1 minutes
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
    if (tweet.user.lang == LANG && !tweet.user.name.toLowerCase().includes('mmr')
        && !tweet.user.screen_name.toLowerCase().includes('mmr')
        && !tweet.retweeted_status) favTwitelo(twitelo, tweet);
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
        }, 10000);
    }
};

/* Loop reset limits */

setInterval(() => {
    console.log(`(iFonny_) Nombre de tweets fav durant les 10 dernieres secondes : ${favlimit}`)
    favlimit = 0;
}, 10000);

setInterval(() => {
    console.log(`(TwiteloFR) Nombre de tweets fav durant les 10 dernieres secondes : ${favlimitTwitelo}`)
    favlimitTwitelo = 0;
}, 10000);

setInterval(() => {
    console.log(`(Mrproverbe) Nombre de tweets rt durant la derniere minute : ${rtlimit}`)
    rtlimit = 0;
}, 60000);
