const objTest = {
    "Clef1" : "val1",
    "Clef2" : "val2",
    "Date" : new Date()
}

const date = new Date(8.64e15);

function replacer(clef, valeur){
    if(pasTraiterNativement(this[clef])){
        console.log("DATE");
    }
    //console.log("clef:", clef,"\n valeur :", valeur,"\n this : ",this);
    //console.log(this[clef].constructor.name, valeur.constructor.name);
}


//JSON.stringify(date, replacer);
//console.log(typeof date, date.constructor.name);

//console.log(JSON.stringify(date));

//console.log(typeof true, typeof 1, typeof "lala", typeof [1,2]);


function estTraiteNativement(obj){
    return typeof obj == "string" || 
    (typeof obj == "number" && isFinite(obj) && !isNaN(obj))||
    typeof obj == "boolean" ||
    typeof obj == "object" && obj.constructor.name == "Object";
}

console.log(estTraiteNativement(NaN));

//console.log(objTest.toString());
//console.log(isFinite("lala"));

const aaaa = 2;
console.log(Object.entries(aaaa));

