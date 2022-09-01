var mp3Duration = require("mp3-duration");
const chars = require("../character/main");
const fUtil = require("../misc/file");
const caché = require("./caché");
<<<<<<< HEAD
const fs = require("fs");

function fetchMusicDurationsForId(ut, aId) {
	var dur = [];
	const buffer = fs.readFileSync(`${process.env.CACHÉ_FOLDER}/${ut}.${aId}`);
	mp3Duration(buffer, (d) => {
		dur.push({ vidDur: d * 1e3 });
	});
	return dur;
}
=======
>>>>>>> c05b2bb3b4572a02cc1c074af08735f86cd5b34a

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
	save(buffer, ut, mode, ext) {
		var suffix, ed;
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
                                return caché.newItem(buffer, ut, "", suffix);
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
			var subtype = aId.substr(dash + 1, dot - dash - 1);
			switch (fMode) {	
				case 'music': {
					var fMode = 'sound';
					var subtype = 'bgmusic';
					break;
				}
				case 'voiceover':
				case 'soundeffect': {
					var fMode = 'sound';
					break;
				}
			}
			console.log(ut);
			const dur = fetchMusicDurationsForId(ut, aId).vidDur;
			console.log(dur);
			if (fMode == mode) {
<<<<<<< HEAD
				if (fMode == 'sound') ret.push({ id: aId, ext: ext, name: name, duration: dur, subtype: subtype});
				else ret.push({ id: aId, ext: ext, name: name, subtype: subtype });	
			}
		});
		console.log(ret);
=======
				if (fMode == 'sound') {
					ret.push({ id: aId, ext: ext, name: name, mode: fMode, subtype: subtype});
				} else {
				ret.push({ id: aId, ext: ext, name: name, mode: fMode });
				
			}

			return new Promise(function (resolve, reject) {
				console.log(`/${process.env.CACHÉ_FOLDER}/${ut}.${aId}`);
				mp3Duration(`/${process.env.CACHÉ_FOLDER}/${ut}.${aId}`, (e, d) => {
					var dur = d * 1e3;
					console.log(dur);
					var dot = aId.lastIndexOf(".");
					var dash = aId.lastIndexOf("-");
					var name = aId.substr(0, dash);
					var ext = aId.substr(dot + 1);
					var subtype = aId.substr(dash + 1, dot - dash - 1);
					console.log(subtype);
                                        if (dur == '0' || 'undefined') {
					        ret.push({ id: aId, ext: ext, name: name, subtype: subtype});
                                        } else {
                                                ret.push({ id: aId, ext: ext, name: name, subtype: subtype, duration: dur });
                                        }
					console.log(ret);
				});
				resolve(ret);
				reject(ret)
			});
		}
	});
>>>>>>> c05b2bb3b4572a02cc1c074af08735f86cd5b34a
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
		return new Promise(async (res, rej) => {
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
