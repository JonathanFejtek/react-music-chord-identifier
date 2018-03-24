export class BiMap{
    constructor(){
        this.kToV = new Map();
        this.vToK = new Map();
    }

    add(key,value){
        this.kToV.set(key,value);
        this.vToK.set(value,key);
    }

    getForward(key){
        return this.kToV.get(key);
    }

    getBackward(value){
        return this.vToK.get(value);
    }

    getKeys(){
        return this.kToV.keys();
    }
}