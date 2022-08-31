const loadPost = require("../misc/post_body");
const character = require("./main");
const http = require("http");

/**
 * @param {http.IncomingMessage} req
 * @param {http.ServerResponse} res
 * @param {import("url").UrlWithParsedQuery} url
 * @returns {boolean}
 */
module.exports = function (req, res, url) {
	if (req.method != "POST") return;
	switch (url.pathname) {
		case "/goapi/saveCCCharacter/": loadPost(req, res).then(([data]) => character.save(Buffer.from(data.body)).then((id) => {
			var thumb = Buffer.from(data.thumbdata, "base64");
			character.saveThumb(thumb, id);
			res.end(`0${id}`);
		}).catch(e => console.log("Error:", e)));
			return true;
		case "/ajax/character/update/":
			character.update(url.query.name, url.query.copyState, url.query.id, url.query.title, url.query.anwser);
			return true;
		// apparently, my researching has told me that this script is ment for saving stock thumbs.
		case "/goapi/saveCCThumbs/": 
			loadPost(req, res).then(([data]) => {
				var thumb = Buffer.from(data.thumbdata, "base64");
				character.saveStockThumb(thumb, data.assetId);
			});
			return true;
	}
};
