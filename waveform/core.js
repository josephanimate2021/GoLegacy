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
		case "/goapi/saveWaveform/": loadPost(req, res).then(([data]) => console.log(data));
		case "/goapi/getWaveform/": loadPost(req, res).then(([data]) => res.end(fs.readFileSync(`${folder}/${data.wfid}`)));
	}
};
