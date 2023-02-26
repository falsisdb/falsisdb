const {
    JSONDatabase,
    YAMLDatabase
} = require("./src/index.js")

const db = new YAMLDatabase({
    filePath: "./falsisdb/database.yaml"
})

console.log(db.set("test1", "testt"))