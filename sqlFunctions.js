const SQLite = require("better-sqlite3");
const scoresDb = new SQLite("./scores.sqlite");
const ticketsDb = new SQLite("./lottoTickets.sqlite");

//const { client } = require("./index");
function getScore(userId, guildId) {
    const score = scoresDb.prepare("SELECT * FROM scores WHERE user = ? AND guild = ?");
    return score.get(userId, guildId);
}

function setScore(newScore) {
    const score = scoresDb.prepare("INSERT OR REPLACE INTO scores (id, user, guild, points, level) VALUES (@id, @user, @guild, @points, @level);");
    return score.run(newScore);
}

// Returns an array of users in the lottery db
function getLottoEntrants(guildId) {
    const statement = ticketsDb.prepare("SELECT * FROM lottoTickets WHERE tickets > 0 AND guild = ?;");
    const lottoUsers = statement.all(guildId);
    console.log(`Retrieving ${lottoUsers.length} users from the lottery database.`);
    return lottoUsers;
}

function countLottoEntrants(guildId) {
    const lottoUsers = ticketsDb.prepare("COUNT DISTINCT user FROM lottoTickets WHERE tickets > 0 AND guild = ?;");
    return lottoUsers.get(guildId);
}

ticketsDb.aggregate('addAll', {
    start: 0,
    step: (total, nextValue) => total + nextValue,
  });

function totalLottoTickets(guildId) {
    //const stmt = ticketsDb.prepare("SELECT SUM(tickets) FROM lottoTickets WHERE tickets > 0 and guild = ?;");
    const stmt = ticketsDb.prepare("SELECT addALL(tickets) FROM lottoTickets WHERE tickets > 0 and guild = ?;");
    return stmt.pluck().get(guildId);
}

function getTickets(userId, guildId) {
    const tickets = ticketsDb.prepare("SELECT * FROM lottoTickets WHERE user = ? AND guild = ?;");
    return tickets.get(userId, guildId);
}

function setTickets(newTickets) {
    const tickets = ticketsDb.prepare("INSERT OR REPLACE INTO lottoTickets (id, user, guild, tickets) VALUES (@id, @user, @guild, @tickets);");
    return tickets.run(newTickets);
}

function clearCurrentLottery(guildId) {
    console.log(`Removed ${getLottoEntrants.length} users from the lottery database. Database is now cleared.`)
    const lotto = ticketsDb.prepare("DELETE FROM lottoTickets WHERE guild = ?;")
    return lotto.run(guildId)
}

module.exports = { getScore, setScore, getTickets, setTickets, getLottoEntrants, countLottoEntrants, clearCurrentLottery, totalLottoTickets };