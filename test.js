const falsis = require("./src/index.js")
const db = new falsis({
filePath: "./falsisdb/database.yaml",
fileType: "yaml"
})
db.set("test", "testt")
console.log(db.has("test", true))