const loadPost = require("../misc/post_body");
const formidable = require("formidable");
const asset = require("./main");
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
		case "/upload_asset":
			try {
				formidable().parse(req, (_, fields, files) => {
					var [mId, mode, ext] = fields.params.split(".");
					const ut = mId;
					switch (mode) {
						case "vo": mode = "voiceover";
						case "se": mode = "soundeffect";
						case "mu": mode = "music";
					}

					var path = files.import.path;
					var buffer = fs.readFileSync(path);
					console.log(ut);
					asset.save(buffer, ut, mode, ext);
					fs.unlinkSync(path);
					delete buffer;
					res.end();
				});
			} catch (e) {
				console.log("Error:", e);
			}
			return true;
	}
};
