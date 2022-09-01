const loadPost = require("../misc/post_body");
const header = process.env.XML_HEADER;
const fUtil = require("../misc/file");
const nodezip = require("node-zip");
const starter = require("../starter/main");
const base = Buffer.alloc(1, 0);
const asset = require("./main");
const http = require("http");
const fs = require("fs");
function giveXml(type, v) {
	var xml, meta;
	switch (type) {
		case "movie": {
			meta = require('.' + process.env.DATABASES_FOLDER + `/starter-${v.id}.json`);
			xml = `<movie id="${v.id}" enc_asset_id="${v.id}" path="/_SAVED/${v.id}" numScene="1" title="${meta.title}" thumbnail="/starter_thumbs/${v.id}"><tags>${meta.tags || ""}</tags></movie>`;
			break;
		}
	}
	return xml;
}
async function listAssets(data, makeZip) {
	var xmlString, files;
	switch (data.type) {
		case "char": {
			const chars = await asset.chars(data.themeId);
			xmlString = `${header}<ugc more="0">${chars
				.map(
					(v) =>
						`<char id="${v.id}" name="${fs.readFileSync(process.env.CHARS_FOLDER + `/databases/name-${v.id}.txt`)}" cc_theme_id="${v.theme}" thumbnail_url="/char_thumbs/${v.id}.png" copyable="${fs.readFileSync(process.env.CHARS_FOLDER + `/databases/copy-${v.id}.txt`)}"><tags/></char>`
				)
				.join("")}</ugc>`;
			break;
		}
		case "bg": {
			files = asset.list(data.ut, "bg");
			xmlString = `${header}<ugc more="0">${files
				.map((v) => `<background subtype="0" id="${v.id}" name="${v.name}" enable="Y"/>`)
				.join("")}</ugc>`;
			break;
		}
		case "sound": {
			files = asset.list(data.ut, "sound");
			xmlString = `${header}<ugc more="0">${files
				.map((v) =>`<sound subtype="${v.subtype}" id="${v.id}" name="${v.name}" enable="Y" duration="${v.duration}" downloadtype="progressive"/>`)
				.join("")}</ugc>`;
			break;
		}
		case "movie": {
			files = starter.list();
			xmlString = `${header}<ugc more="0">${files.map(v => giveXml("movie", v)).join("")}</ugc>`;
			break;
		}
		case "prop": {
			files = asset.list(data.ut, "prop");
			xmlString = `${header}<ugc more="0">${files
				.map(
				        (v) =>
						`<prop subtype="0" id="${v.id}" name="${v.name}" enable="Y" holdable="0" headable="0" placeable="1" facing="left" width="0" height="0" asset_url="${process.env.PROPS_FOLDER}/${v.id}"/>`
				)
				.join("")}</ugc>`;
			break;
		}
		default: {
			xmlString = `${header}<ugc more="0"></ugc>`;
			break;
		}
	}
	
	switch (data.subtype) {
		case "video": {
			files = asset.list(data.ut, "video");
			xmlString = `${header}<ugc more="0">${files
				.map(
					(v) =>
						`<prop subtype="video" id="${v.id}" name="${v.name}" enable="Y" holdable="0" headable="0" placeable="1" facing="left" width="10" height="10" thumbnail_url=""/>`
				)
				.join("")}</ugc>`;
			break;
		}
	}

	if (makeZip) {
		const zip = nodezip.create();
		const files = asset.listAll(data.ut);
		fUtil.addToZip(zip, "desc.xml", Buffer.from(xmlString));

		files.forEach((file) => {
			switch (file.mode) {
				case "bg":
				case "sound": {
					const buffer = asset.load(data.ut, file.id);
					fUtil.addToZip(zip, `${file.mode}/${file.id}`, buffer);
					break;
				}
				case "prop": {
					const buffer = fs.readFileSync(`${process.env.PROPS_FOLDER}/${file.id}`);
					fUtil.addToZip(zip, `${file.mode}/${file.id}`, buffer);
					break;
				}
			}
		});
		return await zip.zip();
	} else {
		return Buffer.from(xmlString);
	}
}

/**
 * @param {http.IncomingMessage} req
 * @param {http.ServerResponse} res
 * @param {import("url").UrlWithParsedQuery} url
 * @returns {boolean}
 */
module.exports = function (req, res, url) {
	var makeZip = false;
	switch (url.pathname) {
		case "/goapi/getUserAssets/":
			makeZip = true;
			break;
		case "/goapi/getUserAssetsXml/":
			break;
		default:
			return;
	}

	switch (req.method) {
		case "GET": {
			var q = url.query;
			if (q.movieId && q.type) {
				listAssets(q, makeZip).then((buff) => {
					const type = makeZip ? "application/zip" : "text/xml";
					res.setHeader("Content-Type", type);
					res.end(buff);
				}).catch(e => console.log("Error:", e));
				return true;
			} else return;
		}
		case "POST": {
			loadPost(req, res).then(([data]) => listAssets(data, makeZip)).then((buff) => {
				const type = makeZip ? "application/zip" : "text/xml";
				res.setHeader("Content-Type", type);
				if (makeZip) res.write(base);
				res.end(buff);
			}).catch(e => console.log("Error:", e));
			return true;
		}
		default:
			return;
	}
};
