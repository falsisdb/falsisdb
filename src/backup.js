const fs = require("fs")
const path = require("path")
const EventEmitter = require("events")
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

class Backup extends EventEmitter {
  constructor(opts) {
    super();
    const db = require("./index.js")
    this.path = opts.path || false;
    this.time = opts.time || 5;
    this.logging = opts.logging;
    this.backupkeys = [];
    this.backupvalues = [];
    this.backupcount = "0";
    this.backupdata = {};
    this.bdata = {};
    this.lastBackupData = {};
    this.dataStore = {};

    if(!fs.existsSync(this.path) || !fs.lstatSync(this.path).isFile()) {
      writeFileWithDirs("", this.path)
        }
    this.lastBackupData.backupDB = new db({
      filePath:"./falsisdb/backupData.json"
    })
    this.getBackupData = () => {
        let res = {}; Object.entries(JSON.parse(fs.readFileSync(this.path, "utf-8"))).map(x=>Object.entries(x[1].data)).forEach(x=> {
          x.forEach(u => {
            res[u[0]] = u[1]
          })
        
        })
        return res
      }
    /*this.lastBackupData.backupDB.ayarla = (key,value) => {
      const data = this.lastBackupData.backupDB.data.lastData[key] = value 
        writeFileWithDirs(JSON.stringify(data, null, 2), this.lastBackupData.backupDB.jsonFilePath);
    }*/
    
      if(fs.readFileSync(this.path,"utf-8") == "") {
        fs.writeFileSync(this.path, "{}","utf-8")
      } else if(fs.readFileSync("./falsisdb/backupData.json","utf-8") == "{}") {
        this.lastBackupData.backupDB.set("backupcount","0")
        this.lastBackupData.backupDB.set("count","0")
        this.lastBackupData.backupDB.set("lastData",{})        
      }
if(!this.lastBackupData.backupDB.get("backupcount") || isNaN(this.lastBackupData.backupDB.get("backupcount"))) {
this.lastBackupData.backupDB.set("backupcount", "0") 
    
      } 
          if(this.lastBackupData.backupDB.get("count") === undefined || isNaN(parseInt(this.lastBackupData.backupDB.get("count")))) {
this.lastBackupData.backupDB.set("count", "0")
      }
          if(this.lastBackupData.backupDB.get("lastData") === undefined) {
        this.lastBackupData.backupDB.set("lastData", {})
      } 
        this.backupcount = this.lastBackupData.backupDB.get("backupcount")
        if(Object.entries(JSON.parse(fs.readFileSync(this.path, "utf-8"))).length != 0){
   this.backupdata = JSON.parse(fs.readFileSync(this.path, "utf-8"))
      
    }
  if(Object.entries(this.backupdata).length != 0){  
      this.backupkeys = Object.entries(this.getBackupData()).map(x=>x[0])
      this.backupvalues = Object.entries(this.getBackupData()).map(x=>x[1])
        }
  }

  sendBackup(key,value) {
       if(!arrayIncludes(this.backupkeys, key) && !arrayIncludes(Object.entries(this.lastBackupData.backupDB.get("lastData")).length == 0 ? [] : Object.entries(this.lastBackupData.backupDB.get("lastData")).map(x=>x[0]),key)){
         this.setLastData(key,value)
         this.increaseBackupCount()
          } 

          if(this.lastBackupData.backupDB.all().lastData[key] != undefined && this.lastBackupData.backupDB.all().lastData[key] != value /*&& Object.entries(this.getBackupData()).filter(x=>arrayIncludes(x,key) && arrayIncludes(x,value)).length == 0*/){
         this.setLastData(key,value)
         this.increaseBackupCount()
          }
    if(this.lastBackupData.backupDB.get("lastData")[key] ? (this.lastBackupData.backupDB.get("lastData")[key] != value ? true : false) : true){
      if(this.getBackupData()[key] != value){
        if(this.getBackupData()[key] != undefined){
      this.setLastData(key,value)
      this.increaseBackupCount()
        }
      }
    }
          //console.log(Object.entries(this.dataStore))//console.log(Object.entries(this.dataStore))
//console.log(Object.entries(data))   
  

          //console.log(Object.entries(this.backupdata))      
    
          if(this.backupcount == this.time/*&& Object.entries(this.dataStore).length != 0*/){
            this.backupcount = 0;
            this.lastBackupData.backupDB.set("backupcount","0")
             // if(Object.entries(this.dataStore).length != 0){      
              this.bdata[`Back-Up-${this.lastBackupData.backupDB.get("count")}`] = {
                date: formatDate(new Date()),
                data:this.lastBackupData.backupDB.get("lastData")
              }
                this.backup()
            if(this.logging === true) {
                console.log("📝 Falsisdb Bilgilendirme: Yedekleme Alındı. Yedek ismi: Back-Up-" + this.lastBackupData.backupDB.get("count") + ".")
            }
this.emit("backup", {
  lastData:this.lastBackupData.backupDB.get("lastData")   
    })
this.clearLastData()
this.increaseCount()
                if(Object.entries(this.backupdata).length != 0){  
      this.backupkeys = Object.entries(this.getBackupData()).map(x=>x[0])

      this.backupvalues = Object.entries(this.getBackupData()).map(x=>x[1])

        }
          //  }
            
          }
  }
  
  backup() {
    const name = Object.entries(this.bdata)[Object.entries(this.bdata).length == 0 ? 0 : Object.entries(this.bdata).length - 1][0]
      const inside = Object.entries(this.bdata)[Object.entries(this.bdata) == 0 ? 0 : Object.entries(this.bdata).length - 1][1]
      const backupData = Object.entries(JSON.parse(fs.readFileSync(this.path, "utf-8"))).length == 0 ? {} : Object.entries(JSON.parse(fs.readFileSync(this.path, "utf-8")))[0]
      const data = JSON.parse(fs.readFileSync(this.path, "utf-8"))
      data[name] = inside
      //console.log(data)
        fs.writeFileSync(this.path,JSON.stringify(data,null,2),"utf-8")
  }
  clearLastData() {
    this.lastBackupData.backupDB.set("lastData",{})
  }

  
  increaseCount() {   this.lastBackupData.backupDB.set("count",String(parseInt(this.lastBackupData.backupDB.get("count"))+1))
  }
  
  increaseBackupCount() {
    this.backupcount = String(parseInt(this.backupcount)+1)
this.lastBackupData.backupDB.set("backupcount",String(parseInt(this.lastBackupData.backupDB.get("backupcount"))+1))

 this.backupcount = this.lastBackupData.backupDB.get("backupcount")
  }
  setLastData(key,value) {
    const o = this.lastBackupData.backupDB.get("lastData")
o[key]=value
          this.lastBackupData.backupDB.set("lastData",o)
  }
}

module.exports = Backup;
