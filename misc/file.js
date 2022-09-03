const folder = process.env.CHARS_FOLDER;
const nodezip = require("node-zip");
const fs = require("fs");

module.exports = {
	/**
	 *
	 * @param {number} n
	 * @param {number} l
	 * @returns {string}
	 */
	padZero(n, l = process.env.FILE_NUM_WIDTH) {
		return ("" + n).padStart(l, "0");
	},
	refreshAssetDataBase(id) {
		const data = fs.readFileSync(`${process.env.DATABASES_FOLDER}/meta-${id}.json`);
	        return JSON.parse(data);
	},
	refreshStarterDataBase(id) {
		const data = fs.readFileSync(`${process.env.DATABASES_FOLDER}/starter-${id}.json`);
		return JSON.parse(data);
	},
	/**
	 *
	 * @param {string} temp
	 * @param {string} info
	 * @returns {string}
	 */
	fillTemplate(temp, info) {
		return temp.replace(/%s/g, info);
	},
	/**
	 * @param {string} s
	 * @param {string} suf
	 * @param {number} l
	 * @returns {string}
	 */
	 getNextFile(s, suf = ".xml", l = 7) {
		const regex = new RegExp(`${s}[0-9]*${suf}$`);
		const dir = fs.readdirSync(folder).filter((v) => v && regex.test(v));
		return `${folder}/${s}${this.padZero(dir.length, l)}${suf}`;
	},
	/**
	 * @param {string} s
	 * @param {string} suf
	 * @param {number} l
	 * @returns {number}
	 */
	getNextFileId(s, suf = ".xml", l = 7) {
		const indicies = this.getValidFileIndicies(s, suf, l);
		return indicies.length ? indicies[indicies.length - 1] + 1 : 0;
	},
	/**
	 * @param {string} s
	 * @param {string} suf
	 * @param {Buffer} data
	 * @param {number} l
	 * @returns {number}
	 */
	fillNextFileId(s, suf = ".xml", data = Buffer.alloc(0), l = 7) {
		const id = this.getNextFileId(s, suf);
		const fn = this.getFileIndex(s, suf, id, l);
		fs.writeFileSync(fn, data);
		return id;
	},
	/**
	 * @param {string} s
	 * @param {string} suf
	 * @param {number} n
	 * @param {number} l
	 * @returns {string}
	 */
	getFileIndex(s, suf = ".xml", n, l = 7) {
		return this.getFileString(s, suf, this.padZero(n, l));
	},
	/**
	 * @param {string} s
	 * @param {string} suf
	 * @param {string} name
	 * @returns {string}
	 */
	getFileString(s, suf = ".xml", name) {
		return `${folder}/${s}${name}${suf}`;
	},
	/**
	 * @param {string} s
	 * @param {string} suf
	 * @param {number} l
	 * @returns {number[]}
	 */
	getValidFileIndicies(s, suf = ".xml", l = 7) {
		const regex = new RegExp(`${s}[0-9]{${l}}${suf}$`);
		return fs
			.readdirSync(folder)
			.filter((v) => v && regex.test(v))
			.map((v) => Number.parseInt(v.substr(s.length, l)));
	},
	/**
	 * @param {string} s
	 * @param {string} suf
	 * @param {number} l
	 * @returns {string[]}
	 */
	getValidFileNames(s, suf = ".xml", l = 7) {
		const regex = new RegExp(`${s}[0-9]{${l}}${suf}$`);
		return fs
			.readdirSync(folder)
			.filter((v) => v && regex.test(v))
			.map((v) => `${folder}/${v}`);
	},
	/**
	 * @param {string} s
	 * @param {string} suf
	 * @param {number} l
	 * @returns {string[]}
	 */
	getLastFileIndex(s, suf = ".xml", l = 7) {
		const regex = new RegExp(`${s}[0-9]{${l}}${suf}$`);
		const list = fs.readdirSync(folder).filter((v) => v && regex.test(v));
		return list.length ? Number.parseInt(list.pop().substr(s.length, l)) : -1;
	},
	// Generates a random movie id without using a prefix.
	generateId() {
		return Math.floor(000000000000 + Math.random() * 999999999999);
	},
	/**
	 *
	 * @param {string} fileName
	 * @param {string} zipName
	 */
	makeZip(fileName, zipName) {
		if (!fs.existsSync(fileName)) return Promise.reject();
		const buffer = fs.readFileSync(fileName);
		const zip = nodezip.create();
		this.addToZip(zip, zipName, buffer);
		return zip.zip();
	},
	/**
	 *
	 * @summary Fixed version of ZipFile.add
	 * @param {nodezip.ZipFile} zip
	 * @param {string} zipName
	 * @param {string} buffer
	 */
	addToZip(zip, zipName, buffer) {
		zip.add(zipName, buffer);
		if (zip[zipName].crc32 < 0) zip[zipName].crc32 += 4294967296;
	},
};
