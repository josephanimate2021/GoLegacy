const fs = require("fs");
const folder = process.env.DATABASES_FOLDER;
module.exports = {
        save(dur, aId) {
                fs.writeFileSync(`${folder}/${aId}.txt`, dur);  
        },
        load(aId) {
                fs.readFileSync(`${folder}/${aId}.txt`);  
        }
}    