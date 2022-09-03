var mp3Duration = require("mp3-duration");
const chars = require("../character/main");
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
	saveWav(buffer, ut, subtype, ext) {
		return new Promise((res, rej) => {
			const suffix = `-${subtype}.${ext}`;
			caché.newStream(buffer, ut, "", suffix).then(meta => {
				res({
					aId: meta.id,
					title: meta.title
				});
			}).catch(e => rej(e));
		});
	},
	save(buffer, ut, mode, ext) {
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
				suffix = `-${mode}.${ext}`;
				return caché.newItem(buffer, ut, "", suffix, mode);
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
			var name = aId.substr(0, dash);
			var ext = aId.substr(dot + 1);
			var fMode = aId.substr(dash + 1, dot - dash - 1);
			switch (fMode) {	
				case 'music':
				case 'voiceover':
				case 'soundeffect': {
					var fMode = 'sound';
					break;
				}
			}
			if (fMode == mode && fMode == 'sound') ret.push({ id: aId });
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
