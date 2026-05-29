class Test {
    constructor() {
        this.age = 20;
        this.taille = 1.8;
        this.name = "Laurent";
    }

    nom(){
        return this.name;
    }
}

const test1 = new Test();
const test2 = {"lala": 2};

function objOfClass(c) {
    let obj = {};
    // Récupère les propriétés de l'instance (age, taille, name)
    obj["Attributs"] = Object.getOwnPropertyNames(c);
    // Récupère les méthodes/getters du prototype (constructor, nom)
    obj["Methodes"] = Object.getOwnPropertyNames(Object.getPrototypeOf(c));
    return obj;
}

function estUneClasse(obj) {
    if (typeof obj !== "object" || obj === null) {
        return false;
    }
    // Correction ici : utilisation de .constructor (en anglais)
    return obj.constructor !== Object;
}

function replacer(clef, val) {
    // Attention : lors du premier passage, JSON.stringify analyse l'objet global 
    // sous une clé vide "". Nous devons traiter la valeur d'origine.
    if (clef === "") return val; 
    if (estUneClasse(val)) {
        return objOfClass(val);
    }
    return val;
}

console.log(JSON.stringify(test1, replacer, 2));