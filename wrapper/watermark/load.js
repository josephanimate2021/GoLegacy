const folder = process.env.WATERMARKS_FOLDER;
const fs = require("fs");
const http = require("http");

module.exports = async function (req, res, url) {
	if (req.method != "POST" || url.path != "/goapi/getMovieInfo/") return; 
	try {
		res.setHeader("Content-Type", "text/html; charset=UTF-8");
		const p = `${folder}/${req.body.movieId}.xml`;
		if (!fs.existsSync(p)) {
			// don't load any watermarks if a user watermark does not exist.
			res.end('<watermarks><watermark style="josephanimate"/></watermarks>');
		} else {
			fs.createReadStream(p).pipe(res);
		}
	} catch (e) {
		console.log("Error:", e);
	}
	return true;
};
