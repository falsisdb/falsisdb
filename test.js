const falsis = require("./src/index.js")
const db = new falsis()
db.on({
	type: "ready",
	status:"aktif",
	code:`console.log("Ready eventi çalışıyor")`
})
db.on({
	type:"dataSet",
	status:"aktif",
	code:`console.log("Veri tabanına %value% değeri olan %key% verisi eklendi")`
})
db.on({
	type:"dataDelete",
	status:"aktif",
	code:`console.log("Veri tabanından %value% değeri olan %key% verisi silindi.")`
})
db.set("veri_adı", "veri_değeri")
db.delete("veri_adı")
