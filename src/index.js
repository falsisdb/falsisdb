const fs = require("fs");
let check;
let dataCode;
let deleteEventCheck;
let deleteEventCode;
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
        this.jsonFilePath = filePath || "./db.json";
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
        if(!key) throw Error("Getirilicek Veriyi Gir!")
        return this.data[key];
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
        if(!key) throw Error("Değiştirilicek Veriyi Gir!")
        if(!value) throw Error("Değişicek Veriyi Gir!")
        this.data[key] = value;
        this.kaydet();
          if(check === true){
          eval(dataCode)
        }
    }

    delete(key) {
        if(!key) throw Error("Silinicek Veriyi Gir!")  
        delete this.data[key];
        this.kaydet();
          if(deleteEventCheck === true){
          eval(deleteEventCode)
        }
    }

    conc(key, count) {
        if(!key) throw Error("Ekleme Yapılacak Veriyi Gir!")
        if(!count) throw Error("Eklenecek Veriyi Gir!")
        if (!this.data[key]) {
          this.data[key] = count;
        } else {
          this.data[key] += count.toString();
        }

        this.kaydet();
                        if(addfunc){ 
        eval(addfunc)  //dataAdd event created by lunex
        }
    }

    multi(key, count) {
        if(!key) throw Error("Silinme Yapılacak Veriyi Gir!")
        if(!count) throw Error("Silinecek Veriyi Gir!")
        if(isNaN(this.data[key]) == true){
            return("Lütfen bir sayı belirtin.")
        }
        if (!this.data[key]) {
          this.data[key] = count;
        } else {
          this.data[key] *= count;
        }

        this.kaydet();
    }

    divide(key, count) {
        if(!key) throw Error("Bölünme Yapılacak Veriyi Gir!")
        if(!count) throw Error("Bölünecek Veriyi Gir!")
        if(isNaN(this.data[key]) == true){
            return("Lütfen bir sayı belirtin.")
        }
        if (!this.data[key]) {
          this.data[key] = count;
        } else {
          this.data[key] /= count;
        }

        this.kaydet();
    }

    sum(key, count) {
        if(!key) throw Error("Ekleme Yapılacak Veriyi Gir!")
        if(!count) throw Error("Eklenecek Veriyi Gir!")
        if(isNaN(this.data[key]) == true){
            return("Lütfen bir sayı belirtin.")
        }
        if (!this.data[key]) {
          this.data[key] = +count;
        } else {
          this.data[key] += count;
        }

        this.kaydet();
    }

    sub(key, count) {
        if(!key) throw Error("Çıkarma Yapılacak Veriyi Gir!")
        if(!count) throw Error("Çıkarılıcak Veriyi Gir!")
        if(isNaN(this.data[key]) == true){
            return("Lütfen bir sayı belirtin.")
        }
        if (!this.data[key]) {
          this.data[key] = -count;
        } else {
          this.data[key] -= count;
        }

        this.kaydet();
    }

    push(key, element) {
        if(!key) throw Error("Array Adını Gir!")
        if(!element) throw Error("Array Verisini Gir!")
        if (!this.data[key]) this.data[key] = [];
        this.data[key].push(element);
        this.kaydet();
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
            if(!key) throw Error("Max Kaç Olubileceğini Gir!")
            return Math.floor((Math.random() * key) + 1);
        }
}
