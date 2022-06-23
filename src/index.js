const fs = require("fs");
let clearfunc;
let check = null
let deleteEventCheck = null
let data;
let type;
let backup;
let btype;
let btime;
let backupkeys = []
let backupvalues = []
let backupcount = 0

function padTo2Digits(num) {
  return num.toString().padStart(2, '0');
}

function formatDate(date) {
  return [
    padTo2Digits(date.getDate()),
    padTo2Digits(date.getMonth() + 1),
    date.getFullYear(),
  ].join('/');
}

const writeFileWithDirs = ((data, path) => {
    const dirs = path.split("/").slice(1, -1);

    if (dirs.length === 0) {
        fs.writeFileSync(path, data, "utf-8");
    } else {
        const dirsLength = dirs.length;
        const processedDirs = [];
        let i = 0;

        while (i < dirsLength) {
            processedDirs.push(dirs[i]);
            const currentPath = `./${processedDirs.join("/")}`;

            if (!fs.existsSync(currentPath) || !fs.lstatSync(currentPath).isDirectory()) {
                fs.mkdirSync(currentPath);
            }

            i++;
        }

        fs.writeFileSync(path, data, "utf-8");
    }
});
const EventEmitter = require("events")
class database extends EventEmitter{
  constructor(construct) {
    super();
    if(!construct.backup) {
      if(!construct.backupPath) {
        if(!construct.backupType) {
          backup = false
        }else {
          let a = construct.backupType == "txt" ? "txt" : construct.backupType == "json" ? "json" : "error"
          if(a == "error") throw new Error("Geçersiz Yedekleme Tipi Girildi. json veya txt yazınız.")
          
          btype = a
          backup = "./falsisdb/backup." + btype
          btime = construct.backupTime || 5
          if(backup.slice("-3") == "txt") {
            if(btype !== "txt") throw new Error("Girilen dosya uzatısı ile yedekleme türü eşleşmiyor.")
          }else if(backup.slice("-3") == "son") {
            if(btype !== "json") throw new Error("Girilen dosya uzantısı ile yedekleme türü eşleşmiyor.")
          }
          if(!fs.existsSync(backup) || !fs.lstatSync(backup).isFile()) {
            if(btype == "json") writeFileWithDirs("[{}]", backup)
            if(btype == "txt") writeFileWithDirs(`Backup Oluşturuldu | ${formatDate(new Date())} | {}`, backup)
          }else {}
        }
      }else {
        if(!construct.backupType) {
          backup = construct.backupPath
          btype = construct.backupPath.slice("-3") == "son" ? "json" : construct.backupPath.slice("-3") == "txt" ? "txt" : undefined
          btime = construct.backupTime || 5
          if(backup.slice("-3") == "txt") {
            if(btype !== "txt") throw new Error("Girilen dosya uzatısı ile yedekleme türü eşleşmiyor.")
          }else if(backup.slice("-3") == "son") {
            if(btype !== "json") throw new Error("Girilen dosya uzantısı ile yedekleme türü eşleşmiyor.")
          }
          if(!fs.existsSync(backup) || !fs.lstatSync(backup).isFile()) {
            if(btype == "json") writeFileWithDirs("[{}]", backup)
            if(btype == "txt") writeFileWithDirs(`Backup Oluşturuldu | ${formatDate(new Date())} | {}`, backup)
          }else {}
        }else{
        let a = construct.backupType == "txt" ? "txt" : construct.backupType == "json" ? "json" : "error"
        if(a == "error") throw new Error("Geçersiz Yedekleme Tipi Girildi. json veya txt yazınız.")
        backup = construct.backupPath
        btype = a
        btime = construct.backupTime || 5
        if(backup.slice("-3") == "txt") {
          if(btype !== "txt") throw new Error("Girilen dosya uzatısı ile yedekleme türü eşleşmiyor.")
        }else if(backup.slice("-3") == "son") {
          if(btype !== "json") throw new Error("Girilen dosya uzantısı ile yedekleme türü eşleşmiyor.")
        }
        if(!fs.existsSync(backup) || !fs.lstatSync(backup).isFile()) {
          if(btype == "json") writeFileWithDirs("[{}]", backup)
          if(btype == "txt") writeFileWithDirs(`Backup Oluşturuldu | ${formatDate(new Date())} | {}`, backup)
        }else {}
        }
      }
    }else {
      if(!construct.backup.path) {
        if(!construct.backup.type) {
          backup = false
        }else{
          let a = construct.backup.type == "txt" ? "txt" : construct.backup.type == "json" ? "json" : "error"
          if(a == "error") throw new Error("Geçersiz Yedekleme Tipi Girildi. json veya txt yazınız.")
          
        btype = a
        backup = "./falsisdb/backup." + btype
        btime = construct.backup.time || 5
        if(backup.slice("-3") == "txt") {
          if(btype !== "txt") throw new Error("Girilen dosya uzatısı ile yedekleme türü eşleşmiyor.")
        }else if(backup.slice("-3") == "son") {
          if(btype !== "json") throw new Error("Girilen dosya uzantısı ile yedekleme türü eşleşmiyor.")
        }
        if(!fs.existsSync(backup) || !fs.lstatSync(backup).isFile()) {
          if(btype == "json") writeFileWithDirs("[{}]", backup)
          if(btype == "txt") writeFileWithDirs(`Backup Oluşturuldu | ${formatDate(new Date())} | {}`, backup)
        }else {}
      }
    }
    backup = construct.backup.path || "./falsisdb/backup." + btype
    btype = construct.backup.type || backup.slice("-3") == "son" ? "json" : backup.slice("-3") == "txt" ? "txt" : undefined
    btime = construct.backup.time || 5
    if(backup.slice("-3") == "txt") {
      if(btype !== "txt") throw new Error("Girilen dosya uzatısı ile yedekleme türü eşleşmiyor.")
    }else if(backup.slice("-3") == "son") {
      if(btype !== "json") throw new Error("Girilen dosya uzantısı ile yedekleme türü eşleşmiyor.")
    }
    if(!fs.existsSync(backup) || !fs.lstatSync(backup).isFile()) {
      if(btype == "json") writeFileWithDirs("[{}]", backup)
      if(btype == "txt") writeFileWithDirs(`Backup Oluşturuldu | ${formatDate(new Date())} | {}`, backup)
    }else {}
      this.bdata = {};
      this.jsonFilePath = construct.filePath || "./falsisdb/database.json";
      this.data = {};
      if (!fs.existsSync(this.jsonFilePath) || !fs.lstatSync(this.jsonFilePath).isFile()) {
          writeFileWithDirs("{}", this.jsonFilePath);
      } else {
          this.fetchDataFromFile();
      }
       setInterval(() => {
          if(check != null){
        this.emit('dataSet', check)
        check = null
          } else if(deleteEventCheck != null) {
            this.emit('dataDelete', deleteEventCheck)
            deleteEventCheck = null
          }
        }, 5000)
    }
  }
    fetchDataFromFile() {
        let savedData;

        try {
          savedData = JSON.parse(fs.readFileSync(this.jsonFilePath));
        } catch(error) {}

        this.data = savedData;
    }

    kaydet() {
        writeFileWithDirs(JSON.stringify(this.data, null, 2), this.jsonFilePath);
    }
    yedekle() {
      writeFileWithDirs(JSON.stringify(this.bdata, null, 2), backup);
  }
    get(key) {
        if(!key) {
          throw Error("Getirilicek Veriyi Gir!")
        } else {
        return this.data[key];
     }
    }

    fetch(key) {
        if(!key) throw Error("Getirilicek Veriyi Gir!")
        return this.data[key];
    }
    has(key, returnValue=false) {
        if(!key) throw Error("Şartlanacak Veriyi Gir!")

        if(returnValue === false){
        return Boolean(this.data[key]);
        } else {
          let result = Boolean(this.data[key]);
          let values = Object.entries(JSON.parse(fs.readFileSync(this.jsonFilePath, "utf-8"))).filter(x=>x[0] === key).map(x=>x[1])

          return{
            result:result,
            values:values
          }
        }
    }

    set(key, value) {
       const old = this.data[key]
        if(!key) {
          throw Error("Değiştirilicek Veriyi Gir!")
        }
        else if(!value) {
          throw Error("Değişicek Veriyi Gir!")
        } else {
        this.data[key] = value;
        this.kaydet();
        data = value
        type = "set"
        check = {
          key: key,
          changed: old == this.data[key] ? false : true,
          oldValue: old,
          value: value
        }
        if(backup == false){}else{
          backupcount += 1
          backupkeys.push(key)
          backupvalues.push(value)
          if(backupcount == btime){
            backupcount = 0
            if(btype == "json") {
              this.bdata[`Back-Up-${Math.floor(Math.random() * 1000000000000)}`] = {
                date: formatDate(new Date()),
                keys: backupkeys,
                values: backupvalues
              }
              this.yedekle();
            }else if(btype == "txt") {
              fs.writeFileSync(backup, `Back-Up-${Math.floor(Math.random() * 1000000000000)} | ${formatDate(new Date())} | ${backupkeys} | ${backupvalues}`)
            }
            console.log("Backup Alındı")
          }
        }
        }
    }

    delete(key) {
      const val = this.data[key]
        if(!key) {
          throw Error("Silinicek Veriyi Gir!")
        } else {
        delete this.data[key];
        this.kaydet();
        data = key
        type = "delete"
        deleteEventCheck = {
          key: key,
          value:val
        }
        }
    }

    conc(key, count) {
        if(!key) {
          throw Error("Ekleme Yapılacak Veriyi Gir!")
        }
        if(!count) {
          throw Error("Eklenecek Veriyi Gir!")
        }
        if (!this.data[key]) {
          this.data[key] = count;
        } else {
          this.data[key] += count.toString();
        }

        this.kaydet();
        data = count
        type = "conc"
    }

    multi(key, count) {
        if(!key) {
          throw Error("Silinme Yapılacak Veriyi Gir!")
        }
        if(!count) {
          throw Error("Silinecek Veriyi Gir!")
        }
        if(isNaN(this.data[key]) == true){
          throw Error("Lütfen bir sayı belirtin.")
          }
        if (!this.data[key]) {
          this.data[key] = count;
        } else {
          this.data[key] *= count;
        }
        this.kaydet();
        data = count
        type = "multi"
    }

    divide(key, count) {
        if(!key) {
          throw Error("Bölünme Yapılacak Veriyi Gir!")
        }
        if(!count) {
          throw Error("Bölünecek Veriyi Gir!")
        }
        if(isNaN(this.data[key]) == true){
            throw Error("Lütfen bir sayı belirtin.")
        }
        if (!this.data[key]) {
          this.data[key] = count;
        } else {
          this.data[key] /= count;
        }

        this.kaydet();
        data = count
        type = "divide"
    }

    sum(key, count) {
        if(!key) {
          throw Error("Ekleme Yapılacak Veriyi Gir!")
        }
        if(!count) {
          throw Error("Eklenecek Veriyi Gir!")
        }
        if(isNaN(this.data[key]) == true){
            throw Error("Lütfen bir sayı belirtin.")
        }
        if (!this.data[key]) {
          this.data[key] = +count;
          } else {
          this.data[key] += count;
        }

        this.kaydet();
        data = count
        type = "sum"
    }

    sub(key, count) {
        if(!key) {
          throw Error("Çıkarma Yapılacak Veriyi Gir!")
        }
        if(!count) {
          throw Error("Çıkarılacak Veriyi Gir!")
        }
        if(isNaN(this.data[key]) == true){
            throw Error("Lütfen bir sayı belirtin.")
        }
        if (!this.data[key]) {
          this.data[key] = -count;
        } else {
          this.data[key] -= count;
        }

        this.kaydet();
        data = count
        type = "sum"
    }
    push(key, element) {
        if(!key) {
          throw Error("Array Adını Gir!")
        }
        if(!element) {
          throw Error("Array Verisini Gir!")
        }
        if (!this.data[key]) {
          this.data[key] = [];
        }
        if(!Array.isArray(this.data[key])){
          throw Error("Girilen verinin değeri bir array değil.")
        } else {
        this.data[key].push(element)
        this.kaydet();
        data = element
        type = "push (array)"
        }
      }


    clear() {
        this.data = {};
        this.kaydet();
                if(clearfunc){
        eval(clearfunc)  //dataClear event created by falsis
        }
    }

    sqrt(sayi) {
        if(isNaN(sayi) == true) {
            return("Lütfen karekökünü bulmak istediğiniz geçerli bir sayı giriniz")}
        if(!sayi) {
            throw new TypeError("Lütfen karekökünü bulmak istediğiniz sayıyı giriniz.")
        }else{
            return Math.sqrt(sayi)}
};

math(key , islem , key2) {
        if(!key) throw new TypeError("Birinci Sayıyı Gir!")
        if(!key2) throw new TypeError("İkinci Sayıyı Gir!")
        if(!islem) throw new TypeError("İşlemi Gir!")
        let sayı = parseInt(key)
        let sayı2 = parseInt(key2)
        if(islem=="+") {
        return sayı + sayı2
        }
        if(islem=="-") {
        return sayı - sayı2
    }
        if(islem=="*" || islem=="x"){
        return sayı * sayı2
    }
        if(islem=="/" || islem==":") {
        return sayı / sayı2}
        else {
        throw Error("Tanımsız İşlem!")}}
        random(key){
            if(!key) throw Error("Max Kaç oluşabileceğini Gir!")
            return Math.floor((Math.random() * key) + 1);
        }

   get info(){
        return{
            name: "falsisdb",
            type: "JsonDatabase",
            version: "2.2.7",
            owner: "falsisdev",
            developers: ["falsisdev", "lunexdev", "berat141"],
            github: "https://github.com/falsisdev/falsisdb",
            commands: `${Object.entries("./src/index.js").length}`,
            file: this.jsonFilePath,
            lastdata: {
            data: data || null,
            type: type || null
        }
        }
    }
     includes(key) {
        if(!key) {
            throw new TypeError("Lütfen database dosyasında aramak istediğiniz veri adını girin.") //falsis kzgın 😎
        }
        return fs.readFileSync(this.jsonFilePath).includes(key)
    }
        all() {
        if(!this.jsonFilePath) {
            throw new TypeError("Database Dosyası Ayarlanmamış, okunacak dosya bulunamadı!")
        }
         return fs.readFileSync(`${this.jsonFilePath}`, "utf8")
        }
        includesKey(key) {
          if(!key) {
            throw new Error("Veri anahtarı belirtilmemiş.")
          } else {
          return Object.entries(JSON.parse(fs.readFileSync(this.jsonFilePath, "utf-8")))
          .filter(x=>x[0].includes(key)).length === 0 ? false : true
          }
        }
        includesValue(value) {
          if(!value) {
            throw new Error("Veri değeri belirtilmemiş.")
          } else {
          return Object.entries(JSON.parse(fs.readFileSync(this.jsonFilePath, "utf-8")))
          .filter(x=>x[1].includes(value)).length === 0 ? false : true
          }
        }

        hasValue(value, returnKey=false){
          if(!value){
            throw new Error("Değer belirtilmemiş.")
          }

          if(returnKey == false){
          return Object.entries(JSON.parse(fs.readFileSync(this.jsonFilePath, "utf-8")))
          .filter(x=>x[1] === value).length === 0 ? false : true
          } else {
            let result = Object.entries(JSON.parse(fs.readFileSync(this.jsonFilePath, "utf-8")))
          .filter(x=>x[1] === value).length === 0 ? false : true

           let keys = Object.entries(JSON.parse(fs.readFileSync(this.jsonFilePath, "utf-8")))
          .filter(x=>x[1] === value).map(x=>x[0])

            return{
              result:result,
              keys: keys
            }
          }
        }

       keys(){
          return Object.entries(JSON.parse(fs.readFileSync(this.jsonFilePath, "utf-8"))).map(x=>x[0])
        }

       values(){
          return Object.entries(JSON.parse(fs.readFileSync(this.jsonFilePath, "utf-8"))).map(x=>x[1])
        }
    all(){
         this.fetchDataFromFile()
         return this.data
        }

        find(fn, thisArg) {
           this.fetchDataFromFile()
let res = {};
if(thisArg) fn = fn.bind(thisArg);
for(const [key,val] of Object.entries(this.data)){
if(fn(val,key,this.data)){
res[key] = val
break;
} else continue
}
return res
}
filter(fn, thisArg) {
  this.fetchDataFromFile()
let res = {};
if(thisArg) fn = fn.bind(thisArg);
for(const [key,val] of Object.entries(this.data)){
if(fn(val,key,this.data))
res[key] = val
}
return res
}

filterKey(fn, thisArg) {
let res = {};
if(thisArg) fn = fn.bind(thisArg);
for(const [key,val] of Object.entries(this.data)){
if(fn(key,val,this.data))
res[key] = val
}
return res
}

findKey(fn, thisArg) {
let res = {};
if(thisArg) fn = fn.bind(thisArg);
for(const [key,val] of Object.entries(this.data)){
if(fn(key,val,this.data)){
res[key] = val
break;
} else continue
}
return res
}
    }
module.exports =  database