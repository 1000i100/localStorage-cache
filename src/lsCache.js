function crypt(texte, password){
    return xorEncode(texte, password);
}
function decrypt(texte, password){
    return xorEncode(texte, password);
}

var LocalStorageCache = {};
var LSC = LocalStorageCache;

LocalStorageCache.loadJS = function loadJS(url){
    var js = document.createElement('script');
    js.innerHTML = LocalStorageCache.getFile(url);
    document.body.appendChild(js);
}
LocalStorageCache.loadCSS = function loadCSS(url){
    var css = document.createElement('style');
    css.innerHTML = LocalStorageCache.getFile(url);
    document.getElementsByTagName('head')[0].appendChild(css);
}
LocalStorageCache.getFile = function getFile(url){
    try {
        return LocalStorageCache.getPublic(url).content;
    } catch (e){
        return LocalStorageCache.updateFile(url);
    }
}
LocalStorageCache.updateFile = function updateFile(url){ // prévoir paramètre optionel de callback pour fontionnement asyncrone
    var fileContent = syncronRequest(url); //requête syncrone
    var cacheFile = new CacheFile();
    cacheFile.lastUpdate = new Date();
    cacheFile.content = fileContent;
    cacheFile.type = getFileExtensionFromUrl(url);
    LSC.setPublic(url, cacheFile);

    return LocalStorageCache.getFile(url);
}
LocalStorageCache.set = function set(){
};
LocalStorageCache.get = function get(){
    /**
     * 1er paramètre : String -> retournera la valeur de la clef saisie
     * 1er paramètre : Regexp -> retournera l'ensemble des valeurs correspondant à des clef répondant au pattern fourni
     * 2ème paramètre (optionel) : password de décryptage
     * 
     * retourne un objet simle le cas échéant, sinon créer un Storable et déserialise le contenu en initalisant le storable pour qu'il puisse réaffecter les méthode correctement.
     */
    for (key in localStorage){
        //console.log(key+' => '+localStorage[key]);
    }
};
LocalStorageCache.setPrivate = function setPrivate(key, data2store, password){
    
};
LocalStorageCache.setPublic = function setPublic(key, data2store){
    return LocalStorageCache.setPublicString(key, serialize(data2store));
    
};
LocalStorageCache.getPrivate = function getPrivate(key, password){
    
};
LocalStorageCache.getPublic = function getPublic(key){
    return deserialize(LocalStorageCache.getPublicString(key));
    
};
LocalStorageCache.setPrivateString  = function(key, string2store, password){
    LocalStorageCache.setPublicString(key, crypt(string2store, password));
};
LocalStorageCache.getPrivateString  = function(key, password){
    return decrypt(LocalStorageCache.getPublicString(key), password);
};
LocalStorageCache.setPublicString  = function(key, string2store){
    localStorage.setItem(key, string2store);
};
LocalStorageCache.getPublicString  = function(key){
    return localStorage.getItem(key);
};




function CacheFile(url){
    this.lastUpdate;
    this.content;
    this.url;
    this.type;
    if(url){
        this.init(url);
    }
    function init(url){
        this.initFromCache(url);
        if(!this.content) {
            this.updateCacheFromUrl(url);
            this.initFromCache(url);
        }
    }
    function initFromCache(urlKey){
        
    }
    function updateCacheFromUrl(url){
        
    }
    function loadInPage(){
        
    }
    
}

function CacheData(){
    this.lastUpdate;
    this.lastPush;
    this.lastChange;
    this.content;
    this.key;
    this.url;
    this.password;

    function initFromUrl(url){
        
    }
    function initFromCache(key,password){
        
    }
    
}




function syncronRequest(url){
    var httpRequest = new XMLHttpRequest();
    httpRequest.open("get", url, false);
    httpRequest.send(null);
    return httpRequest.responseText;
}
function asyncronRequest(url,callback){
    var httpRequest = new XMLHttpRequest();
    httpRequest.open("get", url, true);
    httpRequest.onreadystatechange = function() {
        if (httpRequest.readyState != 4)  { return; }
        callback(httpRequest.responseText, url);
    };
    httpRequest.send(null);
}

function getFileExtensionFromUrl(url){
    var extExtractor = /^[^#]*\.([a-zA-Z]+)(#.*)?$/g;
    return extExtractor.exec(url)[1].toLowerCase();
}


// xorEncode.js - Topcat Software LLC. 2011
// bitwise XOR cipher for javascript
// http://www.topcat.hypermart.net/index.html

function xorEncode(txt, pass) {
    var j,z;
    var ord = [];
    var buf = "";

    for (z = 1; z <= 255; z++) {ord[String.fromCharCode(z)] = z}

    for (j = z = 0; z < txt.length; z++) {
        buf += String.fromCharCode(ord[txt.substr(z, 1)] ^ ord[pass.substr(j, 1)]);
        j = (j < pass.length) ? j + 1 : 0 ;
    }

    return buf;

}


function serialize(anything, depthLimit, breadcrumbRef, seenMap){
    
    if (depthLimit===undefined) depthLimit=-1;
    if (depthLimit===0) return 'depthLimit>reached';
    // gestion des références circulaires
    if (breadcrumbRef===undefined) breadcrumbRef='root';
    if (seenMap===undefined) seenMap=[];
    for (var seenRef in seenMap){
        if(seenMap[seenRef]===anything) return 'reference>'+seenRef;
    }
    seenMap[breadcrumbRef]=anything;
    
    if(anything===null) return 'null>';
    if(anything===undefined) return 'undefined>';
    switch (anything.constructor.name) {
        case "Number":
        case "String":
        case "Boolean":
        case "RegExp":
            return anything.constructor.name+'>'+anything.toString();
        case "Date":
            return anything.constructor.name+'>'+anything.getTime();
        case "Function":
            anything = anything.toString();
             if( anything.indexOf('[native code]') > -1 ){
                // pour les fonctions native, le nom suffit.
                anything = anything.split('function ')[1].split('(')[0];
            }
            return 'Function>'+anything;
        case "Array":
        default: // objets défini par l'utilsiateur et tableaux
            var encodedMembers = [];
            for (var i in anything){
                encodedMembers.push(i+':'+Base64.encode(serialize(anything[i], depthLimit-1, breadcrumbRef+','+i, seenMap)));
            }
            return anything.constructor.name+'>'+encodedMembers.join(',');
    }
}
function deserialize(serializedContent){
    var refList=[];
    var anything = deserializeExeptRef(serializedContent);

    function deserializeExeptRef(serializedContent, breadcrumbRef){
        if (breadcrumbRef===undefined) breadcrumbRef='root';
        var typeVal = serializedContent.split('>');
        var type = typeVal[0];
        var valeur = serializedContent.substr(serializedContent.indexOf('>')+1);
        switch (type) {
            case "null": return null;
            case "depthLimit":
            case "undefined": return undefined;
            case "Number": return Number(valeur);
            case "String": return valeur;
            case "Boolean": return (valeur=='true')?true:false;
            case "RegExp": return new RegExp( valeur.substring(1, valeur.lastIndexOf('/')), valeur.substring(valeur.lastIndexOf('/')+1) );
            case "Date":
                var date = new Date();
                date.setTime(valeur);
                return date;
            case "Function":
                var func;
                eval('func = '+valeur);
                return func;
            case "reference":
                refList.push(breadcrumbRef);
                return serializedContent;
            default:
                var objType;
                eval('objType = '+type);
                var obj = new objType();
                var encodedMembers = valeur.split(',');
                for (i in encodedMembers){
                    var splittedMember = encodedMembers[i].split(':');
                    var key = splittedMember[0];
                    var value = Base64.decode(splittedMember[1]);
                    obj[key]=deserializeExeptRef(value, breadcrumbRef+','+key);
                }
                return obj;
        }
    }
    
    //addRef
    for (var ref in refList){
        var breadcrumbRef = refList[ref].split(',');
        breadcrumbRef.shift(); //nous avons déjà l'élément racine
        var referredTarget = anything;
        var ref2convert;
        for (var breadStep in breadcrumbRef){
            ref2convert = referredTarget;
            referredTarget = referredTarget[breadcrumbRef[breadStep]];
        }
        var hostForceRef = breadcrumbRef[breadStep];
        var valeur = ref2convert[hostForceRef].substr(ref2convert[hostForceRef].indexOf('>')+1);

        breadcrumbRef = valeur.split(',');
        breadcrumbRef.shift(); //nous avons déjà l'élément racine
        referredTarget = anything;
        for (breadStep in breadcrumbRef){
            referredTarget = referredTarget[breadcrumbRef[breadStep]];
        }
        ref2convert[hostForceRef] = referredTarget;
    }
    return anything;
}










/*
* $Id: base64.js,v 2.6 2012/08/24 05:23:18 dankogai Exp dankogai $
*
* Licensed under the MIT license.
* http://www.opensource.org/licenses/mit-license.php
*
* References:
* http://en.wikipedia.org/wiki/Base64
*/

(function(global) {
'use strict';
// if node.js, we use Buffer
var buffer;
if (typeof module !== 'undefined' && module.exports) {
    buffer = require('buffer').Buffer;
}
// constants
var b64chars
    = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
var b64tab = function(bin) {
    var t = {};
    for (var i = 0, l = bin.length; i < l; i++) t[bin.charAt(i)] = i;
    return t;
}(b64chars);
var fromCharCode = String.fromCharCode;
// encoder stuff
var cb_utob = function(c) {
    var cc = c.charCodeAt(0);
    return cc < 0x80 ? c
        : cc < 0x800 ? fromCharCode(0xc0 | (cc >>> 6))
                     + fromCharCode(0x80 | (cc & 0x3f))
        : fromCharCode(0xe0 | ((cc >>> 12) & 0x0f))
        + fromCharCode(0x80 | ((cc >>> 6) & 0x3f))
        + fromCharCode(0x80 | ( cc & 0x3f));
};
var utob = function(u) {
    return u.replace(/[^\x00-\x7F]/g, cb_utob);
};
var cb_encode = function(ccc) {
    var padlen = [0, 2, 1][ccc.length % 3],
        ord = ccc.charCodeAt(0) << 16
            | ((ccc.length > 1 ? ccc.charCodeAt(1) : 0) << 8)
            | ((ccc.length > 2 ? ccc.charCodeAt(2) : 0)),
        chars = [
            b64chars.charAt( ord >>> 18),
            b64chars.charAt((ord >>> 12) & 63),
            padlen >= 2 ? '=' : b64chars.charAt((ord >>> 6) & 63),
            padlen >= 1 ? '=' : b64chars.charAt(ord & 63)
        ];
    return chars.join('');
};
var btoa = global.btoa || function(b) {
    return b.replace(/[\s\S]{1,3}/g, cb_encode);
};
var _encode = buffer
    ? function (u) { return (new buffer(u)).toString('base64') }
    : function (u) { return btoa(utob(u)) }
    ;
var encode = function(u, urisafe) {
    return !urisafe
        ? _encode(u)
        : _encode(u).replace(/[+\/]/g, function(m0) {
            return m0 == '+' ? '-' : '_';
        });
};
var encodeURI = function(u) { return encode(u, true) };
// decoder stuff
var re_btou = /[\xC0-\xDF][\x80-\xBF]|[\xE0-\xEF][\x80-\xBF]{2}/g;
var cb_btou = function(ccc) {
    return fromCharCode(
        ccc.length < 3 ? ((0x1f & ccc.charCodeAt(0)) << 6)
                       | (0x3f & ccc.charCodeAt(1))
                       : ((0x0f & ccc.charCodeAt(0)) << 12)
                       | ((0x3f & ccc.charCodeAt(1)) << 6)
                       | (0x3f & ccc.charCodeAt(2))
    );
};
var btou = function(b) {
    return b.replace(re_btou, cb_btou);
};
var cb_decode = function(cccc) {
    var len = cccc.length,
        padlen = len % 4,
        n = (len > 0 ? b64tab[cccc.charAt(0)] << 18 : 0)
          | (len > 1 ? b64tab[cccc.charAt(1)] << 12 : 0)
          | (len > 2 ? b64tab[cccc.charAt(2)] << 6 : 0)
          | (len > 3 ? b64tab[cccc.charAt(3)] : 0),
        chars = [
            fromCharCode( n >>> 16),
            fromCharCode((n >>> 8) & 0xff),
            fromCharCode( n & 0xff)
        ];
    chars.length -= [0, 0, 2, 1][padlen];
    return chars.join('');
};
var atob = global.atob || function(a){
    return a.replace(/[\s\S]{1,4}/g, cb_decode);
};
var _decode = buffer
    ? function(a) { return (new buffer(a, 'base64')).toString() }
    : function(a) { return btou(atob(a)) }
    ;
var decode = function(a){
    return _decode(
        a.replace(/[-_]/g, function(m0) { return m0 == '-' ? '+' : '/' })
         .replace(/[^A-Za-z0-9\+\/]/g, '')
    );
};
// export Base64
global.Base64 = {
    atob: atob,
    btoa: btoa,
    fromBase64: decode,
    toBase64: encode,
    utob: utob,
    encode: encode,
    encodeURI: encodeURI,
    btou: btou,
    decode: decode
};
// if ES5 is available, make Base64.extendString() available
if (typeof Object.defineProperty === 'function') {
    var noEnum = function(v){
        return {value:v,enumerable:false,writable:true,configurable:true};
    };
    global.Base64.extendString = function () {
        Object.defineProperty(
            String.prototype, 'fromBase64', noEnum(function () {
            return decode(this)
        }));
        Object.defineProperty(
            String.prototype, 'toBase64', noEnum(function (urisafe) {
                return encode(this, urisafe)
        }));
    };
}
// that's it!
})(this);