const caché = require("../asset/caché");
var path = require('path');
const fUtil = require("../misc/file");
const nodezip = require("node-zip");
const parse = require("../movie/parse");
const fs = require("fs");
const folder = process.env.STARTERS_FOLDER;

module.exports = {
	/**
	 *
	 * @param {Buffer} movieZip
	 * @param {string} nëwId
	 * @param {string} oldId
	 * @returns {Promise<string>}
	 */
	save(starterZip, thumb, mId = false) {
		return new Promise(async (res, rej) => {
			var zip = nodezip.unzip(starterZip);
			var id;
			if (!mId) id = fUtil.generateId();
			else id = mId;
			const thumbFile = `${folder}/${id}.png`
			if (thumb) fs.writeFileSync(thumbFile, thumb);
			var path = `${folder}/${id}.xml`
			var writeStream = fs.createWriteStream(path);
			parse.unpackMovie(zip, thumb).then((data) => {
				writeStream.write(data, () => {
					writeStream.close();
					this.meta(id).then(mMeta => {
						// save the title & tags to get modifed by the user later.
						let jMeta = {
							title: mMeta.title,
							sceneCount: mMeta.sceneCount,
							tags: mMeta.tag
						};
						fs.writeFileSync(`${process.env.DATABASES_FOLDER}/starter-${id}.json`, JSON.stringify(jMeta));
					});
					res(id);
				});
			}).catch(e => rej(e));
		});
	},
	update(id, title, tags) {
		return new Promise((res, rej) => {
			if (!fs.existsSync(`${process.env.DATABASES_FOLDER}/starter-${id}.json`)) rej("Error Code 404. A file that tried loading was not found.");
			const db = require('.' + process.env.DATABASES_FOLDER + `/starter-${id}.json`);
			let meta = {
				title: title,
				sceneCount: db.sceneCount,
				tags: tags
			};
			fs.writeFileSync(`${process.env.DATABASES_FOLDER}/starter-${id}.json`, JSON.stringify(meta));
			res(fUtil.refreshStarterDataBase(id));
		});
	},
	loadZip(mId) {
		return new Promise((res, rej) => {
			var filePath = `${folder}/${mId}.xml`
			if (!fs.existsSync(filePath)) rej(`The File: ${filePath} Is Non Existant.`);
			const buffer = fs.readFileSync(filePath);
			if (!buffer || buffer.length == 0) rej("Your Starter Has Failed To Load. one of the common reasons for this is that there may be bugs in this LVM Project that is causing the issue. if that's the case, then please contact joseph the animator#2292 on discord for help.");
			parse.packMovie(buffer, mId).then(pack => res(pack.zipBuf)).catch(e => rej(e));
		});
	},
	delete(mId) {
		return new Promise((rej) => {
			if (fs.existsSync(`${process.env.DATABASES_FOLDER}/starter-${mId}.json`)) {
				fs.unlinkSync(`${process.env.DATABASES_FOLDER}/starter-${mId}.json`);
			}
			var filePath = `${folder}/${mId}.xml`;
			if (!fs.existsSync(filePath)) rej(`The File: ${filePath} Is Non Existant.`);
			fs.unlinkSync(filePath);
			var thumbFile = `${folder}/${mId}.png`;
			if (!fs.existsSync(thumbFile)) rej(`The File: ${thumbFile} Is Non Existant.`);
			fs.unlinkSync(thumbFile);
		});
	},
	loadXml(movieId) {
		return new Promise(async (res, rej) => {
			const fn = `${folder}/${movieId}.xml`;
			if (fs.existsSync(fn)) res(fs.readFileSync(fn));
			else rej("Your starter has failed to load via a GET request.");
		});
	},
	loadThumb(movieId) {
		const match = fs.readdirSync(folder).find(file => file.includes(`${movieId}.png`));
		return match ? fs.readFileSync(`${folder}/${match}`) : null;
	},
	list() {
		const table = [];
		fs.readdirSync(folder).forEach(fn => {
			if (!fn.includes(".xml")) return;
			// check if the movie and thumbnail exists
			const mId = fn.substring(0, fn.length - 4);
			const movie = fs.existsSync(`${folder}/${mId}.xml`);
			const thumb = fs.existsSync(`${folder}/${mId}.png`);
			if (movie && thumb) table.unshift({ id: mId });
		});
		return table;
	},
	meta(movieId) {
		return new Promise((res) => {
			const filepath = `${folder}/${movieId}.xml`;
			const buffer = fs.readFileSync(filepath);

			const begTitle = buffer.indexOf("<title>") + 16;
			const endTitle = buffer.indexOf("]]></title>");
			const title = buffer.slice(begTitle, endTitle).toString().trim();
			
			const begTag = buffer.indexOf("<tag>") + 14;
			const endTag = buffer.indexOf("]]></tag>");
			const tag = buffer.slice(begTag, endTag).toString();
			
			let count = 0;
			let pos = buffer.indexOf('<scene id=');
			while (pos > -1) {
				count++;
				pos = buffer.indexOf('<scene id=', pos + 10);
			}

			res({
				date: fs.statSync(filepath).mtime,
				title: title,
				tag: tag,
				id: movieId,
				sceneCount: count
			});
		});	 
	},
};
