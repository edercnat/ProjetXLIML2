//-----------------------------------------------
//  Variables globales
//-----------------------------------------------
//Variables de test et globales
const date = new Date("2026-06-08T13:10:39.688Z");
const regexp = new RegExp("mot");
const chaine = "chaine";
const symbol =  Symbol("symbol");
const erreur = new Error("Erreur de chad", {cause : "rémi le goat"});
const set = new Set(["Vallet", "Dame", "Roi"]);

//Classe de test
class Test {
    constructor(nomP, prenomP) {
        this.nom = nomP;
        this.prenom = prenomP;
        this.age = 0;
        this.poches = new Map([["Cartes", set], ["Aura", Infinity]]);
        this.dateNaissance = date;
        this.typesSpeciaux = [symbol, erreur, chaine, regexp, NaN, 200n, null, undefined];
        this.objet = {"nom" : "pierre"};
        this.bool = true;
        this.liste = [1,2,3,4];
    }

    fonctionIgnoree(){
        return "rien";
    }

    fonctionInutile(){
        console.log("Je sers à rien");
    }

}



class testSimple{
    constructor(){
        this.nom = "tra";
        this.prenom = "lala";
    }
}



const obj = {
    "nom" : "tom",
    "prenom" : "popo",
    "age" : 2,
    "date" : date,
    "num" : NaN,
    "bigint" : 2314n,
    "set" : set
}