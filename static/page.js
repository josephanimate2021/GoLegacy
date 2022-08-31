const fUtil = require("../misc/file");
const stuff = require("./info");
const http = require("http");
const fs = require("fs");

function toAttrString(table) {
	return typeof table == "object"
		? Object.keys(table)
				.filter((key) => table[key] !== null)
				.map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(table[key])}`)
				.join("&")
		: table.replace(/"/g, '\\"');
}
function toParamString(table) {
	return Object.keys(table)
		.map((key) => `<param name="${key}" value="${toAttrString(table[key])}">`)
		.join(" ");
}
function toObjectString(attrs, params) {
	return `<object id="obj" ${Object.keys(attrs)
		.map((key) => `${key}="${attrs[key].replace(/"/g, '\\"')}"`)
		.join(" ")}>${toParamString(params)}</object>`;
}

/**
 * @param {http.IncomingMessage} req
 * @param {http.ServerResponse} res
 * @param {import("url").UrlWithParsedQuery} url
 * @returns {boolean}
 */
module.exports = function (req, res, url) {
	if (req.method != "GET") return;
	const query = url.query;
	var tutorialReload;
	if (query.tutorial != "0") tutorialReload = false;
	else tutorialReload = true;
	var attrs, params, title, ut, html, charName, copyable, Sen;
	switch (process.env.PROJECT_RELEASE) {
		case "stable": {
			ut = "30";
			break;
		}
		case "dev": {
			ut = "60";
			break;
		}
	}
	var trayQuery = query.tray;
	switch (url.pathname) {
		case "/cc": {
			title = "Character Creator";
			attrs = {
				data: process.env.SWF_URL + "/cc.swf", // data: 'cc.swf',
				type: "application/x-shockwave-flash",
				id: "char_creator",
				width: "100%",
				height: "100%",
			};
			params = {
				flashvars: {
					apiserver: "/",
					storePath: process.env.STORE_URL + "/<store>",
					clientThemePath: process.env.CLIENT_URL + "/<client_theme>",
					original_asset_id: query["id"] || null,
					themeId: "business",
					ut: ut,
					bs: "default",
					appCode: "go",
					page: "",
					siteId: "go",
					m_mode: "school",
					isLogin: "Y",
					isEmbed: 1,
					ctc: "go",
					tlang: "en_US",
				},
				allowScriptAccess: "always",
				movie: process.env.SWF_URL + "/cc.swf", // 'http://localhost/cc.swf'
			};
			html = `<script>function characterSaved() { location.href = '/'; }</script>`;
			break;
		}

		case "/cc_browser": {
			title = "CC Browser";
			attrs = {
				data: process.env.SWF_URL + "/cc_browser.swf", // data: 'cc_browser.swf',
				type: "application/x-shockwave-flash",
				id: "char_creator",
				width: "100%",
				height: "100%",
			};
			params = {
				flashvars: {
					apiserver: "/",
					storePath: process.env.STORE_URL + "/<store>",
					clientThemePath: process.env.CLIENT_URL + "/<client_theme>",
					original_asset_id: query["id"] || null,
					themeId: "family",
					ut: ut,
					appCode: "go",
					page: "",
					siteId: "go",
					m_mode: "school",
					isLogin: "Y",
					isEmbed: 1,
					ctc: "go",
					tlang: "en_US",
					lid: 13,
				},
				allowScriptAccess: "always",
				movie: process.env.SWF_URL + "/cc_browser.swf", // 'http://localhost/cc_browser.swf'
			};
			break;
		}

		case "/go_full": {
			title = "Video Editor";
			attrs = {
				data: process.env.SWF_URL + "/go_full.swf",
				type: "application/x-shockwave-flash",
				width: "100%",
				height: "100%",
			};
			params = {
				flashvars: {
					apiserver: "/",
					storePath: process.env.STORE_URL + "/<store>",
					isEmbed: 1,
					ctc: "go",
					ut: ut,
					appCode: "go",
					page: "",
					siteId: "go",
					lid: 13,
					isLogin: "Y",
					retut: 1,
					clientThemePath: process.env.CLIENT_URL + "/<client_theme>",
					tlang: "en_US",
					goteam_draft_only: 1,
					isWide: 1,
					collab: 0,
					nextUrl: "/html/list.html",
					tray: trayQuery,
				},
				allowScriptAccess: "always",
			};
			html = `<iframe style='display:none'name='dummy'></iframe><form style='display:none'id='uploadbanner'enctype='multipart/form-data'method='post'action='/upload_asset'target='dummy'><input type='text'name='params'/><input id='fileupload'name='import'type='file'onchange='importComplete(this)'accept='.mp3,.wav,.png,.jpg,.swf'/><input type='submit'value='submit'id='submit'/></form><script>interactiveTutorial={neverDisplay:function(){return ${tutorialReload ? false : true}}};function studioLoaded(arg){console.log(arg)}function initPreviewPlayer(xml){confirm('Before proceeding, please make sure all your changes have been saved.')&&window.open('player?movieId='+flashvars.presaveId,'MsgWindow','width=1280,height=723,left='+(screen.width/2-640)+',top='+(screen.height/2-360))};function exitStudio(){window.location='/'}const fu=document.getElementById('fileupload'),sub=document.getElementById('submit');function showImporter(){fu.click()};function importComplete(obj){const file=obj.files[0];if(file!=undefined){const ext=file.name.substring(file.name.lastIndexOf('.')+1);var params=flashvars.presaveId+'.';if(ext=='mp3'||ext=='wav'){var c;while(c!='vo'&&c!='se'&&c!='mu'){c=prompt('Would you like to upload this as a voiceover (\"vo\"), sound effect (\"se\"), or as music (\"mu\")?').toLowerCase()}params+=c}else if(ext=='jpg'||ext=='png'||ext=='swf'){var c;while(c!='bg'&&c!='prop'&&c!='wtr'){c=prompt('Would you like to upload this as a background (\"bg\"), as a prop (\"prop\"), or as a watermark (\"wtr\")?').toLowerCase()}params+=c}obj.parentElement.firstChild.value=params+'.'+ext;sub.click();return true}}</script>`;
			break;
		}

		case "/player": {
			title = "Player";
			attrs = {
				data: process.env.SWF_URL + "/player.swf",
				type: "application/x-shockwave-flash",
				width: "100%",
				height: "100%",
			};
			params = {
				flashvars: {
					apiserver: "/",
					storePath: process.env.STORE_URL + "/<store>",
					ut: ut,
					autostart: 1,
					isWide: 1,
					clientThemePath: process.env.CLIENT_URL + "/<client_theme>",
				},
				allowScriptAccess: "always",
				allowFullScreen: "true",
			};
			break;
		}

		default:
			return;
	}
	res.setHeader("Content-Type", "text/html; charset=UTF-8");
	Object.assign(params.flashvars, query);
	res.end(`<script>document.title='${title}',flashvars=${
		// json flashvars
		JSON.stringify(params.flashvars)}</script><body style="margin:0px">${
		// object flashvars
		toObjectString(attrs, params)}</body>${html || ""}`);
	return true;
};
