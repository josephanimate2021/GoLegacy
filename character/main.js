const cachéFolder = process.env.CACHÉ_FOLDER;
const xNumWidth = process.env.XML_NUM_WIDTH;
const baseUrl = process.env.CHAR_BASE_URL;
const charsFolder = process.env.CHARS_FOLDER, folder = charsFolder + "/databases";
const fUtil = require("../misc/file");
const util = require("../misc/util");
const get = require("../misc/get");
const fw = process.env.FILE_WIDTH;
const fs = require("fs");
const themes = {};
const copyBase = "Y";
const charName = "Untitled";

function addTheme(id, buffer) {
	const beg = buffer.indexOf(`theme_id="`) + 10;
	const end = buffer.indexOf(`"`, beg);
	const theme = buffer.subarray(beg, end).toString();
	return (themes[id] = theme);
}

function save(id, data, stockThumb = false) {
	const i = id.indexOf("-");
	const prefix = id.substr(0, i);
	const suffix = id.substr(i + 1);
	switch (prefix) {
		case "c": {
			fs.writeFileSync(fUtil.getFileIndex("char-", ".xml", suffix), data);
			fs.writeFileSync(`${folder}/name-${id}.txt`, charName);
			fs.writeFileSync(`${folder}/copy-${id}.txt`, copyBase);
			break;
		}
		default: if (stockThumb) fs.writeFileSync(`${charsFolder}/${id}.png`, data);	
	}
	addTheme(id, data);
	return id;
}

fUtil.getValidFileIndicies("char-", ".xml").map((n) => {
	return addTheme(`c-${n}`, fs.readFileSync(fUtil.getFileIndex("char-", ".xml", n)));
});

/**
 * @param {string} id
 * @returns {string}
 */
function getCharPath(id) {
	var i = id.indexOf("-");
	var prefix = id.substr(0, i);
	var suffix = id.substr(i + 1);
	switch (prefix) {
		case "c":
			return fUtil.getFileIndex("char-", ".xml", suffix);
		case "C":
		default:
			return `${cachéFolder}/char.${id}.xml`;
	}
}
/**
 * @param {string} id
 * @returns {string}
 */
function getThumbPath(id) {
	var i = id.indexOf("-");
	var prefix = id.substr(0, i);
	var suffix = id.substr(i + 1);
	switch (prefix) {
		case "c":
			return fUtil.getFileIndex("char-", ".png", suffix);
		case "C":
		default:
			return `${cachéFolder}/char.${id}.png`;
	}
}

module.exports = {
	/**
	 * @param {string} id
	 * @returns {Promise<string>}
	 */
	getTheme(id) {
		return new Promise((res, rej) => {
			if (themes[id]) res(themes[id]);
			this.load(id)
				.then((b) => res(addTheme(id, b)))
				.catch(rej);
		});
	},
	/**
	 * @param {string} id
	 * @returns {Promise<Buffer>}
	 */
	load(id) {
		return new Promise((res, rej) => {
			var i = id.indexOf("-");
			var prefix = id.substr(0, i);
			var suffix = id.substr(i + 1);

			switch (prefix) {
				case "c":
				case "C":
					fs.readFile(getCharPath(id), (e, b) => {
						if (e) {
							var fXml = util.xmlFail();
							rej(Buffer.from(fXml));
						} else {
							res(b);
						}
					});
					break;

				case "":
				default: {
					// Blank prefix is left here for backwards-compatibility purposes.
					var nId = Number.parseInt(suffix);
					var xmlSubId = nId % fw;
					var fileId = nId - xmlSubId;
					var lnNum = fUtil.padZero(xmlSubId, xNumWidth);
					var url = `${baseUrl}/${fUtil.padZero(fileId)}.txt`;

					get(url)
						.then((b) => {
							var line = b
								.toString("utf8")
								.split("\n")
								.find((v) => v.substr(0, xNumWidth) == lnNum);
							if (line) {
								res(Buffer.from(line.substr(xNumWidth)));
							} else {
								rej(Buffer.from(util.xmlFail()));
							}
						})
						.catch((e) => rej(e));
				}
			}
		});
	},
	/**
	 * @param {string} id
	 * @returns {Promise<Buffer>}
	 */
	delete(id) {
		return new Promise((res, rej) => {
			var i = id.indexOf("-");
			var prefix = id.substr(0, i);
			var suffix = id.substr(i + 1);

			switch (prefix) {
				case "c":
				case "C":
					fs.unlinkSync(getCharPath(id));
					fs.unlinkSync(`${folder}/copy-${id}.txt`);
					fs.unlinkSync(`${folder}/name-${id}.txt`);
					break;
			}
		});
	},
	/**
	 * @param {string} id
	 * @returns {Promise<Buffer>}
	 */
	deleteThumb(id) {
		return new Promise((res, rej) => {
			fs.unlinkSync(getThumbPath(id), (e, b) => {
				if (e) {
					var fXml = util.xmlFail();
					rej(Buffer.from(fXml));
				} else {
					res(b);
				}
			});
		});
	},
	/**
	 * @param {Buffer} data
	 * @param {string} id
	 * @returns {Promise<string>}
	 * @summary Saves a character with the c- prefix.
	 */
	save(data, id) {
		return new Promise((res, rej) => {
			if (id) {
				const i = id.indexOf("-");
				const prefix = id.substr(0, i);
				switch (prefix) {
					case "c":
					case "C":
						fs.writeFile(getCharPath(id), data, (e) => (e ? rej() : res(id)));
					default:
						res(save(id, data));
				}
			} else {
				saveId = `c-${fUtil.getNextFileId("char-", ".xml")}`;
				res(save(saveId, data));
			}
		});
	},
	/**
	* @summary Saves a character with the original id.
	*/
	saveStockThumb(data, assetId) {
		return new Promise((rej) => {
			var id = assetId;
			fs.writeFileSync(`${charsFolder}/${id}.png`, data);
			// if the thumb failed to load the first time, try loading it again.
			this.loadThumb(id).catch(e => rej(e));
		});
	},
	update(name, copyState, id, title, anwser) {
		if (copyState) fs.writeFileSync(`${folder}/copy-${id}.txt`, anwser);
		else if (title) fs.writeFileSync(`${folder}/name-${id}.txt`, name);
		else return;
	},
	/**
	 * @param {Buffer} data
	 * @param {string} id
	 * @returns {Promise<string>}
	 */
	saveThumb(data, id) {
		return new Promise((res, rej) => {
			var thumb = Buffer.from(data, "base64");
			fs.writeFileSync(getThumbPath(id), thumb);
			res(id);
		});
	},
	/**
	 * @param {string} id
	 * @returns {Promise<Buffer>}
	 */
	loadThumb(id) {
		return new Promise((res, rej) => {
			const i = id.indexOf("-");
			const prefix = id.substr(0, i);
			if (prefix == "c") {
				fs.readFile(getThumbPath(id), (e, b) => {
					if (e) {
						res(util.xmlFail(e));
						rej(e);
					} else res(b);
				});
			} else res(fs.readFileSync(`${charsFolder}/${id}.png`));
		});
	},
	meta(movieId) {
		return new Promise(async (res, rej) => {
			if (!movieId.startsWith("c-")) return;
			const n = Number.parseInt(movieId.substr(2));
			const fn = fUtil.getFileIndex("char-", ".xml", n);
			
			const fd = fs.openSync(fn, "r");
			const buffer = fs.readFileSync(fUtil.getFileIndex("char-", ".xml", n));
			fs.readSync(fd, buffer, 0, 256, 0);
			// i was going to also going to add that feature to other channels. but you guys can tell me on discord if i should do that or not first.
			const tIDbeg = buffer.indexOf('" theme_id="') + 12;
			const tIDend = buffer.indexOf('" x="');
			const themeId = buffer.subarray(tIDbeg, tIDend).toString();
			const copyable = fs.readFileSync(process.env.CHARS_FOLDER + `/databases/copy-${movieId}.txt`);
			var f;
			if (copyable == "Y") f = `copyRedirect('${movieId}', '${themeId}')`;
			else if (copyable == "N") f = 'alert(\'This Character Cannot Be Copied Because The Perms For That Are Disabled. Please change the perms on the char settings and try again.\')';
			else f = `alert('Unable to fetch some copy data. it is most likely that the system is bricked on id ${movieId}.')`;

			
			fs.closeSync(fd);
			res({
				id: movieId,
				tId: themeId,
				function: f
			});
		});
	},
};
