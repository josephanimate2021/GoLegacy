/**
 * character upload route
 */
// modules
const fs = require("fs");
const fUtil = require("../fileUtil");
// stuff
const Char = require("./main");
const Movie = require("../movie/main");

/**
 * @param {import("http").IncomingMessage} req
 * @param {import("http").ServerResponse} res
 * @param {import("url").UrlWithParsedQuery} url
 * @returns {boolean}
 */
module.exports = async function (req, res, url) {
	if (req.method != "POST") return;
	switch (url.pathname) {
		case "/upload_character": {

			const path = req.files.import.filepath, buffer = fs.readFileSync(path);
			const meta = {
				type: "char",
				subtype: 0,
				title: "Untitled",
				themeId: Char.getTheme(buffer)
			};
			try {
				// save the char
				Char.save(buffer, meta, true);
				const url = `/cc_browser?themeId=${meta.themeId}`;
				fs.unlinkSync(path);
				// redirect the user
				res.statusCode = 302;
				res.setHeader("Location", url);
				res.end();
			} catch (err) {
				console.error("Error uploading character:", err);
				res.statusCode = 500;
				res.end("00");
			}
			return true;
		} case "/upload_movie": {
			const path = req.files.import.filepath, buffer = fs.readFileSync(path);
			const id = fUtil.generateId();
			try {
				fs.writeFileSync(process.env.MOVIES_FOLDER + `${id}.xml`, buffer);
				Movie.createThumb(id);
				const url = `/go_full?movieId=${id}`;
				res.statusCode = 302;
				res.setHeader("Location", url);
				res.end();
			} catch (e) {
				console.error("Error uploading movie:", e);
				res.statusCode = 500;
				res.end();
			}
		}
	}			
}
