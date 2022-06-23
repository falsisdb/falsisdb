# Falsisdb

Falsisdb; Türkçe, hızlı, güvenilir, kullanışlı, açık kaynak kodlu, event destekli json database modülü.

## Kurulum

Modülü kurmak için öncelikle konsola aşağıdaki komutu yazmalısınız. (İsterseniz Github Branch'dan da çekebilirsiniz.)

```bash
npm i falsisdb@latest
```

Bunu yazdıktan sonra modülün indirilmesiniz bekleyin. Modül kurulunca `main (ana)` dosyanıza aşağıdaki kodu ekleyin. Kodu en başa eklerseniz dosyanız düzenli olur.

```javascript
const falsisdb = require("falsisdb");
const db = new falsisdb({
    filePath: "BURAYA VERI TABANI DOSYASININ DOSYA KONUMU YAZILACAK", //isteğe bağlı
    backupPath: "BURAYA YEDEKLEME DOSYASININ DOSYA KONUMU YAZILACAK", //isteğe bağlı LÜTFEN backup[} KULLANILIYORSA BU KISMI KULLANMAYIN
    backupType: "BURAYA YEDEKLEME DOSYASININ TÜRÜ YAZILACAK | json veya txt (json önerilir)", //isteğe bağlı LÜTFEN backup[} KULLANILIYORSA BU KISMI KULLANMAYIN
    backupTime: 5, //BURAYA YEDEKLEMENIN KAÇ VERIDE BIR YAPILACAGI YAZILACAK VARSAYILAN = 5 //isteğe bağlı LÜTFEN backup[} KULLANILIYORSA BU KISMI KULLANMAYIN
    backup: { //isteğe bağlı
        path: "BURAYA YEDEKLEME DOSYASININ DOSYA KONUMU YAZILACAK", //isteğe bağlı
        type: "BURAYA YEDEKLEME DOSYASININ TÜRÜ YAZILACAK | json veya txt (json önerilir)", //isteğe bağlı
        time: 5 //BURAYA YEDEKLEMENIN KAÇ VERIDE BIR YAPILACAGI YAZILACAK VARSAYILAN = 5 //isteğe bağlı
    }
})
```

`filePath` ögesi isteğe bağlıdır. Unutmayın, dosya başına `./` konmalıdır! Proje Başlatıldığında `Unexpected end of JSON input` hatasını alabilrisiniz. Bunun sebebi dosyaya `{}` \(suslü parantez\) koymamanız. Dosyaya girip içerisine `{}` yazın. Ve artık kullanmaya başlayabilirsiniz.<br>
`backupPath`, `backupType` ve `backupTime` ögeleri `backup` nesnesine göre arka plandadır. Eğer `backup` nesnesini kullanıyorsanız; `backupPath`, `backupType` ve `backupTime` ögelerini kullanmayın. Bir hata almazsınız ancak gereksiz olur ve önerilmez.<br>
`backup` nesnesi `type`, `path` ve `time` ögelerini içerir.<br>
`backupPath` veya `backup.path`: Yedekleme Alınacak Dosyayı Tanımlar.<br>
`backupType` veya `backup.type`: Yedekleme Alınacak Dosyanın Türünü Tanımlar.<br>
`backupTime` veya `backup.time`: Yedeklemenin Kaç Veride Bir Yapılacağını Tanımlar.<br><br>
Yukarıdaki Paragraftaki tüm ögeler ve nesneler isteğe bağlıdır. Eğer Yazılmazsa Aşağıdakiler Uygulanır.<br>
Veri Tabanı Dosyası: Varsayılanı `./falsisdb/database.json`<br>
Yedekleme: Eğer hiçbir şey tanımlanmazsa yedekleme alınmaz. Ancak Aşağıdakilerden Herhangi Biri Bile Tanımlanırsa Varsayılanlar Aşağıdaki Gibi Olur. <br>
Yedekleme Dosyası: Varsayılanı `./falsisdb/backup.txt` (Uzantı girilen tipe göre değişir.)<br>
Yedekleme Dosyası Türü: Varsayılanı `txt` (Tür Girilen Dosyanın Uzantısına Göre Değişir.)<br>
Yedekleme Aralığı: Varsayılanı `5` veride bir.<br><br>

Not: **Modülün İçerisindeki `on()` fonksiyonu (eventler) diğer bütün fonksiyonların üstünde bulunmazsa, kodunuz çalışmayabilir.**
## Belgeler

Daha fazla komuta ve örneğe bakmak için [Belgeleri](https://falsisdev.gitbook.io/falsisdb/) ziyaret edebilirsiniz.

## Api

Komutların tek bir yerde toplandığı [api sitemiz](https://falsisdb.falsisdev.repl.co)i ziyaret edebilirsiniz.

## FalsisDB

Teşekkürler: [lunexdev](https://github.com/lunexdev), [berat141](https://github.com/berat141), [aloima](https://github.com/aloima), [iamashley0](https://github.com/iamashley0)

![](https://img.shields.io/github/v/release/falsisdev/falsisdb?style=for-the-badge) ![](https://img.shields.io/github/stars/falsisdev/falsisdb?style=for-the-badge) ![](https://img.shields.io/github/forks/falsisdev/falsisdb?style=for-the-badge)

![](https://github-readme-stats.vercel.app/api/pin/?username=falsisdev&repo=falsisdb&cache_seconds=86400&theme=react)
