const loadPost = require("../misc/post_body");
const mp3Duration = require('mp3-duration');
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
		case "/goapi/saveSound/": {
			loadPost(req, res).then(([data]) => {
				console.log(data);
				const ut = data.ut;
				const bytes = Buffer.from(data.bytes, "base64");
				const subtype = data.subtype;
				asset.saveStream(bytes, ut, subtype, "mp3").then(id => {
					console.log(id);
					mp3Duration(`${process.env.CACHÉ_FOLDER}/${ut}.${id}`, (e, d) => {
						var dur = d * 1e3;
						if (e || !dur) return res.end(1 + util.xmlFail("Unable to save your recording.", e));
						const title = data.title;
						res.end(`0<response><asset><id>${id}</id><enc_asset_id>${id}</enc_asset_id><type>${data.type}</type><subtype>${subtype}</subtype><title>${title}</title><published>0</published><tags></tags><duration>${dur}</duration><downloadtype>progressive</downloadtype><file>${id}</file></asset></response>`);
					});
				}).catch(e => console.log("Error:", e));
			});
		}
	}
};
