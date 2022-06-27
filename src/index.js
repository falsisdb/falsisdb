const fs = require("fs");
const path = require("path");

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

const arrayIncludes = (array,input) => {
  let res;
  for(const i of array){
    if(i == input){
      res = true 
      break;
    } else{res=false;continue}
  }
  return res
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
    if(fs.existsSync(__dirname.slice(0, -4) + "/falsisdb/development.json") == false) {
      writeFileWithDirs(`{"backupcount": 0}`,  __dirname.slice(0, -4) + "/falsisdb/development.json")
    }
    this.data = {};
    this.lastData = null;
    this.lastDataType = null;
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
    this.backupcount = "0";
    this.backupdata = {};
    this.eventsArray = [];
    this.bdata = {};
    this.lastBackupData = {}
      this.jsonFilePath = construct.filePath || "./falsisdb/database.json";
    this.dataStore = {}
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
            if(this.btype == "json") writeFileWithDirs("", this.backup)
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
            if(this.btype == "json") writeFileWithDirs("", this.backup)
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
          if(this.btype == "json") writeFileWithDirs("", this.backup)
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
          if(this.btype == "json") writeFileWithDirs("", this.backup)
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
      if(this.btype == "json") writeFileWithDirs("", this.backup)
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
    if(this.backup != false) {
      const backupDB = require("./")
      this.lastBackupData.backupDB = new backupDB({filePath:"./falsisdb/backupData.json"})
      this.getBackupData = () => {
        let res = {}; Object.entries(JSON.parse(fs.readFileSync(this.backup, "utf-8"))).map(x=>Object.entries(x[1].data)).forEach(x=> {
          x.forEach(u => {
            res[u[0]] = u[1]
          })
        
        })
        return res
      }
      if(fs.readFileSync(this.backup,"utf-8") == "") {
        fs.writeFileSync(this.backup, "{}","utf-8")
      } else if(fs.readFileSync("./falsisdb/backupData.json","utf-8") == "{}") {
        this.lastBackupData.backupDB.set("backupcount","0")
        this.lastBackupData.backupDB.set("count","0")
        this.lastBackupData.backupDB.set("lastData",{})        
      }
          /*if(!fs.existsSync("./falsisdb/backupData.json") || !fs.lstatSync("./falsisdb/backupData.json").isFile()){
            console.log("a")
        writeFileWithDirs(`{
          "backupcount":"0",
          "count":"0",
          "lastData":{}
        }`, "./falsisdb/backupData.json")
          } else*/ if(!this.lastBackupData.backupDB.get("backupcount") || isNaN(this.lastBackupData.backupDB.get("backupcount"))) {
this.lastBackupData.backupDB.set("backupcount", "0") 
    
      } 
          if(this.lastBackupData.backupDB.get("count") === undefined || isNaN(parseInt(this.lastBackupData.backupDB.get("count")))) {
this.lastBackupData.backupDB.set("count", "0")
      }
          if(this.lastBackupData.backupDB.get("lastData") === undefined) {
        this.lastBackupData.backupDB.set("lastData", {})
      } 
        this.backupcount = this.lastBackupData.backupDB.get("backupcount")
        if(Object.entries(JSON.parse(fs.readFileSync(this.backup, "utf-8"))).length != 0){
          /*console.log(this.backupdata)
          console.log(Object.entries(JSON.parse(fs.readFileSync(this.backup, "utf-8")))[0][1].data)*/
   this.backupdata = JSON.parse(fs.readFileSync(this.backup, "utf-8"))
      
    }
  if(Object.entries(this.backupdata).length != 0){  
      this.backupkeys = Object.entries(this.getBackupData()).map(x=>x[0])
    //Object.entries(JSON.parse(fs.readFileSync(this.backup,"utf-8"))).map(x=>Object.entries(x[1].data)[0][0])

      this.backupvalues = Object.entries(this.getBackupData()).map(x=>x[1])
    //Object.entries(JSON.parse(fs.readFileSync(this.backup,"utf-8"))).map(x=>Object.entries(x[1].data)[0][1])
        }
  
      //console.log(Object.entries(this.getBackupData()).filter())
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
      /*if(fs.readFileSync(this.backup) == "") {
        var a = ""
        var b = JSON.stringify(this.bdata)
      }else if(fs.readFileSync(this.backup) == "{}") {
        var a = ""
        var b = JSON.stringify(this.bdata)
      }else{
      var a = String(fs.readFileSync(this.backup)).replace(/.$/,",")
      var b = String(JSON.stringify(this.bdata).replace("{", ""))
      }
      //console.log(`${a} ve ${b}`)
      fs.writeFile(this.backup, `${a}\n${b}`, "utf-8", (err) => {
        if (err) throw err;
      });*/
      /*writeFileWithDirs(JSON.stringify(this.bdata, null, 2), this.backup);*/
      const name = Object.entries(this.bdata)[Object.entries(this.bdata).length == 0 ? 0 : Object.entries(this.bdata).length - 1][0]
      const inside = Object.entries(this.bdata)[Object.entries(this.bdata) == 0 ? 0 : Object.entries(this.bdata).length - 1][1]
      const backupData = Object.entries(JSON.parse(fs.readFileSync(this.backup, "utf-8"))).length == 0 ? {} : Object.entries(JSON.parse(fs.readFileSync(this.backup, "utf-8")))[0]
      const data = JSON.parse(fs.readFileSync(this.backup, "utf-8"))
      data[name] = inside
      //console.log(data)
        fs.writeFileSync(this.backup,JSON.stringify(data,null,2),"utf-8")
      //this.backupdata = JSON.parse(fs.readFileSync(this.backup, "utf-8"))
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
     // console.log(this.backupcount)
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
        
        /*this.lastBackupData.backupDB.set("backupcount", "0")
        this.lastBackupData.backupDB.set("count", "0")
        this.lastBackupData.backupDB.set("lastData", {})*/
      if(this.backup==false){}else {
          //this.backupdata[key] = value
          /*this.backupkeys.push(key)
          this.backupvalues.push(value)*/

   //console.log(Object.entries(this.backupdata))
              //console.log(Object.entries(this.dataStore).filter(x=>arrayIncludes(this.backupkeys,x[0])))
          //console.log(Object.entries(this.dataStore)[0])
          //console.log(Object.entries(this.backupkeys).filter(x=>arrayIncludes(Object.entries(this.dataStore)[0],x[0])))
          //console.log(arrayIncludes(Object.entries(this.lastBackupData.backupDB.get("lastData")).length == 0 ? [] : Object.entries(this.lastBackupData.backupDB.get("lastData"))[0],key))          
          //Object.entries(this.getBackupData()).filter()
     if(!arrayIncludes(this.backupkeys, key) && !arrayIncludes(Object.entries(this.lastBackupData.backupDB.get("lastData")).length == 0 ? [] : Object.entries(this.lastBackupData.backupDB.get("lastData")).map(x=>x[0]),key)){
          this.dataStore[key] = value
       const o = this.lastBackupData.backupDB.get("lastData")
    //console.log(this.dataStore)
    /*o[Object.entries(this.dataStore)[0][0]] = Object.entries(this.dataStore)[0][1]*/
          o[key] = value
            this.lastBackupData.backupDB.set("lastData",o)
       this.backupcount = String(parseInt(this.backupcount)+1)
this.lastBackupData.backupDB.set("backupcount",String(parseInt(this.lastBackupData.backupDB.get("backupcount"))+1))
          } 

          if(JSON.parse(fs.readFileSync("./falsisdb/backupData.json","utf-8")).lastData[key] != undefined && JSON.parse(fs.readFileSync("./falsisdb/backupData.json","utf-8")).lastData[key] != value && Object.entries(this.getBackupData()).filter(x=>arrayIncludes(x,key) && arrayIncludes(x,value)).length == 0){
            //console.log()
            this.dataStore[key] = value
       const o = this.lastBackupData.backupDB.get("lastData")
    
    //o[Object.entries(this.dataStore)[0][0]] = Object.entries(this.dataStore)[0][1]
            o[key]=value
          this.lastBackupData.backupDB.set("lastData",o)
       this.backupcount = String(parseInt(this.backupcount)+1)
this.lastBackupData.backupDB.set("backupcount",String(parseInt(this.lastBackupData.backupDB.get("backupcount"))+1))
          }
          //console.log(Object.entries(this.dataStore))//console.log(Object.entries(this.dataStore))
//console.log(Object.entries(data))   
  

          //console.log(Object.entries(this.backupdata))
          if(this.backupcount == this.btime && Object.entries(this.dataStore).length != 0){
            this.backupcount = 0;
            this.lastBackupData.backupDB.set("backupcount","0")
            //console.log(Object.entries(this.backupdata))
              if(Object.entries(this.dataStore).length != 0){      
              this.bdata[`Back-Up-${this.lastBackupData.backupDB.get("count")}`] = {
                date: formatDate(new Date()),
                /*keys: this.backupkeys,
                values: this.backupvalues,*/
                data:this.lastBackupData.backupDB.get("lastData")
              }
            this.yedekle();
                console.log("📝 Falsisdb Bilgilendirme: Yedekleme Alındı. Yedek ismi: Back-Up-" + this.lastBackupData.backupDB.get("count") + ".")
                this.lastBackupData.backupDB.set("lastData",{})
                this.lastBackupData.backupDB.set("count",String(parseInt(this.lastBackupData.backupDB.get("count"))+1))
                if(Object.entries(this.backupdata).length != 0){  
      this.backupkeys = Object.entries(this.getBackupData()).map(x=>x[0])

      this.backupvalues = Object.entries(this.getBackupData()).map(x=>x[1])

        }
            }
            /*else if(this.btype == "txt") {
              fs.writeFile(this.backup, `${fs.readFileSync(this.backup)}\nBack-Up-${this.bcount} | ${formatDate(new Date())} | ${this.backupkeys} | ${this.backupvalues}`, "utf-8", (err) => {
                if (err) throw err;
              });
            }*/
            
            //fs.writeFileSync(__dirname.slice(0, -4) + "/falsisdb/development.json", JSON.stringify(JSON.parse(`{"backupcount": ${Number(this.bcount) + 1}}`)))
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
    }
   get info(){
     //console.log(this.backupdata)
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
