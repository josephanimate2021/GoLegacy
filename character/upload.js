const formidable = require("formidable");
const fUtil = require("../misc/file");
const parse = require("../movie/parse");
const http = require("http");
const fs = require("fs");

/**
 * @param {http.IncomingMessage} req
 * @param {http.ServerResponse} res
 * @param {import("url").UrlWithParsedQuery} url
 * @returns {boolean}
 */
module.exports = function (req, res, url) {
	if (req.method != "POST" || url.path != "/upload_character") return;
	try {
		new formidable.IncomingForm().parse(req, (e, f, files) => {
			if (!files.import) return;
			var path = files.import.path;
			var buffer = fs.readFileSync(path);
			const tIDbeg = buffer.indexOf('" theme_id="') + 12;
			const tIDend = buffer.indexOf('" x="');
			const themeId = buffer.subarray(tIDbeg, tIDend).toString();
			var numId = fUtil.getNextFileId("char-", ".xml");
			parse.unpackCharXml(buffer, `c-${numId}`);
			fs.unlinkSync(path);
			res.statusCode = 302;
			var url = `/cc?themeId=${themeId}&original_asset_id=c-${numId}`;
			res.setHeader("Location", url);
			res.end();
		});
	} catch (e) {
		console.log("Error:", e);
	}
	return true;
};
