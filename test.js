const falsis = require("./src/index.js")
const db = new falsis()
db.on({
	"status": "aktif",
	"type": "ready",
	"code": `console.log("FalsisDB: Database başlatıldı")`
})
db.on({
	"type": "dataSet",
	"status": "aktif",
	"code": `console.log("FalsisDB: Database'e değeri %value% olan %key% isimli veri kaydedildi.")`
})
db.set("Variable name", "Variable value")