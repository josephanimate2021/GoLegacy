const watermark = require("../watermark/main");

async function listAssets() {
	var files = watermark.list();
	// premade watermarks
	var xmlString = `
	<?xml encoding="UTF-8"?><watermarks><watermark id="174tbqdo0cs6" thumbnail="${
	process.env.WATERMARKS_FOLDER}/Go4Schools.png"/><preview style="g4s"/></preview><watermark id="82tkgqdefbw6" thumbnail="${
	process.env.WATERMARKS_FOLDER}/freeTrial.png"/><preview style="freeTrial"/></preview><watermark id="52ht3dd60csd" thumbnail="${
	process.env.WATERMARKS_FOLDER}/GoMakeYourOwn.png"/><preview style="twoLines"/></preview>${
	// custom watermarks
	files.map(v => `<watermark id="${v.id.slice(0, -4)}" thumbnail="${
		  process.env.CUSTOM_WATERMARKS_FOLDER}/${v.id}"/><preview>${
		  process.env.CUSTOM_WATERMARKS_FOLDER}/${v.id}</preview>`).join("")}</watermarks>`;
	return xmlString;
}

module.exports = async function (req, res, url) {
	if (req.method != 'POST') return;

	switch (url.path) {
		case '/goapi/getUserWatermarks/': {
			listAssets().then((buff) => {
				res.setHeader("Content-Type", "text/xml");
				res.end(buff);
			});
			return true;
		} default: return;
	}
}
