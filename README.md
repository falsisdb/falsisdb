# Falsisdb

Falsisdb; Türkçe, hızlı, güvenilir, kullanışlı, açık kaynak kodlu, event destekli json database modülü.

## Kurulum

Modülü kurmak için öncelikle konsola aşağıdaki komutu yazmalısınız. (İsterseniz Github Branch'dan da çekebilirsiniz.)

```bash
npm i falsisdb@latest
```

Bunu yazdıktan sonra modülün indirilmesiniz bekleyin. Modül kurulunca `main (ana)` dosyanıza aşağıdaki kodu ekleyin. Kodu en başa eklerseniz dosyanız düzenli olur.

```javascript
const falsisdb = require("falsisdb")
const db = new falsisdb() //|| ./[PATCH]
```

Yukarıdaki kodda paket, otomatik olarak `falsisdb/database.json` dosyası oluşturacak. İsterseniz farklı bir dosya tanımlayabilirsiniz. Unutmayın, dosya başına `./` konmalıdır! İşlem tamamlanınca kullanmaya başlarsanız `Unexpected end of JSON input` hatasını alabilrisiniz. Bunun sebebi dosyaya `{}` \(suslü parantez\) koymamanız. Dosyaya girip içerisine `{}` yazın. Ve artık kullanmaya başlayabilirsiniz.

Not: **Modülün İçerisindeki `on()` fonksiyonu (eventler) diğer bütün fonksiyonların üstünde bulunmazsa, kodunuz çalışmayabilir.**
## Belgeler

Daha fazla komuta ve örneğe bakmak için [Belgeleri](https://falsisdev.gitbook.io/falsisdb/) ziyaret edebilirsiniz.

## Api

Komutların tek bir yerde toplandığı [api sitemiz](https://falsisdb.falsisdev.repl.co)i ziyaret edebilirsiniz.

## FalsisDB

Teşekkürler: [lunexdev](https://github.com/lunexdev), [berat141](https://github.com/berat141), [aloima](https://github.com/aloima), [iamashley0](https://github.com/iamashley0)

![](https://img.shields.io/github/v/release/falsisdev/falsisdb?style=for-the-badge) ![](https://img.shields.io/github/stars/falsisdev/falsisdb?style=for-the-badge) ![](https://img.shields.io/github/forks/falsisdev/falsisdb?style=for-the-badge)

![](https://github-readme-stats.vercel.app/api/pin/?username=falsisdev&repo=falsisdb&cache_seconds=86400&theme=react)
