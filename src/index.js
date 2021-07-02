const fs = require("fs");
let clearfunc;
let check;
let dataCode;
let deleteEventCheck;
let deleteEventCode;
let data;
let type;

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

module.exports = class database {
    constructor(filePath) {
        this.jsonFilePath = filePath || "./falsisdb/database.json";
        this.data = {};

        if (!fs.existsSync(this.jsonFilePath) || !fs.lstatSync(this.jsonFilePath).isFile()) {
            writeFileWithDirs("{}", this.jsonFilePath);
        } else {
            this.fetchDataFromFile();
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
    
    
    on(event = {
      type: new String(),
      status: new String(),
      code: new String()
    }) {
      if(event.type === "ready" && event.status === "aktif"){
        eval(event.code)
      } else if(event.type === "dataSet" && event.status === "aktif"){
        check = true;
        dataCode = event.code;
      } else if(event.type === "dataDelete" && event.status === "aktif"){
       deleteEventCheck = true
       deleteEventCode = event.code
      }
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

    has(key) {
        if(!key) throw Error("Şartlanacak Veriyi Gir!")
        return Boolean(this.data[key]);
    }

    set(key, value) {
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
          if(check === true){
          eval(dataCode.replace("%key%", key).replace("%value%", value))
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
          if(deleteEventCheck === true){
          eval(deleteEventCode.replace("%key%", key).replace("%value%", val))
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
            type:"database",
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
}  
