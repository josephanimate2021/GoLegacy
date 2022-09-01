const folder = process.env.WAVEFORMS_FOLDER;
const fs = require("fs");

module.exports = function(wfId, waveform) {
	var path = `${folder}/${wfId}.wf`;
	fs.writeFileSync(path, waveform);
};
