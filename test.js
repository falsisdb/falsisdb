const falsis = require("./src/index.js")
const db = new falsis('./database.json')
db.set("sa", 12);
db.conc("sa", 2)
let sj = db.get("sa")
console.log(sj)
