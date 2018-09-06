function assetId(key) {
    let matchResult = key.match(/content-id="([^"]*)"/);
    if(matchResult == null || !hasBody(key)) return '';
    return matchResult[1];
}
function hasBody(key){
    if(key.indexOf('attribute-id="body"') < 0) return false;
    return true;
}
module.exports = {
    assetId: assetId,
    hasBody: hasBody
}