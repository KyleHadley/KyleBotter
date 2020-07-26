const SQLite = require("better-sqlite3");
const sql = new SQLite("./scores.sqlite");

//const { client } = require("./index");
function getScore(userId, guildId) {
    let score = sql.prepare("SELECT * FROM scores WHERE user = ? AND guild = ?");
    return score.get(userId, guildId);
}

function setScore(newScore) {
    let score = sql.prepare("INSERT OR REPLACE INTO scores (id, user, guild, points, level) VALUES (@id, @user, @guild, @points, @level);");
    return score.run(newScore);
}

module.exports = { getScore, setScore };