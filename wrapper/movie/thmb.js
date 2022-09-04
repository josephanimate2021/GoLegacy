/**
 * route
 * movie thumbnails
 */
// stuff
const Movie = require("./main");

/**
 * @param {import("http").IncomingMessage} req
 * @param {import("http").ServerResponse} res
 * @param {import("url").UrlWithParsedQuery} url
 * @returns {boolean}
 */
module.exports = async function (req, res) {
	const match = req.url.match(/\/file\/movie\/thumb\/([^/]+)$/);
	if (!match) return;
	const mId = match[1];

	try {
		const mThmb = await Movie.thumb(mId);
		res.setHeader("Content-Type", "image/png");
		res.end(mThmb);
	} catch (err) {
		res.statusCode = 404;
		res.end();
	}
	const mMatch = req.url.match(/\/file\/starter\/thumb\/([^/]+)$/);
	if (!mMatch) return;
	const sId = match[1];

	try {
		const mThumb = await Movie.mThumb(sId);
		res.setHeader("Content-Type", "image/png");
		res.end(mThumb);
	} catch (err) {
		res.statusCode = 404;
		res.end();
	}
	return true;
}