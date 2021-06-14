# Falsisdb
Falsisdb, quick.db benzeri açık kaynak kullanışlı database modülü. Bir database modülünde gereken herşeyi içeriyor!

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

## Client Sistemi
`message` kısmına yazılan yazı database bağlanınca konsola yazar. Eğer sistem kullanılmazsa otomatik yazı yazılır.
```js
db.on("ready" , {
message : "Database bağlandı"
})
```

## Örnekler

- Veri kaydedip veri çekme
```js
db.set("veri_adı", "veri_değeri") //undefined
db.get("veri_adı") //veri_değeri
```

- Değişkeni tamamen silme
```js
db.delete("veri_adı") //undefined
```

- Dosyayı kontrol etme
```js
db.has("veri_adı") //true
db.has("deneme") //false
```
```js
if(db.has("veri_adı") === true) {
return("Değişken veri tabanı dosyasında bulunuyor.")
}else if(db.has("veri_adı") === false) {
return("Değişken veri tabanı dosyasında bulunmuyor.")
}
```

- Değişkeni çekme
```js
db.fetch("veri_adı") //veri_değişkeni
```

- Toplama
```js
db.sum("sayi_değişkeni", 2) //sayi_değişkeni + 2
```
```js
db.set("sayi_değişkeni", 1) //undefined
let değer = db.sum("sayi_değişkeni", 2)
değer //3
```

- Çıkarma
```js
db.sub("sayi_değişkeni", 2) //sayi_değişkeni - 2
```
```js
db.set("sayi_değişkeni", 3) //undefined
let değer = db.sub("sayi_değişkeni", 2)
değer //1
```

- Çarpma
```js
db.multi("sayi_değişkeni", 2) //sayi_değişkeni * 2
```
```js
db.set("sayi_değişkeni", 2) //undefined
let değer = db.multi("sayi_değişkeni", 2)
değer //4
```

- Bölme
```js
db.divide("sayi_değişkeni", 2) //sayi_değişkeni / 2
```
```js
db.set("sayi_değişkeni", 10) //undefined
let değer = db.divide("sayi_değişkeni", 2)
değer //5
```

- Ekleme
```js
db.set("sayi_değişkeni", "hey-")
db.conc("sayi_değişkeni", "merhaba") //hey-merhaba
```

- Array Push
```js
db.push("array", "array2")
```
```js
db.set("array", [ "array1" ])
db.push("array", "array2") //[ "array1", "array2"]
```

- Dosya temizleme
```js
db.clear()
```
Main dosyada tanımlanan dosya temizlendi. Örneğin `./database.json` dosyası tamamen temizlenip içine `{}` yazıldı.

- Matematik İşlemleri
```js
db.math(2 + 2) //4
db.math(2 * 2) //4
db.math(2 / 2) //1
db.math(2 - 2) //0
```
İşaretler: `+, -, *, /, :, x`

- Karekök
```js
db.sqrt(81) //9
```

## Komutlar

```js
db.set("Deneme", "Deneme değeri"); // Değişken ayarlama
db.get("Deneme"); // Değişken Gösterme - çıktı: Deneme Değeri
db.delete("Deneme"); // Değişken Kaldırma
db.has("Deneme"); // false || true - Değişken Var mı?
db.fetch("Deneme"); // Değişken getirme
db.sum("yaş", 31); // Değişken ekleme
db.sub("yaş", 14); // Değişken çıkarma
db.multi("deneme", 2) //deneme değişkeni 2 ile çarpılır.
db.divide("deneme", 2) //deneme değişkeni 2'ye bölünür
db.conc("deneme", 2) //deneme değişkenine 2 değerini koyar.
db.math(2 + 2) //matematik işlemleri - İşaretler: +, -, x, :, /, *
db.sqrt(81) //9 - Karekök alır
db.set("array", [ "elma" ]); 
db.push("array", "portakal"); //arraye değer pushlar 
db.clear(); // Değişken temizleme (hepsini)
```
