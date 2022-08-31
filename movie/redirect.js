const http = require("http");

/**
 * @param {http.IncomingMessage} req
 * @param {http.ServerResponse} res
 * @param {import("url").UrlWithParsedQuery} url
 * @returns {boolean}
 */
module.exports = function (req, res, url) {
	if (req.method != "GET" || !url.pathname.startsWith("/videomaker/full")) return;
	var match = req.url.match(/\/videomaker\/full\/(\w+)\/tutorial$/);
	if (!match) return;
	var theme = match[1];

	var redirect = `/go_full?tutorial=0&tray=${theme}`;
	res.setHeader("Location", redirect);
	res.statusCode = 302;
	res.end();
	return true;
};
