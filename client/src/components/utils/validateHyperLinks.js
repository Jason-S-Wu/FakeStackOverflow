function validateHyperLinks(text){
    let allHyperLinks = text.match(/\[[^\]]*\]\([^)]*\)/g) ?? [];
    let validHyperLinks = text.match(/\[[^\]]*\]\((https?:\/\/[^)]*)\)/g) ?? [];
    let foundError = (allHyperLinks.length !== validHyperLinks.length) ? true : false;
    return foundError;
  } 
export default validateHyperLinks;