const loadPost = require("../misc/post_body");
const asset = require("./main");
const character = require("../character/main");
const movie = require("../movie/main");
const starter = require("../starter/main");
const http = require("http");
const fs = require("fs");

/**
 * @param {http.IncomingMessage} req
 * @param {http.ServerResponse} res
 * @param {import("url").UrlWithParsedQuery} url
 * @returns {boolean}
 */
module.exports = function (req, res, url) {
	switch (req.method) {
		case "GET": {
			const match = req.url.match(/\/(assets|goapi\/getAsset)\/([^/]+)\/([^.]+)(?:\.xml)?$/);
			if (!match) return;

			const ut = match[1];
			const aId = match[2];
			const b = asset.load(ut, aId);
			if (b) {
				try {
					res.statusCode = 200;
					res.end(b);
				} catch (e) {
					res.statusCode = 404;
					console.log("Error:", e);
				}
			}
		}

		case "POST": {
			switch (url.pathname) {
				case "/goapi/getAsset/":
				case "/goapi/getAssetEx/": {
					try {
						loadPost(req, res).then(([data]) => {
							const aId = data.assetId || data.enc_asset_id;
							const b = asset.load(data.ut, aId);
							if (b) {
								res.setHeader("Content-Length", b.length);
								res.setHeader("Content-Type", "audio/mp3");
								res.end(b);
							}
						});
					} catch (e) {
						console.log("Error:", e);
					}
					return true;
				}
				case "/goapi/deleteAsset/": {
					try {
						// only accept the request on localhost
						switch (req.headers.host) {
							case "localhost": 
							case `localhost:${process.env.SERVER_PORT}`: {
								loadPost(req, res).then(async ([data]) => {
									const ut = data.ut;
									const aId = data.assetId || data.enc_asset_id;
									asset.delete(ut, aId);
								});
								return true;
							}
						}
					} catch (e) {
						console.log("Error:", e);
					}
				}
				case "/goapi/deleteUserTemplate/": {
					const port = process.env.SERVER_PORT;
					// only accept the request on localhost
					try {
						switch (req.headers.host) {
							case "localhost": loadPost(req, res).then(async ([data]) => starter.delete(data.templateId));
							case `localhost:${port}`: loadPost(req, res).then(async ([data]) => starter.delete(data.templateId));
						}
					} catch (e) {
						console.log("Error:", e);
					}
					return true;
				}
				case "/goapi/updateAsset/": {
					loadPost(req, res).then(([data]) => {
						if (!fs.existsSync(`${process.env.DATABASES_FOLDER}/meta-${data.assetId.slice(0, -4)}.json`)) return;
						const db = require('.' + process.env.DATABASES_FOLDER + `/meta-${data.assetId.slice(0, -4)}.json`);
						const mp3Meta = `{"subtype":"${db.subtype}","title":"${data.title}","ext":"${db.ext}","themeId":"${db.themeId}","duration":${db.duration},"type":"${db.type}"}`;
						const meta = `{"subtype":"${db.subtype}","title":"${data.title}","ext":"${db.ext}","themeId":"${db.themeId}","type":"${db.type}"}`;
						switch (db.ext) {
							case "mp3": {
								fs.writeFileSync(`${process.env.DATABASES_FOLDER}/meta-${data.assetId.slice(0, -4)}.json`, mp3Meta);
								break;
							}
							default: {
								fs.writeFileSync(`${process.env.DATABASES_FOLDER}/meta-${data.assetId.slice(0, -4)}.json`, meta);
								break;
							}
						}
					});
				}
				default: return;
			}
		}
		default: return;
	}
};
