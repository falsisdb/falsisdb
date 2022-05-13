const falsis = require("./src/index.js")
const db = new falsis()
db.set("veri_adı", "veri_değeri") //undefined
db.get("veri_adı") //veri_değeri
if(db.has("veri_adı") === true) {
console.log("Değişken veri tabanı dosyasında bulunuyor.")
}else if(db.has("veri_adı") === false) {
console.log("Değişken veri tabanı dosyasında bulunmuyor.")
}
db.delete("veri_adı") //undefined
if(db.has("veri_adı") === true) {
console.log("Değişken veri tabanı dosyasında bulunuyor.")
}else if(db.has("veri_adı") === false) {
console.log("Değişken veri tabanı dosyasında bulunmuyor.")
}
//buraya kadar çalışıyor aşağısı hatalı
//EVENTLER HATALI (EVENT EMITTER ILE ILGILI)
db.on({
	type: "ready",
	status:"aktif",
	code:`console.log("Ready eventi çalışıyor")`
})
