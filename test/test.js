describe("méthodes fournies par LocalStorageCache ou LSC :", function() {
    beforeEach(function() {
        localStorage.clear();
    });
    describe("loadJS(url) et loadCSS(url)", function() {
        it("charge le fichier url sans faire de requête s'il est déjà présent en localStorage.", function() {
            fakeFile = new CacheFile();
            fakeFile.lastUpdate = new Date();
            fakeFile.content = 'var testVar = 5; testVar++;';
            fakeFile.type = 'js';
            LSC.setPublic('http://fakeUrl.com/myFile.js', fakeFile);
            
            LSC.loadJS('http://fakeUrl.com/myFile.js');
            expect(testVar).toBe(6);
        });
        it("charge le fichier url depuis sa source web s'il n'est pas disponible en localStorage. (le serveur source doit accepter les requêtes ajax cross domaine)", function() {
            LSC.loadJS('http://assistante-fourmizzz.1kf.fr/js/jquery.js');
            expect(typeof $).toBe('function');
        });
    });
    describe("getFile(url)", function() {
        it("charge le fichier url sans faire de requête s'il est déjà présent en localStorage.", function() {
            fakeFile = new CacheFile();
            fakeFile.lastUpdate = new Date();
            fakeFile.content = 'var testVar = 5; testVar++;';
            fakeFile.type = 'js';
            LSC.setPublic('http://fakeUrl.com/myFile.js', fakeFile);
            
            fileContent = LSC.getFile('http://fakeUrl.com/myFile.js');
            expect(fileContent).toEqual(fakeFile.content);
        });
    });
    describe("updateFile(url)", function() {
        it("met à jour la version en localeStorage depuis la version web distante.", function() {
            //TODO:
        });
    });
    /*
    describe("getData(key,[url])", function() {
        new CacheData();
    });
    describe("setData(key, data, [url])", function() {
        new CacheData();
    });
    describe("updateData(key,[url])", function() {
        new CacheData();
    });
    describe("pushData(key,[url])", function() {
        new CacheData();
    });
*/
});

describe("Fonctions générique", function() {
    it("crypte une chaine selon une passphrase", function() {
        var texteCrypte = crypt('test', 'clefDeChiffrage');
        expect(texteCrypte).not.toBe('test');
        expect(decrypt(texteCrypte, 'clefDeChiffrage')).toBe('test');
        expect(decrypt(texteCrypte, 'uneAutreClef')).not.toBe('test');
    });
    describe("serialisation / déserialisation importé depuis https://github.com/GammaNu/serialize-anything", function() {
        it("voir http://gammanu.github.com/serialize-anything/test/ pour les tests détaillés", function() {
            var donneeDeTest = new Array(1, 5, 3);
            donneeDeTest['clef']='valeur';
            var temoin = donneeDeTest;
            var donneeConvertieEnTexte = serialize(donneeDeTest);
            console.log(donneeConvertieEnTexte);
            var donneeRestauree = deserialize(donneeConvertieEnTexte);
            expect(donneeRestauree[0]).toBe(temoin[0]);
            expect(donneeRestauree[1]).toBe(temoin[1]);
            expect(donneeRestauree[2]).toBe(temoin[2]);
            expect(donneeRestauree['clef']).toBe(temoin['clef']);
        });
    });
    
});
describe("méthodes interne de LocalStorageCache ou LSC", function() {
    beforeEach(function() {
            localStorage.clear();
    });
    it("stock une chaine de caractère en LocalStorage après l'avoir crypté", function() {
        LSC.setPrivateString('gammaNu/test', 'test', 'mypass');
        expect(localStorage.getItem('gammaNu/test')).toBe(crypt('test', 'mypass'));
    });
    it("retourne une chaine de caractère décrypté depuis LocalStorage", function() {
        LSC.setPrivateString('gammaNu/test', 'test', 'mypass');
        expect(LSC.getPrivateString('gammaNu/test', 'mypass')).toBe('test');
    });
    it("stock une chaine de caractère publique en LocalStorage", function() {
        LSC.setPublicString('gammaNu/test', 'test');
        expect(localStorage.getItem('gammaNu/test')).toBe('test');
    });
    it("retourne une chaine de caractère publique depuis LocalStorage", function() {
        LSC.setPublicString('gammaNu/test', 'test');
        expect(LSC.getPublicString('gammaNu/test')).toBe('test');
    });
    it("getPublic(clef) retourne le contenu qui a été fourni a setPublic précédement  (en passant par le LocalStorage)", function() {
        LSC.setPublic('aKey', /regexp/i);
        expect(LSC.getPublic('aKey').test('ma RegExp est reconnue')).toBe(true);
    });
    
    
});