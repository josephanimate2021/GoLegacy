var mp3Duration = require("mp3-duration");
const chars = require("../character/main");
const database = require("./database");
const fUtil = require("../misc/file");
const caché = require("./caché");
const fs = require("fs");

module.exports = {

	load(ut, aId) {
		return caché.load(ut, aId);
	},
	delete(ut, aId) {
		return caché.delete(ut, aId);
	},
	saveStream(bytes, ut, subtype, ext) {
		return new Promise((res, rej) => {
			const suffix = `-${subtype}.${ext}`;
			caché.newStream(bytes, ut, "", suffix).then(aId => res(aId)).catch(e => rej(e));
		});
	},
	save(buffer, ut, mode, ext, dur = false, subtype) {
		var suffix;
                switch (mode) { 
			case "prop": { 
				suffix = `-${mode}.${ext}`;
				return caché.newProp(buffer, ut, "", suffix); 
                                break;
                        }
			case "wtr": { 
				suffix = `-${mode}.${ext}`;
				return caché.newWatermark(buffer, ut, "", suffix, ext); 
                                break;
                        }
			case "video": { 
                                suffix = `-${mode}.${ext}`;
                                if (mode == "dontimport") {
                                        console.log;
                                } else {
                                        return caché.newVideo(buffer, ut, "", suffix); 
                                }
                                break;
			}
			default: {
				if (!dur) {
					suffix = `-${mode}.${ext}`;
					return caché.newItem(buffer, ut, "", suffix, subtype, mode);
				} else {
					suffix = `-${mode}.${ext}`;
					return caché.newItem(buffer, ut, "", suffix, subtype, dur, mode);
                                break;
                        }
                }
	},
	list(ut, mode) {
		var ret = [];
		var files = caché.list(ut);
		files.forEach((aId) => {
			var dot = aId.lastIndexOf(".");
			var dash = aId.lastIndexOf("-");
			let json = {
				type: mode,
				subtype: aId.substr(dash + 1, dot - dash - 1),
				title: aId.substr(0, dash),
				ext: aId.substr(dot + 1),
				themeId: "ugc",
				duration: 0
			};
			// if a database file gets deleted, create a new one but with old results. i know, sounds lame. but at least everything is fixed up now.
			if (!fs.existsSync(`${process.env.DATABASES_FOLDER}/meta-${aId.slice(0, -4)}.json`)) {
				fs.writeFileSync(`${process.env.DATABASES_FOLDER}/meta-${aId.slice(0, -4)}.json`, JSON.stringify(json));
			}
			const meta = require('.' + `${process.env.DATABASES_FOLDER}/meta-${aId.slice(0, -4)}.json`);
			const name = meta.title || json.title;
			const subtype = meta.subtype || json.subtype;
			var fMode = subtype;
			const ext = meta.ext || json.ext;
			switch (fMode) {	
				case 'music':
				case 'voiceover':
				case 'soundeffect': {
					var fMode = 'sound';
					break;
				}
			}
			if (fMode == mode) {
				const dur = meta.duration || json.duration;
				if (fMode == 'sound') {
					ret.push({ id: aId, ext: ext, name: name, duration: dur, subtype: subtype});
					console.log(ret);
				} else {
					ret.push({ id: aId, ext: ext, name: name, subtype: subtype });	
					console.log(ret);
				}
			}
		});
		return ret;
	},
	listAll(ut) {
		var ret = [];
		var files = caché.list(ut);
		files.forEach((aId) => {
			var dot = aId.lastIndexOf(".");
			var dash = aId.lastIndexOf("-");
			var name = aId.substr(0, dash);
			var ext = aId.substr(dot + 1);
			var fMode = aId.substr(dash + 1, dot - dash - 1);
			ret.push({ id: aId, ext: ext, name: name, mode: fMode });
		});
		return ret;
	},
	chars(theme) {
		return new Promise(async (res) => {
			switch (theme) {
				case "custom":
					theme = "family";
					break;
				case "action":
				case "animal":
				case "space":
				case "vietnam":
					theme = "cc2";
					break;
			}

			var table = [];
			var ids = fUtil.getValidFileIndicies("char-", ".xml");
			for (const i in ids) {
				var id = `c-${ids[i]}`;
				if (!theme || theme == (await chars.getTheme(id))) {
					table.unshift({ theme: theme, id: id });
				}
			}
			res(table);
		});
	},
};
