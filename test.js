const falsis = require("./src/index.js")
const db = new falsis({
filePath: "./falsisdb/database.json",
backup: {
	path: "./falsisdb/backup.json",
	time: 5
}
})
db.set("a", "b")
db.set("c", "d")
db.set("e", "f")
db.set("g", "h")
db.set("j", "k")