const folder = process.env.CUSTOM_WATERMARKS_FOLDER;
const wFolder = process.env.WATERMARKS_FOLDER;
const dbFolder = `${__dirname}/../${process.env.ASSET_FOLDER}`;
const fs = require("fs");

module.exports = {
	save(mId, wId) {
		// vars
		var path = `${wFolder}/${mId}.xml`;
		var wXml; 
		// save watermarks
		switch (wId) {
			// premade watermarks
			case "0dhteqDBt5nY": {
				wXml = `<watermarks><watermark style="josephanimate"/></watermarks>`;
				break;
			}
			case "0vTLbQy9hG7k": {
				wXml = '<watermarks></watermarks>';
				break;
			}
			case "174tbqdo0cs6": {
				wXml = `<watermarks><watermark style="g4s"/></watermarks>`;
				break;
			}
			case "52ht3dd60csd": {
				wXml = `<watermarks><watermark style="twoLines"/></watermarks>`;
				break;
			}
			case "82tkgqdefbw6": {
				wXml = `<watermarks><watermark style="freeTrial"/></watermarks>`;
				break;
			}
			// custom watermarks
			default: {
				const ext = fs.readFileSync(`${wFolder}/ext-meta-${wId}.txt`);
				wXml = `<watermarks><watermark>/${folder}/${wId}.${ext}</watermark></watermarks>`;
				break;
			}
		}
		fs.writeFileSync(path, wXml);
		this.assign(mId, wId);
	},
	assign(mId, wId) {
		var path = `${dbFolder}/${mId}-watermark.xml`;
		var wXml;
		switch (wId) {
			case "0dhteqDBt5nY": {
				wXml = '<watermark>No Logo</watermark>';
				break;
			}
			case "0vTLbQy9hG7k": {
				wXml = '<watermark>GoAnimate Logo<watermark>';
				break;
			}
			case "174tbqdo0cs6": {
				wXml = '<watermark>GoAnimate For Schools Logo<watermark>';
				break;
			}
			case "52ht3dd60csd": {
				wXml = '<watermark>GoAnimate - Go Make Your Own Logo<watermark>';
				break;
			}
			case "82tkgqdefbw6": {
				wXml = '<watermark>GoAnimate Free Trial Logo<watermark>';
				break;
			}
			default: {
				wXml = '<watermark>Custom Logo<watermark>';
				break;
			}
		}
		fs.writeFileSync(path, wXml);
	},
	list() {
		const table = [];
		fs.readdirSync(folder).forEach(fn => {
			if (!fn.includes(".jpg") && !fn.includes(".png") && !fn.includes(".swf")) return;
			// check if the watermark exists
			const wId = fn.substring(0, fn.length - 4);
			const dot = fn.lastIndexOf(".");
			const ext = fn.substr(dot + 1);
			const vId = `${wId}.${ext}`;
			const wtr = fs.existsSync(`${folder}/${wId}.${ext}`);
			if (wtr) table.unshift({ id: vId });
			if (!fs.existsSync(process.env.WATERMARKS_FOLDER + `/ext-meta-${wId}.txt`))
				fs.writeFileSync(process.env.WATERMARKS_FOLDER + `/ext-meta-${wId}.txt`, ext);
		});
		return table;
	},
};
