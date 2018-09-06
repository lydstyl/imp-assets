const assetId = require('./key-parser').assetId;
const htmlspecialchars = require('htmlspecialchars');
const { toXML } = require('jstoxml');
const fs = require('fs');

function getToXMLParamObj(keyVals) {
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
    return obj;
}
function getXmlContent(obj) {
    const xmlOptions = {
        header: false,
        indent: '  '
    };
    let xml = toXML(obj, xmlOptions);
    xml = xml.replace('<library>', global.opts.xml.firstAndSecondLines);
    return xml;
}
function writeXml(fileName, xmlString) {
    fileName = fileName + ".xml";
    fs.writeFile("./" + fileName, xmlString, function(err) {
        if(err) {
            return console.log(err);
        }
        console.log(`The file ${fileName} was saved !`);
    }); 
}

module.exports = {
    getToXMLParamObj: getToXMLParamObj,
    getXmlContent: getXmlContent,
    writeXml: writeXml
}