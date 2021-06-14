const fs = require("fs");

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

    saveDataToFile() {
        writeFileWithDirs(JSON.stringify(this.data, null, 2), this.jsonFilePath);
    }

    get(key) {
        return this.data[key];
    }

    fetch(key) {
        return this.data[key];
    }

    has(key) {
        return Boolean(this.data[key]);
    }

    set(key, value) {
        this.data[key] = value;
        this.saveDataToFile();
    }

    delete(key) {
        delete this.data[key];
        this.saveDataToFile();
    }

    conc(key, count) {
        if (!this.data[key]) {
          this.data[key] = count;
        } else {
          this.data[key] += count.toString();
        }

        this.saveDataToFile();
    }

    multi(key, count) {
        if(isNaN(this.data[key]) == true){
            return("Lütfen bir sayı belirtin.")
        }
        if (!this.data[key]) {
          this.data[key] = count;
        } else {
          this.data[key] *= count;
        }

        this.saveDataToFile();
    }

    divide(key, count) {
        if(isNaN(this.data[key]) == true){
            return("Lütfen bir sayı belirtin.")
        }
        if (!this.data[key]) {
          this.data[key] = count;
        } else {
          this.data[key] /= count;
        }

        this.saveDataToFile();
    }

    sum(key, count) {
        if(isNaN(this.data[key]) == true){
            return("Lütfen bir sayı belirtin.")
        }
        if (!this.data[key]) {
          this.data[key] = +count;
        } else {
          this.data[key] += count;
        }

        this.saveDataToFile();
    }

    sub(key, count) {
        if(isNaN(this.data[key]) == true){
            return("Lütfen bir sayı belirtin.")
        }
        if (!this.data[key]) {
          this.data[key] = -count;
        } else {
          this.data[key] -= count;
        }

        this.saveDataToFile();
    }

    push(key, element) {
        if (!this.data[key]) this.data[key] = [];
        this.data[key].push(element);
        this.saveDataToFile();
    }


    clear() {
        this.data = {};
        this.saveDataToFile();
    }
    
       math(key , islem , key2) {
        if(!key) throw TypeError("Birinci Sayıyı Gir!")
        if(!key2) throw TypeError("İkinci Sayıyı Gir!")
        if(!islem) throw TypeError("İşlemi Gir!")
        let sayı = parseInt(key)
        let sayı2 = parseInt(key2)       
        if(islem=="+") {
        return sayı + sayı2}     
        if(islem=="-") {
        return sayı - sayı2}       
        if(islem=="*") {
        return sayı * sayı2}
        if(islem==":") {
        return sayı / sayı2}
        if(islem=="x") {
        return sayı / sayı2}
        if(islem=="/") {
        return sayı / sayı2}
        else {
        throw Error("Tanımsız İşlem!")}}
};

