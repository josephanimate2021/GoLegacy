/**
 * character upload route
 */
// modules
const fs = require("fs");
const path = require("path");
const fUtil = require("../fileUtil");
const folder = `${__dirname}/../${process.env.MOVIES_FOLDER}`;
const savedFolder = `${__dirname}/../${process.env.SAVED_FOLDER}`;
const database = require("../data/database"), DB = new database();
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
				const thumbBuffer = Buffer.from(fs.readFileSync(`${__dirname}/../${process.env.THUMB_BASE_URL}/257677977.jpg`), "base64");
				fs.writeFileSync(`${folder}/${id}.png`, thumbBuffer);
				fs.writeFileSync(`${folder}/${id}.xml`, buffer);
				const url = `/go_full?movieId=${id}`;
				fs.unlinkSync(path);
				res.statusCode = 302;
				res.setHeader("Location", url);
				res.end();
			} catch (e) {
				console.error("Error uploading movie:", e);
				res.statusCode = 500;
				res.end();
			}
		} case "/upload_starter": {
			const path = req.files.import.filepath, buffer = fs.readFileSync(path);
			const id = fUtil.generateId();
			try {
				const thumbBuffer = Buffer.from(fs.readFileSync(`${__dirname}/../${process.env.THUMB_BASE_URL}/257677977.jpg`), "base64");
				fs.writeFileSync(`${savedFolder}/${id}.png`, thumbBuffer);
				fs.writeFileSync(`${savedFolder}/${id}.xml`, buffer);
				Movie.meta(id, true).then(meta => {
					const db = DB.get();
					db.assets.push({
						id: id,
						enc_asset_id: id,
						type: "movie",
						title: meta.title,
						sceneCount: meta.sceneCount,
						tags: "",
						file: `${id}.xml`,
						assetId: id,
						share: {
							type: "none"
						}
					});
					DB.save(db);
				});
				fs.unlinkSync(path);
				res.statusCode = 302;
				res.setHeader("Location", "/");
				res.end();
			} catch (e) {
				console.error("Error uploading movie:", e);
				res.statusCode = 500;
				res.end();
			}
		}
	}			
}
