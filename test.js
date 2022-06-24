const falsis = require("./src/index.js")
const db = new falsis({
filePath: "./falsisdb/database.json",
backup: {
	path: "./falsisdb/backup.json",
	time: 5
}
})
db.set("l", "m")
db.set("n", "o")
db.set("p", "r")
db.set("s", "t")
db.set("u", "v")