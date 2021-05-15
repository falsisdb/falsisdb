# Falsis-DB
npmjs için basit kullanımlı database modülü

# Kullanım

*kod*
```js
const falsisdb = require("falsisdb"); //indirme
const db = new falsisdb("./database.json"); //database dosyasını tanımlama
```
*konsoldan indirme*
```js
npm install falsisdb
``` 

# Kod Örnekleri

```js
db.set("Deneme", "Deneme değeri"); // Değişken ayarlama
db.get("Deneme"); // Değişken Gösterme - çıktı: Deneme Değeri
db.delete("Deneme"); // Değişken Kaldırma
db.has("Deneme"); // false || true - Değişken Var mı?
db.fetch("Deneme"); // Değişken getirme
db.sum("yaş", 31); // Değişken ekleme
db.sub("yaş", 14); // Değişken çıkarma
db.set("array", [ "elma" ]);
db.push("array", "portakal"); 
db.clear(); // Değişken temizleme (hepsini)
```