export {serialize, deserialize}
const DictionnairePrototypes = {};
let buffer = new Map();
let compteur = 0;

//-----------------------------------------------
//  Variables globales
//-----------------------------------------------

//Fonction qui check si le prototype est déjà stocké dans le dico
function estDejaStocke(name, dico){
    for(const clef in dico){
        if(clef == name){
            return true;
        }
    }
    return false;
}


function replacer(clef, valeur){
    const objetOriginal = this[clef];
    //Si c'est nul et undefined, on renvoie la chaîne de caractères pour ne pas les ignorer et éviter les erreurs
    if(objetOriginal === null){
        return "__tycle_null";
    }
    else if(objetOriginal === undefined){
        return "__tycle_undefined";
    }
    else if(Object.is(objetOriginal,-0)){
        return "__tycle_minus_zero";
    }
    //Si la valeur n'est pas stockée dans notre registre des constructeurs, on l'ajoute
    if(!estDejaStocke(this[clef].constructor.name, DictionnairePrototypes)){
        DictionnairePrototypes[objetOriginal.constructor.name] = objetOriginal.constructor;
    }
    //console.log("Sérialisation :", objetOriginal.constructor.name, clef, valeur);

    
    //Parfois valeur est déjà sérialisée (par exemple déjà en string pour une date)
    //On utilise donc this[clef] (this représentant l'objet parent) pour récupérer la valeur non sérialisée
    let valRetour = valeur;


        
    //Nos types primitifs sont les strings, listes et les objets de type dictionnaire.
    //On ne les traite donc pas
    //Condition peut être utile plus tard : Object.prototype.toString.call(objetOriginal) != "[object Object]"
    if(typeof objetOriginal != "string" && !Array.isArray(objetOriginal) && objetOriginal.constructor.name != "Object" && objetOriginal.constructor.name != "Boolean"){


        

        //Si la valeur n'est pas déjà sous forme {
        //     "constructeur" : constructeur,
        //     "valeur" : valeur originale
        // }
        //On le met sous cette forme avec 
        if(clef !== "__tycle_value" && clef !== "__tycle_prototype"){
            valRetour = {
                "__tycle_prototype" : objetOriginal.constructor.name,
                "__tycle_value" : objetOriginal
            }
        }
        
        //Si on est dans une valeur à traiter (donc avec la clef "valeur"), on la traite selon ce que l'on veut
        else if(clef === "__tycle_value"){

            let valSerialisee = Array.from(objetOriginal);
            //Si on peut la convertir en liste
            if(valSerialisee.length > 0){
                valRetour = valSerialisee;
            }
            //Sinon, on sérialise tout le reste sauf les object de type dictionnaire et les classes
            if(valSerialisee.length == 0 && Object.prototype.toString.call(objetOriginal) != "[object Object]"){
                if(objetOriginal.constructor.name === "Symbol"){
                    valRetour = objetOriginal.description;
                }
                else{
                    valRetour = valeur.toString();
                }
            }
        }
    }
    //On sérialise seulement les objets
    if(clef !== "__tycle_value" && clef !== "__tycle_prototype" && typeof objetOriginal === "object") {
        //Si on référence une valeur déjà enregistrée
        if(buffer.has(objetOriginal)) {
            return buffer.get(objetOriginal);
        } 
        //Sinon on l'ajoute au registre
        else {
            buffer.set(objetOriginal, ("__tycle_ref_" + compteur));
            compteur++;
        }
    }    
    return valRetour;
}

function reviver(clef, valeur){   
    //Permet de gérer les valeurs null et undefined
    if(valeur === "__tycle_null"){
        return null;
    }
    else if(valeur === "__tycle_undefined"){
        return undefined;
    }
    else if(valeur === "__tycle_minus_zero"){
        return -0;
    }
    let valRetour = valeur;

    //Si la valeur a été sérialisée par nos soins
    if(valeur["__tycle_value"] && typeof valeur === "object"){
        const prototypeString = valeur["__tycle_prototype"];
        const valeurBrute = valeur["__tycle_value"];
        const constructeur = DictionnairePrototypes[prototypeString];

        if(!constructeur){
            console.log(`Erreur dans reviver pour le constructeur de ${prototypeString}, il n'est pas défini`);
            return valeurBrute;
        }

        try{
            if(prototypeString === "Number" || prototypeString === "BigInt" || prototypeString === "Symbol"){
                valRetour = DictionnairePrototypes[prototypeString](valeurBrute);
            }
            else{
                //Si c'est une classe
                if(typeof valeurBrute === "object" && prototypeString != "Map" && prototypeString != "Set"){
                    valRetour = Object.create(DictionnairePrototypes[prototypeString].prototype);
                    Object.assign(valRetour, valeurBrute);
                }
                else{
                    valRetour = new DictionnairePrototypes[prototypeString](valeurBrute);
                }

            }
        }
        catch(err){
            console.error(`Échec critique lors de l'instanciation de ${prototypeString} :`, err.message);
            return valeurBrute;
        }
        
    }
    return valRetour;
}

function serialize(obj){
    buffer.clear();
    compteur = 0;
    return JSON.stringify(obj, replacer, 2);
}

//Fonction qui permet de remplacer les références par les objets référencés
function remplacementReference(obj){
    let valRetour = obj;
    //Si c'est un objet référençable, on l'ajoute au buffer et on augmente le compteur
    if(typeof valRetour == "object" && valRetour != null ){
        buffer.set(("__tycle_ref_" + compteur), valRetour);
        compteur++;
        //On rappelle la fonction sur chacun de ses fils
        for(const fils in valRetour){
            valRetour[fils] = remplacementReference(valRetour[fils]);
        }
    }
    else if(typeof valRetour === "string" && valRetour.includes("__tycle_ref_")){
        valRetour = buffer.get(valRetour);
    }

    return valRetour;
}
function deserialize(chaineJSON){    
    //Resérialisation des objets qui ne sont pas référencés
    buffer.clear();
    compteur = 0;
    let objRetour = JSON.parse(chaineJSON, reviver);
    return remplacementReference(objRetour);
}