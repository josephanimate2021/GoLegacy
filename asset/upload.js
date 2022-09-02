const loadPost = require("../misc/post_body");
const ffmpeg = require("fluent-ffmpeg");
ffmpeg.setFfmpegPath(require("@ffmpeg-installer/ffmpeg").path);
ffmpeg.setFfprobePath(require("@ffprobe-installer/ffprobe").path);
const { Readable } = require("stream");
const sharp = require("sharp");
const mp3Duration = require('mp3-duration');
const formidable = require("formidable");
const asset = require("./main");
const http = require("http");
const fs = require("fs");

/**
 * @param {http.IncomingMessage} req
 * @param {http.ServerResponse} res
 * @param {import("url").UrlWithParsedQuery} url
 * @returns {boolean}
 */
module.exports = function (req, res, url) {
	if (req.method != "POST") return;
	switch (url.pathname) {
		case "/upload_asset": {
			try {
				formidable().parse(req, (_, fields, files) => {
					var [mId, mode, ext] = fields.params.split(".");
					const ut = mId;
					var subtype;
					switch (mode) {
						case "vo": mode = "voiceover";
						case "se": mode = "soundeffect";
						case "mu": mode = "music";
					}

					var path = files.import.path;
					var buffer = fs.readFileSync(path);
					if (ext == "mp3" && ext == "wav") {
						const oldStream = Readable.from(buffer);
						let stream;
						let meta = {
							type: "sound",
							subtype: mode,
							ext: "mp3",
							themeId: "ugc"
						};
						if (ext == "mp3") stream = oldStream;
						else {
							const rej = console.log;
							const command = ffmpeg(oldStream).inputFormat(ext).toFormat("mp3").on("error", (e) => {
								rej("Error converting audio:", e);
							});
							stream = command.pipe();
						}
						
						let buffers = [];
						stream.resume();
						stream.on("data", b => buffers.push(b));
						stream.on("end", () => {
							const buf = Buffer.concat(buffers);
							mp3Duration(buf, (e, duration) => {
								if (e || !duration) return;
								meta.duration = 1e3 * duration;
								asset.saveWav(buf, ut, meta.subtype, meta.ext).then(assetMeta => {
									const aId = assetMeta.aId;
									meta.title = assetMeta.title;
									fs.writeFileSync(`${process.env.DATABASES_FOLDER}/meta-${aId.slice(0, -4)}.json`, JSON.stringify(meta));
								});
								fs.unlinkSync(path);
								delete buffer;
								res.end();
							});
						});
					} else {
						asset.save(buffer, mId, mode, ext);
						fs.unlinkSync(path);
						delete buffer;
						res.end();
					}
				});
			} catch (e) {
				console.log("Error:", e);
			}
			return true;
		}
		case "/goapi/saveSound/": {
			loadPost(req, res).then(([data]) => {

				const buffer = Buffer.from(data.bytes, "base64");
				const oldStream = Readable.from(buffer);
				const ext = "ogg";
			
				let meta = {
					type: "sound",
					subtype: data.subtype,
					title: data.title,
					ext: "mp3",
					themeId: "ugc"
				};
			
				const rej = console.log;
				const command = ffmpeg(oldStream).inputFormat(ext).toFormat("mp3").on("error", (e) => rej("Error converting audio:", e));
				const stream = command.pipe();

				let buffers = [];
				stream.resume();
				stream.on("data", b => buffers.push(b));
				stream.on("end", () => {
					const buf = Buffer.concat(buffers);
					mp3Duration(buf, (e, duration) => {
						if (e || !duration) return;
						meta.duration = 1e3 * duration;
						const aId = asset.save(buf, data.ut, meta.subtype, meta.ext);
						fs.writeFileSync(`${process.env.DATABASES_FOLDER}/meta-${aId.slice(0, -4)}.json`, JSON.stringify(meta));
						res.end(
							`0<response><asset><id>${aId}</id><enc_asset_id>${aId}</enc_asset_id><type>sound</type><subtype>${meta.subtype}</subtype><title>${meta.title}</title><published>0</published><tags></tags><duration>${meta.duration}</duration><downloadtype>progressive</downloadtype><file>${aId}</file></asset></response>`
						);
					});
				});
			});
			return true;
		}
	}
};
