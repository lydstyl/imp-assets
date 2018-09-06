const xmlWriter = require('./xml-writer');

function bodyAssetKeyVal(jsonObj) {
    let keyVals = [];
    jsonObj.forEach(keyVal => {
        let key = keyVal[global.opts.csv.header.key];
        if (key.includes('attribute-id="body"')) {
            keyVals.push({key: key, val: keyVal[global.opts.csv.header.val]});
        }
    });
    return keyVals;
}

module.exports = function writeAssetXml(jsonObj) {
    const keyVals = bodyAssetKeyVal(jsonObj);
    const obj = xmlWriter.getToXMLParamObj(keyVals);
    const xml = xmlWriter.getXmlContent(obj);
    xmlWriter.writeXml(global.opts.xml.fileName, xml);
}