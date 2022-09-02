const movie = require("./main");
const character = require("../character/main");
const http = require("http");

/**
 * @param {http.IncomingMessage} req
 * @param {http.ServerResponse} res
 * @param {import("url").UrlWithParsedQuery} url
 * @returns {boolean}
 */
module.exports = function (req, res, url) {
	if (req.method != "GET") return; 
	switch (url.pathname) {
		case "/movieList": {
			Promise.all(movie.list().map(movie.meta)).then((a) => res.end(JSON.stringify(a)));
			return true;
		}
		case "/charList": {
			const id = movie.fetchCharIds();
			character.meta(id).then(meta => {
				let json = {
					name: fs.readFileSync(`${process.env.CHARS_FOLDER}/databases/name-${id}.txt`),
					stuff: {
						meta
					},
				};
				res.end(JSON.stringify(json));
			});			
			return true;
		}
	}
};
