const falsis = require("./src/index.js")
const db = new falsis('./database.json')
db.on({
	type: "ready",
	status:"aktif",
	code:`console.log("Ready eventi çalışıyor")`
})
db.on({
	type:"dataSet",
	status:"aktif",
	code:`console.log("Veri tabanına yeni veri eklendi")`
})
db.on({
	type:"dataDelete",
	status:"aktif",
	code:`console.log("Veri tabanından veri silindi")`
})
db.set("veri_adı", "veri_değeri")
db.delete("veri_adı")
console.log(db.info)
//Bunu yazan tosun (falsis eheheu) okuyanın aaa--
