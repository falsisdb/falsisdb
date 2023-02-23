const {
    JSONDatabase,
    YAMLDatabase
} = require("./src/index.js")

const db = new JSONDatabase({
    filePath: "./falsisdb/database.json"
})

db.set("hello", "world")
db.set("posts", [{ id: 1 }])