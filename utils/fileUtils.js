const fs = require('fs');
const path = require('path');
const dirname = require('path').dirname;
const mkdirp = require('mkdirp');


module.exports =  class DataSystem {
    constructor(props) {
        this.data_file = path.join(__dirname, props.data_file);
        try {
            this.data = JSON.parse(fs.readFileSync(this.data_file, {encoding: 'utf-8'}));
        } catch (e) {
            console.error(e);
        }
    }
    saveData(){
        fs.writeFileSync(this.data_file, JSON.stringify(this.data), 'utf8');
    }
    getItem(key){
        return this.data[key];
    }
    setItem(key,value){
        this.data[key] = value;
        this.saveData();
    }

};