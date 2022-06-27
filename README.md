# Falsisdb

Falsisdb; Türkçe, hızlı, güvenilir, kullanışlı, açık kaynak kodlu, event ve yedekleme destekli, json database modülü.

## Kurulum

Modülü kurmak için öncelikle konsola aşağıdaki komutu yazmalısınız.

```bash
npm i falsisdb@latest
```

veya bunun yerine en en güncel sürümü github'dan çekin. (Hatalar olabilir.)

```bash
npm i "https://github.com/falsisdev/falsisdb.git#master"
```

Bunu yazdıktan sonra modülün indirilmesiniz bekleyin. Modül kurulunca `main (ana)` dosyanıza aşağıdaki kodu ekleyin. Kodu en başa eklerseniz dosyanız düzenli olur.

## Yedekleme Sistemi ve Daha Fazlası 

Yedekleme sisteminin amacı, ana veri tabanı dosyasına herhangi bir zarar gelirse veri tabanını kolayca yedek dosyasında saklaması. Bunun üzerine **Peki ya yedek dosyasına zarar gelirse?** tarzı bir soru gelebilir. Bunun için yedek sistemine `backupTime` ekledik. Örneğin veri tabanına 1 veri eklediğinizde veri anında yedeğe atılmıyor da ayarladığınız sayı kadar veri eklendiğinde yeni bir yedek oluşturup o zaman yedeği atıyor. Böylece yedek dosyası, ana veri tabanı dosyası kadar hareketli ve risk altında olmuyor.

Şimdi biraz kullanımından bahsedelim. Kullanımından Bahsetmeden Önce birkaç şey hatırlatmak istiyorum.
1. Yedek Sistemindeki tüm ögeler ve nesneler isteğe bağlıdır.
2. Yedek Sistemi aktif olduğunda, `falsisdb` klasöründe `backupData.json` dosyası oluşacaktır. Bu dosyada kaç tane backup alındığı, 1 başlatma sürecinde kaç veri kaydedildiği (`time` kısmı için kullanılıyor.) ve eğer 1 başlatma sürecinde kaydedilen veri sayısı tanımlanan `time` değerine eşit değilse eşit olana kadar kaydedilen verilerin yedeği tutulur. Böylece proje kaç kere yeniden başlatılsa bile hiçbir şey sıfırlanmaz. Eğer bir veri önceden yedeklendiyse veya yedekleme sırasına konulduysa tekrar yedeklenmez veya yedekleme sırasına konulmaz. Bu bir hata değil, bilinçli yapılmış bir özelliktir. Ayrıca eğer bir veriyi veri tabanından silerseniz, bu veri yedek dosyasında bulunmaya devam eder. Böylece eğer sildiğiniz veriyi yanlışlıkla sildiyseniz veya veri kendiliğinden silindiyse yedekleme dosyasından tekrar alabilirsiniz.<br>

```js
const falsisdb = require("falsisdb");
const db = new falsisdb({
    filePath: "BURAYA VERI TABANI DOSYASININ DOSYA KONUMU YAZILACAK", //isteğe bağlı
    backupPath: "BURAYA YEDEKLEME DOSYASININ DOSYA KONUMU YAZILACAK", //isteğe bağlı LÜTFEN backup[} KULLANILIYORSA BU KISMI KULLANMAYIN
    backupTime: 5, //BURAYA YEDEKLEMENIN KAÇ VERIDE BIR YAPILACAGI YAZILACAK VARSAYILAN = 5 //isteğe bağlı LÜTFEN backup[} KULLANILIYORSA BU KISMI KULLANMAYIN
    backup: { //isteğe bağlı
        path: "BURAYA YEDEKLEME DOSYASININ DOSYA KONUMU YAZILACAK", //isteğe bağlı
        time: 5 //BURAYA YEDEKLEMENIN KAÇ VERIDE BIR YAPILACAGI YAZILACAK VARSAYILAN = 5 //isteğe bağlı
    },
    eventInterval: 100 //BURAYA EVENTLERIN KAC MILISANIYEDE (MS) BIR KONTROL EDİLECEĞİ YAZILACAK VARSAYILAN = 100ms //isteğe bağlı
})
```

`filePath` ögesi isteğe bağlıdır. Unutmayın, dosya başına `./` konmalıdır! Proje Başlatıldığında `Unexpected end of JSON input` hatasını alabilrisiniz. Bunun sebebi dosyaya `{}` \(suslü parantez\) koymamanız. Dosyaya girip içerisine `{}` yazın. Ve artık kullanmaya başlayabilirsiniz.<br>
`backupPath`, `backupType` ve `backupTime` ögeleri `backup` nesnesine göre arka plandadır. Eğer `backup` nesnesini kullanıyorsanız; `backupPath`, `backupType` ve `backupTime` ögelerini kullanmayın. Bir hata almazsınız ancak gereksiz olur ve önerilmez.<br>
`backup` nesnesi `type`, `path` ve `time` ögelerini içerir.<br>
`backupPath` veya `backup.path`: Yedekleme Alınacak Dosyayı Tanımlar.<br>
`backupTime` veya `backup.time`: Yedeklemenin Kaç Veride Bir Yapılacağını Tanımlar.<br>
`eventInterval`: Eventlerin ne kadar sürede bir kontrol edileceğini tanımlar<br><br>
Yukarıdaki Paragraftaki tüm ögeler ve nesneler isteğe bağlıdır. Eğer Yazılmazsa Aşağıdakiler Uygulanır.<br>
Veri Tabanı Dosyası: Varsayılanı `./falsisdb/database.json`<br>
Yedekleme: Eğer hiçbir şey tanımlanmazsa yedekleme alınmaz. Ancak Aşağıdakilerden Herhangi Biri Bile Tanımlanırsa Varsayılanlar Aşağıdaki Gibi Olur. <br>
Yedekleme Dosyası: Varsayılanı `./falsisdb/backup.json`<br>
Yedekleme Aralığı: Varsayılanı `5` veride bir.<br>
Event Interval: Varsayılan `100` milisaniyede bir.<br><br>

## Event Sistemi

- DataSet

dataSet eventi bir veri eklendiğinde tetiklenecek kodu tanımlamak için kullanılr.

```js
db.on("dataSet", (data) => {
    if(data.changed == true){
        console.log(`📝 Veri Tabanında Bir Veri Değiştirildi\n- Veri İsmi: ${data.key}\n- Eski Değeri: ${data.oldValue}\n- Yeni Değeri: ${data.value}`) 
    }
    console.log(data)
})
```

- DataDelete

dataDelete eventi bir veri silindiğinde tetiklenecek kodu tanımlamak için kullanılr.

```js
db.on("dataDelete", (data) => {
        console.log(`📝 Veri Tabanında Bir Veri Silindi\n- Veri İsmi: ${data.key}\n- Eski Değeri: ${data.value}`)
})
```

## Geliştirme

<img src="https://cdn.discordapp.com/attachments/775822548519616562/989824612697264178/falsisdb_0DE118C.png">

Teşekkürler: [lunexdev](https://github.com/lunexdev), [berat141](https://github.com/berat141), [aloima](https://github.com/aloima), [iamashley0](https://github.com/iamashley0)

![](https://img.shields.io/github/v/release/falsisdev/falsisdb?style=for-the-badge) ![](https://img.shields.io/github/stars/falsisdev/falsisdb?style=for-the-badge) ![](https://img.shields.io/github/forks/falsisdev/falsisdb?style=for-the-badge)

![](https://github-readme-stats.vercel.app/api/pin/?username=falsisdev&repo=falsisdb&cache_seconds=86400&theme=react)
