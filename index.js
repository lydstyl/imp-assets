/**
 * Transforme un csv en xml
 * Attention de replire les optiosn avant notament les entetes des colonnes key et val du csv
 */

/////////////////////////////////
const opts = {
    csv:{
        filePath: 'csv.csv',
        delimiters: [';'],
        header: {
            key: 'XPATH',
            val: 'TRANSLATION'
        }
    },
    xml:{
        firstAndSecondLines: '<?xml version="1.0" encoding="UTF-8"?>\n<library xmlns="http://www.demandware.com/xml/impex/library/2006-10-31">',
        fileName: 'testAssets'
    }
}
/////////////////////////////////

const csv=require('csvtojson');
const { toXML } = require('jstoxml');
const htmlspecialchars = require('htmlspecialchars');
const fs = require('fs');

let keyVals = [];

function assetId(key) {
    let matchResult = key.match(/content-id="([^"]*)"/);
    if(matchResult == null || !hasBody(key)) return '';
    return matchResult[1];
}
function hasBody(key){
    if(key.indexOf('attribute-id="body"') < 0) return false;
    return true;
}
function prepareJsonForXml(jsonObj) {
    jsonObj.forEach(keyVal => {
        let key = keyVal[opts.csv.header.key];
        if (key.includes('attribute-id="body"')) {
            keyVals.push({key: key, val: keyVal[opts.csv.header.val]});
        }
    });
    const xmlOptions = {
        header: false,
        indent: '  '
    };
    let obj = {
        library: []
    };
    keyVals.forEach(keyVal => {
        let asset = {
            id: assetId(keyVal.key),
            body: htmlspecialchars(keyVal.val)
        };
        obj.library.push(
            {
                _name: 'content',
                _attrs: {
                    'content-id': asset.id
                },
                _content: [
                    {
                        _name: 'online-flag',
                        _content: 'true'
                    },
                    {
                        _name: 'searchable-flag',
                        _content: 'true'
                    },
                    {
                        _name: 'custom-attributes',
                        _content: {
                            _name: 'custom-attribute',
                            _attrs: {
                                'attribute-id': 'body',
                                'xml:lang': 'es-ES'
                            },
                            _content: asset.body
                        }
                    }
                ]
            }
        )
    });
    let xml = toXML(obj, xmlOptions);
    xml = xml.replace('<library>', opts.xml.firstAndSecondLines);
    fs.writeFile("./" + opts.xml.fileName + ".xml", xml, function(err) {
        if(err) {
            return console.log(err);
        }
        console.log("The file was saved!");
    }); 
}

csv({
    delimiter: opts.csv.delimiters
})
.fromFile(opts.csv.filePath)
.then((jsonObj)=>{
    prepareJsonForXml(jsonObj);
})