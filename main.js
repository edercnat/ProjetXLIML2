const strategiesNatives = {
    'Date': (valeur) => ({ __type: 'Date', data: valeur.toISOString() }),
    'Set':  (valeur) => ({ __type: 'Set', data: Array.from(valeur) }),
    'Map':  (valeur) => ({ __type: 'Map', data: Array.from(valeur.entries()) }),
    'RegExp': (valeur) => ({ __type: 'RegExp', source: valeur.source, flags: valeur.flags })
};




const reconstructeursNatifs = {
    'Date': (valeur) => new Date(valeur.data),
    'Set':  (valeur) => new Set(valeur.data),
    'Map':  (valeur) => new Map(valeur.data),
    'RegExp': (valeur) => new RegExp(valeur.source, valeur.flags),
    'BigInt': (valeur) => BigInt(valeur.data),
    'Infinity': () => Infinity,
    '-Infinity': () => -Infinity,
    'NaN': () => NaN
};




function replacer(clef, valeur)
{
    if (typeof valeur === 'number' && !isFinite(valeur))
    {
        return { __type: isNaN(valeur) ? 'NaN' : (valeur > 0 ? 'Infinity' : '-Infinity') };
    }
    if (typeof valeur === 'bigint') 
    {
        return { __type: 'BigInt', data: valeur.toString()};
    }
    if (valeur !== null && typeof valeur === "object") 
    {
        const nomType = valeur.constructor?.name;
        if (nomType === "Object" || nomType === "Array")
        {
            return valeur;
        } 
        if (strategiesNatives[nomType]) 
        {
            return strategiesNatives[nomType](valeur);
        }
        return {
            NomDeLaClasse: nomType,
            Data: {...valeur}
        };
    }
    return valeur;
}



function reviver(clef, valeur) {
    if (valeur !== null && typeof valeur === "object")
    {
        if (valeur.__type && reconstructeursNatifs[valeur.__type])
        {
            return reconstructeursNatifs[valeur.__type](valeur);
        }
        if (valeur.NomDeLaClasse) 
        {
            const nomClasse = valeur.NomDeLaClasse;
            const ClasseReference = globalThis[nomClasse];
            if (ClasseReference && typeof ClasseReference === "function") 
            {
                const instance = Object.create(ClasseReference.prototype);
                return Object.assign(instance, valeur.Data);
            }
            else 
            {
                return valeur.Data; 
            }
        }
    }
    return valeur;
}

class Test 
{
    constructor(parameter) 
    {
        this.age = 0;
        this.taille = 1.8;
        this.name = "Laurent";
    }
    nom()
    {
        console.log("test");
        return this.name;
    }

}

//Variables de test et globales
// const date = new Date(8.64e15);
// const set = new Set(["Vallet", "Dame", "Roi"]);
// const map = new Map([["clef1", 1], ["clef2", 2], [set, 157657651786n], [NaN, Infinity], [Infinity, -Infinity]]);
// const expression = new RegExp("ab+c", "i");
// const chaine = "chaine";
// const test = new Test(1);
// const objTest = {
//     "date" : date,
//     "map" : map,
//     "set" : set,
//     "chaine" : chaine,
//     "test" : test,
//     "piège" : null
// }

// console.log(objTest);
// const test6767 = JSON.stringify(objTest, replacer);
// console.log(test6767);
// const test676767 = JSON.parse(test6767, reviver);
// console.log(test676767);

let tests = new Test(2);
tests = JSON.stringify(tests, replacer);
console.log(tests);
const tests5 = JSON.parse(tests, reviver);
console.log(tests5);
tests5.nom();
