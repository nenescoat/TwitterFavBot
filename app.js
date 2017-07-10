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

let favstream = main.stream('statuses/filter', {
    track: ['velkoz', 'gland', 'ori', 'syndra', 'rakan', 'sense8']
});

let rtstream = proverbe.stream('statuses/filter', {
    track: ['#proverbe', '#citation']
});

// FAVLIMIT/10 secondes
const FAVLIMIT = 5;
// RTLIMIT/1 minutes
const RTLIMIT = 1;

const LANG = 'fr';

let favlimit = 0;
let rtlimit = 0;


// Streams on tweet
favstream.on('tweet', function (tweet) {
    if (tweet.user.lang == LANG && !tweet.retweeted_status) fav(main, tweet);
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

/* Loop reset limits */

setInterval(() => {
    console.log(`Nombre de tweets fav durant les 10 dernieres secondes : ${favlimit}`)
    favlimit = 0;
}, 10000);

setInterval(() => {
    console.log(`Nombre de tweets rt durant la derniere minute : ${rtlimit}`)
    rtlimit = 0;
}, 60000);
