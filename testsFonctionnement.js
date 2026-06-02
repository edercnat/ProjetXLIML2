const objTest = {
    "Clef1" : "val1",
    "Clef2" : "val2",
    "Date" : new Date()
}

const date = new Date();

function pasTraiterNativement(objet){
    return typeof objet == "object" && objet.constructor.name != "Object"
}

function replacer(clef, valeur){
    if(pasTraiterNativement(this[clef])){
        console.log("DATE");
    }
    //console.log("clef:", clef,"\n valeur :", valeur,"\n this : ",this);
    //console.log(this[clef].constructor.name, valeur.constructor.name);
}


JSON.stringify(date, replacer);
console.log(typeof date, date.constructor.name);