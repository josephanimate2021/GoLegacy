const loadPost = require("../misc/post_body");
const folder = process.env.CACHÉ_FOLDER;
const store = process.env.STORE_URL;
const get = require("../misc/get");
const http = require("http");
const fs = require("fs");

/**
 * @param {http.IncomingMessage} req
 * @param {http.ServerResponse} res
 * @param {import("url").UrlWithParsedQuery} url
 * @returns {boolean}
 */
module.exports = function (req, res, url) {
	if (req.method != "POST") return;
	switch (url.pathname) {
		case "/goapi/saveWaveform/": {
			loadPost(req, res).then(([data]) => {
				res.end(fs.writeFileSync(`${folder}/${data.ut}.${data.wfid}.wf`, data.waveform));
			});
			return true;
		}
		case "/goapi/getWaveform/": {
			loadPost(req, res).then(([data]) => {
				const wfFolder = `${folder}/${data.ut}.${data.wfid}.wf`;
				const wfMp3Folder = `${folder}/${data.ut}.${data.wfid}`;
				if (fs.existsSync(wfFolder)) res.end(fs.readFileSync(wfFolder));
				else if (fs.existsSync(wfMp3Folder)) res.end(fs.readFileSync(wfMp3Folder));
				else get(`${store}/${data.wftheme}/sound/${data.wfid}`).then((v) => res.end(v)).catch(e => console.log("Error:", e));
			});
			return true;
		}
	}
};
