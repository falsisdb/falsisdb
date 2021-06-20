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
const db = new falsisdb() //|| ./[PATCH]
```
Yukarıdaki kodda paket, otomatik olarak `falsisdb/database.json` dosyası oluşturacak. İsterseniz farklı bir dosya tanımlayabilirsiniz. Unutmayın, dosya başına `./` konmalıdır!
İşlem tamamlanınca kullanmaya başlarsanız `Unexpected end of JSON input` hatasını alabilrisiniz. Bunun sebebi dosyaya `{}` (suslü parantez) koymamanız. Dosyaya girip içerisine `{}` yazın. Ve artık kullanmaya başlayabilirsiniz.

## Belgeler
Daha fazla komuta ve örneğe bakmak için [Belgeleri](https://docs.falsisdb.ml) ziyaret edebilirsiniz.

## Api
Komutların tek bir yerde toplandığı [api sitemiz](https://api.falsisdb.ml/)i ziyaret edebilirsiniz.

## FalsisDB
Teşekkürler: [lunexdev](https://github.com/lunexdev), [berat141](https://github.com/berat141), [aloima](https://github.com/aloima)

<img src="https://img.shields.io/github/v/release/falsisdev/falsisdb?style=for-the-badge"> <img src="https://img.shields.io/github/stars/falsisdev/falsisdb?style=for-the-badge"> <img src="https://img.shields.io/github/forks/falsisdev/falsisdb?style=for-the-badge">

<img src="https://github-readme-stats.vercel.app/api/pin/?username=falsisdev&repo=falsisdb&cache_seconds=86400&theme=react">

<a href="https://www.kremlin-bot.ga/lisans"><img src="https://img.shields.io/github/license/falsisdev/falsisdb?style=for-the-badge"></a>
