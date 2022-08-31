const loadPost = require("../misc/post_body");
const folder = process.env.CACHÉ_FOLDER;
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
		case "/goapi/saveWaveform/": loadPost(req, res).then(([data]) => res.end(fs.writeFileSync(`${folder}/${data.wfid.slice(0, -8)}.wf`, data.waveform)));
		case "/goapi/getWaveform/": loadPost(req, res).then(([data]) => {
			const wfFolder = `${folder}/${data.wfid.slice(0, -8)}.wf`;
			if (fs.existsSync(wfFolder)) res.end(fs.readFileSync(wfFolder));
			else res.end(fs.readFileSync(`${folder}/${data.wfid}`)));
			return true;
		});
	}
};
