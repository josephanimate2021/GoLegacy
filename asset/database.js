const fs = require("fs");
const folder = process.env.DATABASES_FOLDER;
module.exports = {
        load(aId) {
                fs.readFileSync(`${folder}/meta-${aId}.json`);  
        }
}; 