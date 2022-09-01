const pjson = require("../package.json");
const stuff = require("./info");
const http = require("http");
const fs = require("fs");
const { rejects } = require("assert");

/**
 * @param {http.IncomingMessage} req
 * @param {http.ServerResponse} res
 * @param {import("url").UrlWithParsedQuery} url
 * @returns {boolean}
 */
module.exports = function (req, res, url) {
	var methodLinks = stuff[req.method];
	for (let linkIndex in methodLinks) {
		var regex = new RegExp(linkIndex);
		if (regex.test(url.path)) {
			var t = methodLinks[linkIndex];
			var link = t.regexLink ? url.path.replace(regex, t.regexLink) : t.link || url.path;
			var headers = t.headers;
			var path = `./${link}`;

			try {
				for (var headerName in headers || {}) res.setHeader(headerName, headers[headerName]);
				res.statusCode = t.statusCode || 200;
				if (t.content !== undefined) res.end(t.content);
				else if (fs.existsSync(path)) {
					if (t.contentReplace) {
						content = fs.readFileSync(path, "utf8");
						content = content.replace(/VERSIÖN/g, pjson.versionStr);
						content = content.replace(/NEWS/g, "Welcome to GoLegacy! feel free to do whatever you like here.");
						content = content.replace(/BUTTON/g, `<a class="button_big" href="/go_full">MAKE A VIDEO</a>`);
						res.end(content);
					} else fs.createReadStream(path).pipe(res);
				} else throw null;
			} catch (e) {
				res.statusCode = t.statusCode || 404;
				//  octanuary likes sparkz. so here is a lesson for him instead.
				 console.log("______          _       ____       _                                     ");
				console.log("|  ____|        | |     / __ \     | |                                    ");
				console.log("| |__ _   _  ___| | __ | |  | | ___| |_ __ _ _ __  _   _  __ _ _ __ _   _ ");
				console.log("|  __| | | |/ __| |/ / | |  | |/ __| __/ _` | '_ \| | | |/ _` | '__| | | |");
				console.log("| |  | |_| | (__|   <  | |__| | (__| || (_| | | | | |_| | (_| | |  | |_| |");
				console.log("|_|   \__,_|\___|_|\_\  \____/ \___|\__\__,_|_| |_|\__,_|\__,_|_|   \__, |");
				console.log("																     __/ |");
				console.log("    																|___/ ");
				console.log("Error:", e);
			}
			return true;
		}
	}
	return false;
};
