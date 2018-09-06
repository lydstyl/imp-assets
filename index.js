/**
 * Transforme un csv en xml
 * Attention de bien relire les options, en particulier les entetes des colonnes key et val du csv
 */

/////////////////////////////////
global.opts = {
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

const csv = require('csvtojson');
const writeAssetXml = require('./write-asset-xml');

csv({
    delimiter: global.opts.csv.delimiters
})
.fromFile(global.opts.csv.filePath)
.then((jsonObj)=>{
    writeAssetXml(jsonObj);
})