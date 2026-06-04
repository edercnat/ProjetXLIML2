class Personnage {
    constructor(pseudo, niveau, classeArmure) {
        this.pseudo = pseudo;
        this.niveau = niveau;
        this.classeArmure = classeArmure;
    }
    test()
    {
        console.log('Hello world');
    }
}
const map = new Map();
map.set('key', 'valeur');
const v8 = require('v8');
const hero = new Personnage("Arthur", 10, 5);
const date = new Date();
const bint = BigInt(123);
const intt = Infinity;
const test = new Set();
test.add(Infinity);
console.log(test);
const buffer = v8.serialize(test);

console.log(buffer);
console.log(typeof buffer);

const bufferS = JSON.stringify(buffer);
console.log(bufferS);

const bufferR = JSON.parse(bufferS);

const vBuffer = Buffer.from(bufferR.data);
const objetReconstruit = v8.deserialize(vBuffer);

console.log(hero);

console.log(objetReconstruit);



/*
const dateV = date.valueOf();
console.log(dateV);
console.log(typeof dateV);


//Object.setPrototypeOf(dateV, Object.getPrototypeOf(date));
const dateR = new Date(dateV);


console.log(dateR);
console.log(typeof dateR);


console.log(hero.constructor);
console.log(Object.getPrototypeOf(hero));
*/
