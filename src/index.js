const fs = require("fs");

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
    if(fs.existsSync(process.cwd() + "/falsisdb/development.json") == false) writeFileWithDirs(`{"backupcount": 0}`, process.cwd() + "/falsisdb/development.json")
    this.data = {};
    this.lastData = null;
    this.lastDataType = null;
    this.clearfunc = undefined;
    this.check = null;
    this.willBeExecutedDatas = [];
    this.deleteEventCheck = null;
    this.willBeExecutedDeleteDatas = [];
    this.type = undefined;
    this.backup = undefined;
    this.btype = undefined;
    this.btime = undefined;
    this.backupkeys = [];
    this.backupvalues = [];
    this.backupcount = 0;
    this.bcount = Number(JSON.stringify(JSON.parse(fs.readFileSync(process.cwd() + "/falsisdb/development.json")).backupcount))
    this.backupdata = {};
    this.eventsArray = [];
    this.bdata = {};
      this.jsonFilePath = construct.filePath || "./falsisdb/database.json";
    if(!construct.backup) {
      if(!construct.backupPath) {
        if(!construct.backupType) {
          this.backup = false
        }else {
          let a = construct.backupType == "txt" ? "txt" : construct.backupType == "json" ? "json" : "error"
          if(a == "error") throw new Error("❌ FalsisDB Hatası: Geçersiz Yedekleme Tipi Girildi. Lütfen Yedekleme Tipini json veya txt Olarak Değiştirin.")
          
          this.btype = a
          this.backup = "./falsisdb/backup." + this.btype
          this.btime = construct.backupTime || 5
          if(this.backup.slice("-3") == "txt") {
            if(this.btype !== "txt") throw new Error("❌ FalsisDB Hatası: Girilen Yedekleme Dosyası Uzantısı ile Yedekleme Türü Eşleşmiyor. Lütfen İkisini de Aynı Olacak Biçimde Değiştirin.")
          }else if(this.backup.slice("-3") == "son") {
            if(this.btype !== "json") throw new Error("❌ FalsisDB Hatası: Girilen Yedekleme Dosyası Uzantısı ile Yedekleme Türü Eşleşmiyor. Lütfen İkisini de Aynı Olacak Biçimde Değiştirin.")
          }
          if(!fs.existsSync(this.backup) || !fs.lstatSync(this.backup).isFile()) {
            if(this.btype == "json") writeFileWithDirs("[{}]", this.backup)
            if(this.btype == "txt") writeFileWithDirs(`Backup Oluşturuldu | ${formatDate(new Date())} | {}`, this.backup)
          }else {}
        }
      }else {
        if(!construct.backupType) {
          this.backup = construct.backupPath
          this.btype = construct.backupPath.slice("-3") == "son" ? "json" : construct.backupPath.slice("-3") == "txt" ? "txt" : undefined
          this.btime = construct.backupTime || 5
          if(this.backup.slice("-3") == "txt") {
            if(this.btype !== "txt") throw new Error("❌ FalsisDB Hatası: Girilen Yedekleme Dosyası Uzantısı ile Yedekleme Türü Eşleşmiyor. Lütfen İkisini de Aynı Olacak Biçimde Değiştirin.")
          }else if(this.backup.slice("-3") == "son") {
            if(this.btype !== "json") throw new Error("❌ FalsisDB Hatası: Girilen Yedekleme Dosyası Uzantısı ile Yedekleme Türü Eşleşmiyor. Lütfen İkisini de Aynı Olacak Biçimde Değiştirin.")
          }
          if(!fs.existsSync(this.backup) || !fs.lstatSync(this.backup).isFile()) {
            if(this.btype == "json") writeFileWithDirs("[{}]", this.backup)
            if(this.btype == "txt") writeFileWithDirs(`Backup Oluşturuldu | ${formatDate(new Date())} | {}`, this.backup)
          }else {}
        }else{
        let a = construct.backupType == "txt" ? "txt" : construct.backupType == "json" ? "json" : "error"
        if(a == "error") throw new Error("❌ FalsisDB Hatası: Geçersiz Yedekleme Tipi Girildi. Lütfen Yedekleme Tipini json veya txt Olarak Değiştirin.")
        this.backup = construct.backupPath
        this.btype = a
        this.btime = construct.backupTime || 5
        if(this.backup.slice("-3") == "txt") {
          if(this.btype !== "txt") throw new Error("❌ FalsisDB Hatası: Girilen Yedekleme Dosyası Uzantısı ile Yedekleme Türü Eşleşmiyor. Lütfen İkisini de Aynı Olacak Biçimde Değiştirin.")
        }else if(this.backup.slice("-3") == "son") {
          if(this.btype !== "json") throw new Error("❌ FalsisDB Hatası: Girilen Yedekleme Dosyası Uzantısı ile Yedekleme Türü Eşleşmiyor. Lütfen İkisini de Aynı Olacak Biçimde Değiştirin.")
        }
        if(!fs.existsSync(this.backup) || !fs.lstatSync(this.backup).isFile()) {
          if(this.btype == "json") writeFileWithDirs("[{}]", this.backup)
          if(this.btype == "txt") writeFileWithDirs(`Backup Oluşturuldu | ${formatDate(new Date())} | {}`, this.backup)
        }else {}
        }
      }
    }else {
      if(!construct.backup.path) {
        if(!construct.backup.type) {
          this.backup = false
        }else{
          let a = construct.backup.type == "txt" ? "txt" : construct.backup.type == "json" ? "json" : "error"
          if(a == "error") throw new Error("❌ FalsisDB Hatası: Geçersiz Yedekleme Tipi Girildi. Lütfen Yedekleme Tipini json veya txt Olarak Değiştirin.")
          
        this.btype = a
        this.backup = "./falsisdb/backup." + this.btype
        this.btime = construct.backup.time || 5
        if(this.backup.slice("-3") == "txt") {
          if(this.btype !== "txt") throw new Error("❌ FalsisDB Hatası: Girilen Yedekleme Dosyası Uzantısı ile Yedekleme Türü Eşleşmiyor. Lütfen İkisini de Aynı Olacak Biçimde Değiştirin.")
        }else if(this.backup.slice("-3") == "son") {
          if(this.btype !== "json") throw new Error("❌ FalsisDB Hatası: Girilen Yedekleme Dosyası Uzantısı ile Yedekleme Türü Eşleşmiyor. Lütfen İkisini de Aynı Olacak Biçimde Değiştirin.")
        }
        if(!fs.existsSync(this.backup) || !fs.lstatSync(this.backup).isFile()) {
          if(this.btype == "json") writeFileWithDirs("[{}]", this.backup)
          if(this.btype == "txt") writeFileWithDirs(`Backup Oluşturuldu | ${formatDate(new Date())} | {}`, this.backup)
        }else {}
      }
    }
    this.backup = construct.backup.path || "./falsisdb/backup." + this.btype
    this.btype = construct.backup.type || this.backup.slice("-3") == "son" ? "json" : this.backup.slice("-3") == "txt" ? "txt" : undefined
    this.btime = construct.backup.time || 5
    if(this.backup.slice("-3") == "txt") {
      if(this.btype !== "txt") throw new Error("❌ FalsisDB Hatası: Girilen Yedekleme Dosyası Uzantısı ile Yedekleme Türü Eşleşmiyor. Lütfen İkisini de Aynı Olacak Biçimde Değiştirin.")
    }else if(this.backup.slice("-3") == "son") {
      if(this.btype !== "json") throw new Error("❌ FalsisDB Hatası: Girilen Yedekleme Dosyası Uzantısı ile Yedekleme Türü Eşleşmiyor. Lütfen İkisini de Aynı Olacak Biçimde Değiştirin.")
    }
    if(!fs.existsSync(this.backup) || !fs.lstatSync(this.backup).isFile()) {
      if(this.btype == "json") writeFileWithDirs("[{}]", this.backup)
      if(this.btype == "txt") writeFileWithDirs(`Backup Oluşturuldu | ${formatDate(new Date())} | {}`, this.backup)
    }else {}
      /*if (!fs.existsSync(this.jsonFilePath) || !fs.lstatSync(this.jsonFilePath).isFile()) {
          writeFileWithDirs("{}", this.jsonFilePath);
      } else {
          this.fetchDataFromFile();
          console.log(this.data)
      }*/
      
    }
    if (!fs.existsSync(this.jsonFilePath) || !fs.lstatSync(this.jsonFilePath).isFile()) {
          writeFileWithDirs("{}", this.jsonFilePath);
      } else {
          this.fetchDataFromFile();
      }
    setInterval(() => {
          if(this.check != null){
            for(const data of this.willBeExecutedDatas) {
        this.emit('dataSet', data)
            }
        this.check = null
        this.willBeExecutedDatas = []
          } else if(this.deleteEventCheck != null) {
            for(const data of this.willBeExecutedDeleteDatas) {
        this.emit('dataDelete', data)
            }
            this.deleteEventCheck = null
            this.willBeExecutedDeleteDatas = []
          }
        }, construct.eventInterval || 100)
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
      writeFileWithDirs(JSON.stringify(this.bdata, null, 2), this.backup);
  }
    get(key) {
        if(!key) {
          throw Error("❌ FalsisDB Hatası: Veri Tabanından Çekilecek Veri Bulunamadı. Lütfen Çekmek İstediğiniz Veriyi Girin.")
        } else {
        return this.data[key];
     }
    }

    fetch(key) {
        if(!key) throw Error("❌ FalsisDB Hatası: Veri Tabanından Çekilecek Veri Bulunamadı. Lütfen Çekmek İstediğiniz Veriyi Girin.")
        return this.data[key];
    }
    has(key, returnDatas=false) {
        if(!key) throw Error("❌ FalsisDB Hatası: Veri Tabanında Varlığı Kontrol Edilecek Veri Bulunamadı. Lütfen Şartlanacak Veriyi Girin.")
     // this.fetchDataFromFile()

        if(returnDatas === false){
        return Boolean(this.data[key]);
        } else {
          let result = Boolean(this.data[key]);
          let data = Object.entries(JSON.parse(fs.readFileSync(this.jsonFilePath, "utf-8"))).filter(x=>x[0] === key)
          let obj = {}
          result == true ? obj[data[0][0]] = data[0][1] : ""
          
          return{
            result:result,
            data:obj
          }
        }
    }

    set(key, value) {
       const old = this.data[key]
        if(!key) {
          throw Error("❌ FalsisDB Hatası: Veri Tabanı Dosyasına Eklenecek Veri Bulunamadı. Lütfen Eklemek İstediğiniz Verinin İsmini Girin.")
        }
        else if(!value) {
          throw Error("❌ FalsisDB Hatası: Veri Tabanı Dosyasına Eklenecek Veri Bulunamadı. Lütfen Eklemek İstediğiniz Verinin Değerini Girin.")
        } else {
        this.data[key] = value;
        this.kaydet();
        const data = {
          key: key,
          changed: old == this.data[key] ? false : true,
          oldValue: old,
          value: value
        }
        this.check = data
        this.willBeExecutedDatas.push(data)
          //console.log(this.check)
        if(this.backup == false){}else{
          this.backupcount += 1
          this.backupdata[key] = value
          this.backupkeys.push(key)
          this.backupvalues.push(value)
          if(this.backupcount == this.btime){
            this.backupcount = 0
            if(this.btype == "json") {
              this.bdata[`Back-Up-${this.bcount}`] = {
                date: formatDate(new Date()),
                keys: this.backupkeys,
                values: this.backupvalues,
                data:this.backupdata
              }
              this.yedekle();
            }else if(this.btype == "txt") {
              fs.writeFileSync(this.backup, `Back-Up-${this.bcount} | ${formatDate(new Date())} | ${this.backupkeys} | ${this.backupvalues}`)
            }
            console.log("📝 Falsisdb Bilgilendirme: Yedekleme Alındı. Yedek ismi: Back-Up-" + this.bcount + ".")
            fs.writeFileSync(process.cwd() + "/falsisdb/development.json", JSON.stringify(JSON.parse(`{"backupcount": ${Number(this.bcount) + 1}}`)))
          }
        }
        }
    }

    delete(key) {
      const val = this.data[key]
        if(!key) {
          throw Error("❌ FalsisDB Hatası: Veri Tabanı Dosyasınan Silinmek İstenen Veri Bulunamadı. Lütfen Silinecek Veriyi Girin.")
        } else {
        delete this.data[key];
        this.kaydet();
        this.deleteEventCheck = {
          key: key,
          value:val
        }
          this.willBeExecutedDeleteDatas.push(this.deleteEventCheck)
        }
    }

    conc(key, count) {
        if(!key) {
          throw Error("❌ FalsisDB Hatası: Veri Tabanında Üzerine Ekleme Yapılmak İstenen Veri Bulunamadı. Lütfen Ekleme Yapmak İstediğiniz Verinin İsmini Girin.")
        }
        if(!count) {
          throw Error("❌ FalsisDB Hatası: Verinin Üzerine Eklemek İstediğiniz Değer Bulunamadı. Lütfen Ekleme Yapmak İstediğiniz Verinin İsmini Girin.")
        }
        if (!this.data[key]) {
          this.data[key] = count;
        } else {
          this.data[key] += count.toString();
        }
        this.lastData = count;
        this.lastDataType = "conc"
        this.kaydet();
    }

    multi(key, count) {
        if(!key) {
          throw Error("❌ FalsisDB Hatası: Veri Tabanında Çarpma İşlemine Sokulacak Veri Bulunamadı. Lütfen Verinin İsmini Girin.")
        }
        if(!count) {
          throw Error("❌ FalsisDB Hatası: Veri ile Çarpma İşlemine Sokmak İstediğiniz Değer Bulunamadı. Lütfen İşleme Sokmak İstediğiniz Verinin İsmini Girin.")
        }
        if(isNaN(this.data[key]) == true){
          throw Error("❌ FalsisDB Hatası: Veri ile Çarpma İşlemine Sokmak İstediğiniz Değer Bir Sayı Olmalı. Lütfen İşleme Sokmak İstediğiniz Veriyi Sayı Formatında Girin.")
          }
        if (!this.data[key]) {
          this.data[key] = count;
        } else {
          this.data[key] *= count;
        }
        this.lastData = count;
        this.lastDataType = "multi"
        this.kaydet();
    }

    divide(key, count) {
        if(!key) {
          throw Error("❌ FalsisDB Hatası: Veri Tabanında Bölme İşlemine Sokulacak Veri Bulunamadı. Lütfen Verinin İsmini Girin.")
        }
        if(!count) {
          throw Error("❌ FalsisDB Hatası: Veri ile Bölme İşlemine Sokmak İstediğiniz Değer Bulunamadı. Lütfen İşleme Sokmak İstediğiniz Verinin İsmini Girin.")
        }
        if(isNaN(this.data[key]) == true){
            throw Error("❌ FalsisDB Hatası: Veri ile Bölme İşlemine Sokmak İstediğiniz Değer Bir Sayı Olmalı. Lütfen İşleme Sokmak İstediğiniz Veriyi Sayı Formatında Girin.")
        }
        if (!this.data[key]) {
          this.data[key] = count;
        } else {
          this.data[key] /= count;
        }
        this.lastData = count;
        this.lastDataType = "divide"
        this.kaydet();
    }

    sum(key, count) {
        if(!key) {
          throw Error("❌ FalsisDB Hatası: Veri Tabanında Toplama İşlemine Sokulacak Veri Bulunamadı. Lütfen Verinin İsmini Girin.")
        }
        if(!count) {
          throw Error("❌ FalsisDB Hatası: Veri ile Toplama İşlemine Sokmak İstediğiniz Değer Bulunamadı. Lütfen İşleme Sokmak İstediğiniz Verinin İsmini Girin.")
        }
        if(isNaN(this.data[key]) == true){
            throw Error("❌ FalsisDB Hatası: Veri ile Toplama İşlemine Sokmak İstediğiniz Değer Bir Sayı Olmalı. Lütfen İşleme Sokmak İstediğiniz Veriyi Sayı Formatında Girin.")
        }
        if (!this.data[key]) {
          this.data[key] = +count;
          } else {
          this.data[key] += count;
        }
        this.lastData = count;
        this.lastDataType = "sum"
        this.kaydet();
    }

    sub(key, count) {
        if(!key) {
          throw Error("❌ FalsisDB Hatası: Veri Tabanında Çıkarma İşlemine Sokulacak Veri Bulunamadı. Lütfen Verinin İsmini Girin.")
        }
        if(!count) {
          throw Error("❌ FalsisDB Hatası: Veri ile Çıkarma İşlemine Sokmak İstediğiniz Değer Bulunamadı. Lütfen İşleme Sokmak İstediğiniz Verinin İsmini Girin.")
        }
        if(isNaN(this.data[key]) == true){
            throw Error("❌ FalsisDB Hatası: Veri ile Çıkarma İşlemine Sokmak İstediğiniz Değer Bir Sayı Olmalı. Lütfen İşleme Sokmak İstediğiniz Veriyi Sayı Formatında Girin.")
        }
        if (!this.data[key]) {
          this.data[key] = -count;
        } else {
          this.data[key] -= count;
        }
        this.lastData = count;
        this.lastDataType = "sub"
        this.kaydet();
    }
    push(key, element) {
        if(!key) {
          throw Error("❌ FalsisDB Hatası: Veri Tabanında Üzerine Değer Eklemek İstediğiniz Array Bir Veri Bulunamadı. Lütfen Verinin İsmini Girin.")
        }
        if(!element) {
          throw Error("❌ FalsisDB Hatası: Verinin Üzerine Eklemek İstediğiniz Değer Bulunamadı. Lütfen Eklemek İstediğiniz Değerin İsmini Girin.")
        }
        if (!this.data[key]) {
          this.data[key] = [];
        }
        if(!Array.isArray(this.data[key])){
          throw Error("❌ FalsisDB Hatası: Veri Tabanında Üzerine Değer Eklemek İstediğiniz Veri Array Değil. Lütfen Veriyi Array Formatında Olacak Biçimde Değiştirin.")
        } else {
        this.data[key].push(element)
        this.kaydet();
        this.lastData = element;
        this.lastDataType = "push"
        }
      }


    clear() {
        this.data = {};
        this.kaydet();
                if(clearfunc){
        eval(clearfunc)  //dataClear event created by falsis
        }
    }
   get info(){
        return{
            name: "falsisdb",
            type: "JsonDatabase",
            version: "2.3.0",
            owner: "falsisdev",
            developers: ["falsisdev", "lunexdev", "berat141"],
            github: "https://github.com/falsisdev/falsisdb",
            commands: `${Object.entries("./src/index.js").length}`,
            pathfile: this.jsonFilePath,
            backupfile: this.backup,
            backuptype: this.btype,
            backuptime: this.btime,
            lastdata: {
            data: this.lastData,
            type: this.lastDataType
        }
        }
    }
        all() {
        if(!this.jsonFilePath) {
            throw new TypeError("❌ FalsisDB Hatası: Veri Tabanı Dosyası Bulunamadı. Lütfen Geliştiriciler İle İletişime Geçin.")
        }
         return fs.readFileSync(`${this.jsonFilePath}`, "utf8")
        }
        includesKey(key,returnDatas=false) {
          if(!key) {
            throw new Error("❌ FalsisDB Hatası: Veri Tabanında Varlığı Kontrol Edilecek Veri Bulunamadı. Lütfen Şartlanacak Veriyi Girin.")
          } else {
            let data = Object.entries(JSON.parse(fs.readFileSync(this.jsonFilePath, "utf-8"))).filter(x=>x[0].includes(key))
            if(returnDatas = false){
return data.length > 0 ? true : false
            }else {
              let obj = {};
              data.forEach(x=>{
                obj[x[0]] = x[1]
              })
              return {
                result:data.length > 0 ? true : false,
                data:obj
              }
            
            }
          }
        }
        includesValue(value, returnDatas=false) {
          if(!value) {
            throw new Error("❌ FalsisDB Hatası: Veri Tabanında Varlığı Kontrol Edilecek Veri Değeri Bulunamadı. Lütfen Şartlanacak Verinin Değerini Girin.")
          } else {
          let data = Object.entries(JSON.parse(fs.readFileSync(this.jsonFilePath, "utf-8"))).filter(x=>x[1].includes(value))
            if(returnDatas = false){
return data.length > 0 ? true : false
            }else {
              let obj = {};
              data.forEach(x=>{
                obj[x[0]] = x[1]
              })
              return {
                result:data.length > 0 ? true : false,
                data:obj
              }
            
            }
          }
        }

        hasValue(value, returnDatas=false){
          if(!value){
            throw new Error("❌ FalsisDB Hatası: Veri Tabanında Varlığı Kontrol Edilecek Veri Değeri Bulunamadı. Lütfen Şartlanacak Verinin Değerini Girin.")
          }

          let data = Object.entries(JSON.parse(fs.readFileSync(this.jsonFilePath, "utf-8"))).filter(x=>x[1] === value)
          
          if(returnDatas == false){
          return data.length === 0 ? false : true
          } else {          
          let obj = {}
            data.forEach(x=> {
              obj[x[0]] = x[1]
            })
            return{
              result:data.length > 0 ? true : false,
              data:obj
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
