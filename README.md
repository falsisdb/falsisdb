# Falsisdb
Falsisdb, quick.db benzeri, açık kaynak kodlu ve kullanışlı database modülü. Bir database modülünde gereken herşeyi, hatta daha fazlasını içeriyor!

## Kurulum
Modülü kurmak için öncelikle konsola aşağıdaki yazıyı yazmalısınız.
```bash
npm i falsisdb@latest
```
Bunu yazdıktan sonra modülün indirilmesiniz bekleyin.
Modül kurulunca `main (ana)` dosyanıza aşağıdaki kodu ekleyin. Kodu en başa eklerseniz dosyanız düzenli olur
```js
const falsisdb = require("falsisdb")
const db = new falsisdb("./database.json") //./[PATCH]
```
Yukarıdaki kodda database dosyası olarak `database.json`'u tanımladım. İsterseniz farklı bir dosya tanımlayabilirsiniz. Unutmayın, dosya başına `./` konmalıdır!
İşlem tammalanınca kullanmaya başlarsanız `Unexpected end of JSON input` hatasını alabilrisiniz. Bunun sebebi dosyaya `{}` (suslü parantez) koymamanız. Dosyaya girip içerisine `{}` yazın. Ve artık kullanmaya başlayabilirsiniz.

## Event Sistemi
### Ready
type kısmı eğer ready ise ve status kısmı aktif ise code kısmına yazılan kod database bağlanınca çalışır.
```js
db.on({
	type: "ready",
	status:"aktif",
	code:`console.log("Ready eventi çalışıyor")`
})
```
### dataSet
type kısmı eğer dataSet ise ve status kısmı aktif ise code kısmına yazılan kod database'e veri eklenince çalışır.
```js
db.on({
	type:"dataSet",
	status:"aktif",
	code:`console.log("Veri tabanına yeni veri eklendi")`
})
```
### dataSet
type kısmı eğer dataDelete ise ve status kısmı aktif ise code kısmına yazılan kod database'den veri kaldırılınca çalışır.
```js
db.on({
	type:"dataDelete",
	status:"aktif",
	code:`console.log("Veri tabanından veri silindi")`
})
```
## Belgeler
Daha fazla komuta ve örneğe bakmak için [Belgeleri](https://db.falsisdb.ml) ziyaret edebilirsiniz.
## FalsisDB

<img src="https://cdn.discordapp.com/attachments/831451584034111499/855075597658882058/unknown.png">
