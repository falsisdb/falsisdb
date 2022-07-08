const fs = require("fs");
//const path = require("path");
const YAML = require("yaml");
const Backup = require("./backup.js")

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
    this.data = {};
    this.lastData = null;
    this.lastDataType = null;
    this.eventData = {}
    this.eventData.check = null;
    this.eventData.willBeExecutedDatas = [];
    this.eventData.deleteEventCheck = null;
    this.eventData.willBeExecutedDeleteDatas = [];
    this.eventData.backupCheck = null;
    this.eventData.willBeExecutedBackupDatas = [];
    this.constructFileType = construct.fileType || "json"
    if(!construct.fileType) {
      this.jsonFilePath = construct.filePath || "./falsisdb/database.json"
    }else{
    this.jsonFilePath = construct.fileType == "json" ? construct.filePath || "./falsisdb/database.json" : construct.fileType == "yaml" ? construct.filePath || "./falsisdb/database.yaml" : "./falsisdb/database.json"
    }
    if(this.constructFileType != this.jsonFilePath.slice("-4")) throw new Error("❌ FalsisDB Hatası: Girilen Veri Tabanı Dosyası Uzantısı ile Veri Tabanı Dosyası Türü Eşleşmiyor. Lütfen İkisini de Aynı Olacak Biçimde Değiştirin.")
    
    if (!fs.existsSync(this.jsonFilePath) || !fs.lstatSync(this.jsonFilePath).isFile()) {
          writeFileWithDirs("{}", this.jsonFilePath);
      } else {
          this.fetchDataFromFile();
      }
    setInterval(() => {
      if(this.eventData.check != null){
        for(const data of this.eventData.willBeExecutedDatas) {
        this.emit('dataSet', data)
            }
            this.eventData.check = null
            this.eventData.willBeExecutedDatas = []
              } 
          if(this.eventData.deleteEventCheck != null) {
                for(const data of this.eventData.willBeExecutedDeleteDatas) {
        this.emit('dataDelete', data)
            }
            this.eventData.deleteEventCheck = null
           this.eventData.willBeExecutedDeleteDatas = []
          }

      if(this.eventData.backupCheck != null) {
            for(const data of this.eventData.willBeExecutedBackupDatas) {
        this.emit('backup', data)
            }
            this.eventData.backupCheck = null
            this.eventData.willBeExecutedBackupDatas = []
          }
        }, construct.eventInterval || 100)
        let log;
        if(construct.backup){
          if(construct.backup.logging == true){
          log=true
        } else if(construct.backup.logging == false){
          log=false
        } else {
            log=true
          }
        }
        if(construct.backup && construct.backup.path) {
          this.backup = new Backup({
            path:construct.backup.path,
            time:construct.backup.time || 5,
            logging:log
          })
          this.backup.on("backup",(data) => {
            this.eventData.backupCheck = data;
            this.eventData.willBeExecutedBackupDatas.push(data)
          })
          this.lastBackupData = {}
          this.lastBackupData.backupDB = this.backup.lastBackupData.backupDB
      this.getBackupData = () => {
        let res = {}; Object.entries(JSON.parse(fs.readFileSync(this.backup.path, "utf-8"))).map(x=>Object.entries(x[1].data)).forEach(x=> {
          x.forEach(u => {
            res[u[0]] = u[1]
          })
        
        })
        return res
      }
      /*function set(key,value) {
      console.log(key + "  " + value)
      this.lastBackupData.backupDB.data.lastData[key] = value 
        writeFileWithDirs(JSON.stringify(this.lastBackupData.backupDB.data, null, 2), this.lastBackupData.backupDB.jsonFilePath);
    }*/
    //console.log(set)
   // this.lastBackupData.backupDB.set = set
    }
  }
  

  fetchDataFromFile() {
    let savedData;
    try {
      savedData = JSON.parse(fs.readFileSync(this.jsonFilePath));
    } catch(error) {}

    this.data = savedData;
}

kaydet(key,value,type) {
    writeFileWithDirs(JSON.stringify(this.data, null, 2),this.jsonFilePath);
  if(this.backup && !(type == "clear" || type == "delete")) {
  //this.backup.dataStore[key] = value
  this.backup.sendBackup(key,value)
  }
}
    get(key) {
        if(!key) {
          throw Error("❌ FalsisDB Hatası: Veri Tabanından Çekilecek Veri Bulunamadı. Lütfen Çekmek İstediğiniz Veriyi Girin.")
        } else {
          if(this.constructFileType == "yaml"){
            let arr = YAML.parse(fs.readFileSync(this.jsonFilePath, 'utf-8'))
            return Object.entries(arr).filter(x=>Object.entries(x[1])[0][0] == key)[0][1][key]
          }else{
        return this.data[key];
          }
     }
    }
    has(key, returnDatas=false) {
        if(!key) throw Error("❌ FalsisDB Hatası: Veri Tabanında Varlığı Kontrol Edilecek Veri Bulunamadı. Lütfen Şartlanacak Veriyi Girin.")
     // this.fetchDataFromFile()

        if(returnDatas === false){
          if(this.constructFileType == "yaml"){
            let arr = YAML.parse(fs.readFileSync(this.jsonFilePath, 'utf-8'))
            return Boolean(Object.entries(arr).filter(x=>Object.entries(x[1])[0][0] == key)[0] == undefined ? false : true)
          }else{
        return Boolean(this.data[key]);
          }
        } else {
          if(this.constructFileType == "yaml"){
            let arr = YAML.parse(fs.readFileSync(this.jsonFilePath, 'utf-8'))
            let result = Boolean(Object.entries(arr).filter(x=>Object.entries(x[1])[0][0] == key)[0] == undefined ? false : true)
            let data = Object.entries(arr).filter(x=>Object.entries(x[1])[0][0] == key)[0] == undefined ? null : Object.entries(arr).filter(x=>Object.entries(x[1])[0][0] == key)[0][1][key]
            let obj = {}
            obj["key"] = key 
            obj["value"] = data
            return{
              result: result,
              data: obj
            }
          }else{
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
    }

    set(key, value) {
      if(this.constructFileType == "yaml"){
        if(!key) {
          throw Error("❌ FalsisDB Hatası: Veri Tabanı Dosyasına Eklenecek Veri Bulunamadı. Lütfen Eklemek İstediğiniz Verinin İsmini Girin.")
        }else if(!value) {
          throw Error("❌ FalsisDB Hatası: Veri Tabanı Dosyasına Eklenecek Veri Bulunamadı. Lütfen Eklemek İstediğiniz Verinin Değerini Girin.")
        } else{
          if(String(fs.readFileSync(this.jsonFilePath, 'utf-8')) == "{}") {
            fs.writeFileSync(this.jsonFilePath, `- ${key}: ${value}`)
          }else{
            let arr = YAML.parse(fs.readFileSync(this.jsonFilePath, 'utf-8'))
           // console.log(Object.entries(arr).filter(x=>Object.entries(x[1])[0][0] == key)[0] == undefined)
            if(Object.entries(arr).filter(x=>Object.entries(x[1])[0][0] == key)[0] == undefined){
            fs.writeFileSync(this.jsonFilePath, `${fs.readFileSync(this.jsonFilePath, 'utf-8')}\n- ${key}: ${value}`)
            }else{
              if(Object.entries(arr).filter(x=>Object.entries(x[1])[0][0] == key)[0][1][key] != value) {
              fs.writeFileSync(this.jsonFilePath, `${String(fs.readFileSync(this.jsonFilePath, 'utf-8')).replace("- " + key + ":" + Object.entries(arr).filter(x=>Object.entries(x[1])[0][0] == key)[0][1][key], "- " + key + ":" + value)}`)
              }
            }
          }
        }
      }else{
     // console.log(this.backupcount)
       const old = this.data[key]
        if(!key) {
          throw Error("❌ FalsisDB Hatası: Veri Tabanı Dosyasına Eklenecek Veri Bulunamadı. Lütfen Eklemek İstediğiniz Verinin İsmini Girin.")
        }
        else if(!value) {
          throw Error("❌ FalsisDB Hatası: Veri Tabanı Dosyasına Eklenecek Veri Bulunamadı. Lütfen Eklemek İstediğiniz Verinin Değerini Girin.")
        } else {
        this.data[key] = value;
        this.kaydet(key,value, 'set');
        const data = {
          key: key,
          changed: old == undefined ? false : this.data[key] == old ? false : true,
          oldValue: old,
          value: value
        }
        this.eventData.check = data
        this.eventData.willBeExecutedDatas.push(data)
          //console.log(this.check)
        
        /*this.lastBackupData.backupDB.set("backupcount", "0")
        this.lastBackupData.backupDB.set("count", "0")
        this.lastBackupData.backupDB.set("lastData", {})*/
        }
      }
    }

    delete(key) {
      if(this.constructFileType == "yaml"){
        /*let arr = YAML.parse(fs.readFileSync(this.jsonFilePath, 'utf-8'))
        if(!key) {
          throw Error("❌ FalsisDB Hatası: Veri Tabanı Dosyasınan Silinmek İstenen Veri Bulunamadı. Lütfen Silinecek Veriyi Girin.")
        }else{
          if(Object.entries(arr).filter(x=>Object.entries(x[1])[0][0] == key)[0] == undefined){
            throw Error("❌ FalsisDB Hatası: Silmeye Çalıştığınız Veri Zaten Veri Tabanı Dosyasında Bulunmuyor.")
          }else{
        let val = Object.entries(arr).filter(x=>Object.entries(x[1])[0][0] == key)[0][1][key]
        fs.writeFileSync(this.jsonFilePath, `${String(fs.readFileSync(this.jsonFilePath, 'utf-8')).replace("- " + key + ":" + val, "")}`)
        this.deleteEventCheck = {
          key: key,
          value: val
        }
        this.willBeExecutedDeleteDatas.push(this.deleteEventCheck)
          }
        }*/
      }else{
      const val = this.data[key]
        if(!key) {
          throw Error("❌ FalsisDB Hatası: Veri Tabanı Dosyasınan Silinmek İstenen Veri Bulunamadı. Lütfen Silinecek Veriyi Girin.")
        } else {
        delete this.data[key];
        this.kaydet(undefined,undefined,"delete");
        this.eventData.deleteEventCheck = {
          key: key,
          value:val
        }
        this.eventData.willBeExecutedDeleteDatas.push(this.eventData.deleteEventCheck)
        }
    }
  }//daha sonra YAML eklenecek

    conc(key, count) {
        if(!key) {
          throw Error("❌ FalsisDB Hatası: Veri Tabanında Üzerine Ekleme Yapılmak İstenen Veri Bulunamadı. Lütfen Ekleme Yapmak İstediğiniz Verinin İsmini Girin.")
        }
        if(!count) {
          throw Error("❌ FalsisDB Hatası: Verinin Üzerine Eklemek İstediğiniz Değer Bulunamadı. Lütfen Ekleme Yapmak İstediğiniz Verinin İsmini Girin.")
        }
        if (!this.data[key]) {
          this.data[key] = count;
          this.kaydet(key,this.data[key])
          this.lastData = count;
          this.lastDataType = "conc"
          return;
        }
        if(typeof this.data[key] == 'string' && isNaN(parseInt(this.data[key])) == false){
          const val = String(parseInt(this.data[key])+parseInt(count));
           this.data[key]=val
           this.kaydet(key,this.data[key]);
         }
         else {
             this.data[key] += count;
             this.kaydet(key,this.data[key]);
           } 
   
   
        this.lastData = count;
        this.lastDataType = "conc"
    }//daha sonra YAML eklenecek

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
          this.lastData = count;
          this.lastDataType = "multi"
          this.kaydet(key,this.data[key]);
          return;
        } else {
          const val = String(parseInt(this.data[key])*parseInt(count));
          this.data[key]=val
        }
        this.lastData = count;
        this.lastDataType = "multi"
        this.kaydet(key,this.data[key]);
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
          this.lastData = count;
          this.lastDataType = "divide"
          this.kaydet(key,this.data[key]);
          return;
        } else {
          const val = String(parseInt(this.data[key])/parseInt(count));
          this.data[key]=val
        }
        this.lastData = count;
        this.lastDataType = "divide"
        this.kaydet(key,this.data[key]);
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
          this.lastData = count;
          this.lastDataType = "sum"
          this.kaydet(key,this.data[key]);
          return;
        } else {
          const val = String(parseInt(this.data[key])+parseInt(count));
       this.data[key]=val
        }
        this.lastData = count;
        this.lastDataType = "sum"
        this.kaydet(key,this.data[key]);
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
          this.lastData = count;
          this.lastDataType = "sub"
          this.kaydet(key,this.data[key])
          return;
        } else {
          const val = String(parseInt(this.data[key])-parseInt(count));
          this.data[key]=val
        }
        this.lastData = count;
        this.lastDataType = "sub"
        this.kaydet(key,this.data[key]);
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
          this.lastData = element;
          this.lastDataType = "push"
          this.kaydet(key,this.data[key])
          return;
        }
        if(!Array.isArray(this.data[key])){
          throw Error("❌ FalsisDB Hatası: Veri Tabanında Üzerine Değer Eklemek İstediğiniz Veri Array Değil. Lütfen Veriyi Array Formatında Olacak Biçimde Değiştirin.")
        } else {
        this.data[key].push(element)
        this.kaydet(key,this.data[key]);
        this.lastData = element;
        this.lastDataType = "push"
        }
      }


    clear() {
        this.data = {};
        this.kaydet(undefined,undefined,"clear");
    }
   get info(){
     //console.log(this.backupdata)
        return{
            name: "falsisdb",
            type: this.constructFileType == "json" ? "JSONDatabase" : this.constructFileType == "yaml" ? "YAMLDatabase" : "FalsisDB",
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
module.exports =  database;