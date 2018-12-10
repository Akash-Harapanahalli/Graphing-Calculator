import math from "mathjs"

export default class Mu {
    constructor(){
        this.cache;
        this.pull();
    }

    pull() {
        this.cache = JSON.parse(localStorage.getItem("mu"));
        if(this.cache == undefined){
            this.cache = {};
        }
    }

    push() {
        localStorage.setItem("mu", JSON.stringify(this.cache));
    }

    evaluate(_1, _2 = {})  {
        let key = JSON.stringify(_2);
        if(this.cache[_1] == undefined){
            this.cache[_1] = {};
        }
        if(this.cache[_1][key] == undefined){
            this.cache[_1][key] = math.eval(_1, _2);
        }
        return this.cache[_1][key];
    }
}