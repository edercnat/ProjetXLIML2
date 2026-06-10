import { describe, it, expect } from 'vitest';
import { serialize, deserialize, XlimDataNode } from './tycle.js';

describe('Bibliothèque Tycle - (Dé)sérialisation de graphes complexes', () => {
  
  it('doit reconstruire fidèlement le graphe XlimDataNode avec ses cycles et prototypes', () => {
    // 1. SETUP : Création du graphe de test (ton code exact)
    const rootNode = new XlimDataNode("ROOT_001");
    const childA = new XlimDataNode("CHILD_A");
    const childB = new XlimDataNode("CHILD_B");

    rootNode.mathLimits = {
        infiniPositif: Infinity,
        infiniNegatif: -Infinity,
        nonNombre: NaN,
        grandEntier: 9007199254740991n
    };
    rootNode.missing = undefined;
    rootNode.void = null;

    rootNode.connections.add(childA);
    rootNode.connections.add(childB);
    childA.connections.add(rootNode); // Cycle Set

    rootNode.cache.set("string_key", childA);
    rootNode.cache.set(childB, "Valeur pour une clé Objet");
    childB.cache.set(rootNode, rootNode); // Cycle Map

    rootNode.compute = function() { return this.id; };

    // 2. EXÉCUTION
    const serialized = serialize(rootNode);
    const restoredNode = deserialize(serialized);

    // 3. ASSERTIONS (Vérifications objectives)

    // A. Conservation du typage / Prototype
    expect(restoredNode).toBeInstanceOf(XlimDataNode);
    expect(restoredNode.id).toBe("ROOT_001");

    // B. Primitives limites
    expect(restoredNode.mathLimits.infiniPositif).toBe(Infinity);
    expect(restoredNode.mathLimits.infiniNegatif).toBe(-Infinity);
    expect(restoredNode.mathLimits.nonNombre).toBeNaN();
    expect(restoredNode.mathLimits.grandEntier).toBe(9007199254740991n);
    expect(restoredNode.missing).toBeUndefined();
    expect(restoredNode.void).toBeNull();

    // C. Objets natifs
    expect(restoredNode.timestamp).toBeInstanceOf(Date);
    expect(restoredNode.timestamp.getTime()).toBe(rootNode.timestamp.getTime());
    expect(restoredNode.regex).toBeInstanceOf(RegExp);
    expect(restoredNode.regex.source).toBe(rootNode.regex.source);

    // D. Graphe et Cycles (La partie la plus critique)
    // On extrait les enfants du Set restauré
    const childrenList = Array.from(restoredNode.connections);
    const restoredChildA = childrenList.find(c => c.id === "CHILD_A");
    const restoredChildB = childrenList.find(c => c.id === "CHILD_B");

    expect(restoredChildA).toBeDefined();
    expect(restoredChildA).toBeInstanceOf(XlimDataNode);
    
    // Preuve absolue du cycle : childA doit contenir exactement l'instance rootNode restaurée
    expect(restoredChildA.connections.has(restoredNode)).toBe(true);

    // E. Vérification des Map avec clés complexes
    expect(restoredNode.cache.get("string_key")).toBe(restoredChildA);
    
    // Le childB restauré doit être la clé exacte dans la Map de rootNode
    expect(restoredNode.cache.has(restoredChildB)).toBe(true);
    
    // childB contient un cycle pointant de rootNode vers rootNode
    expect(restoredChildB.cache.get(restoredNode)).toBe(restoredNode);

    // F. Traitement des fonctions (Ton code retourne null)
    expect(restoredNode.compute).toBeNull();
  });
});