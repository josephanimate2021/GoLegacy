const fs = require("fs");

function fetchAllCharNames() {
	var array;
	fs.readdirSync(`${process.env.CHARS_FOLDER}/databases`).forEach(fn => {
		if (!fn.includes(".txt")) return;
		// check if the copy and name settings exist
		const id = fn.substring(0, fn.length - 4);
		const copy = fs.existsSync(`${process.env.CHARS_FOLDER}/databases/copy-${id}.txt`);
		const name = fs.existsSync(`${process.env.CHARS_FOLDER}/databases/name-${id}.txt`);
		const readName = fs.readFileSync(`${process.env.CHARS_FOLDER}/databases/name-${id}.txt`);
		if (copy && name) array = readName;
	});
	return array;
}

module.exports = function (req, res, url) {
	switch (req.method) {
		case "GET": {
			switch (url.pathname) {
				case "/settings/character": {
					// do a quick check to see if the id the user typed in exists.
					if (!fs.existsSync(`${process.env.CHARS_FOLDER}/databases/copy-${url.query.id}.txt`) && !fs.existsSync(`${process.env.CHARS_FOLDER}/databases/name-${url.query.id}.txt`)) {
						console.log("You have been redirected back because an id you typed in is non existant.");
						res.end("<html><head><script>function redirect() { location.href = '/'; }</script></head><body onload=\"redirect()\"></body></html>");
					}
					const copyable = fs.readFileSync(`${process.env.CHARS_FOLDER}/databases/copy-${url.query.id}.txt`);
					var copyHtml;
					if (copyable == "Y") copyHtml = `<center><h2>Character Copying</h2></center><center><p>This feature is something that opens your previously created character. after you make changes to your character, it will save it in it's brand new id. having the option value set to Y will allow these types of things to happen. if you don't want your character to be copyable, then you must have the option value set to N. simple and easy to change. Y means yes. N means no. feel free to update the box below. if you write anything else besides Y or N on the box below, the system will break likely bricking your options to either have copyable chars or not.</p></center><center><input type="text" value="${fs.readFileSync(`${process.env.CHARS_FOLDER}/databases/copy-${url.query.id}.txt`)}" name="copy" /></center><center><button onclick="updateCharCopyPerms('${url.query.id}')">Update</button></center>`;
					else if (copyable == "N") copyHtml = `<center><h2>Character Copying</h2></center><center><p>This feature is something that opens your previously created character. after you make changes to your character, it will save it in it's brand new id. having the option value set to Y will allow these types of things to happen. if you don't want your character to be copyable, then you must have the option value set to N. simple and easy to change. Y means yes. N means no. feel free to update the box below. if you write anything else besides Y or N on the box below, the system will break likely bricking your options to either have copyable chars or not.</p></center><center><input type="text" value="${fs.readFileSync(`${process.env.CHARS_FOLDER}/databases/copy-${url.query.id}.txt`)}" name="copy" /></center><center><button onclick="updateCharCopyPerms('${url.query.id}')">Update</button></center>`;
					else copyHtml = `<p>Error Fetching Some Of Your Character Copyable Data. the system for the id: ${url.query.id} is most likely bricked. this can be fixed by editing the copy-${url.query.id}.txt file located inside the databases folder of the _CHARS folder.</p>`;
					res.end(`<html><head><title>Character Settings</title><link rel="stylesheet" href="/css/charSettings.css" type="text/css"><script src="/js/jquery.js"></script><script src="/js/charApi.js"></script></head><body><center><h1>Customize Your Character Settings.</h1></center><center><h2>Character Names</h2><center><p>This setting is really useful especialy if you want to name your character. You may customize the name below. The current name will also be in the text box below. but you can edit the name if you like. Once you are done, click on the rename button and an alert window will pop up if the operation is done.</p><center><input type="text" value="${fs.readFileSync(`${process.env.CHARS_FOLDER}/databases/name-${url.query.id}.txt`)}" name="cName" /></center><center><button onclick="renameChar(\'${url.query.id}\')">Rename</button></center>${copyHtml}</body></html>`);
					return true;
				} case "/list/characters": {
					res.end(`<!doctype html>
<html lang="en">
<head>
	<meta charset="UTF-8" />
	<title>Your Characters</title>
	<script src="/js/jquery.js"></script>
	<link rel="stylesheet" href="/css/reset.css" />
	<link rel="stylesheet" href="/css/styles-3.css" />
</head>


<body>
	<div class="container">

		<header>
			<h1 id="welcome-message">Browse Your Own Characters</h1>
		</header>

		<div id="browser">
		        <p>You can Browse some characters by a theme that you picked last time. feel free to copy your characters.</p>
			<section class="thumbnail-grid">
			
				<ul></ul>

			</section>
			<button id="load_more">Load More</button>
		
		</div>
		<div id="settings" style="display:none">
		        <center>
			        <p>In order to access the char settings, please type in a char id that you want to change the settings for.</p>
			        <input type="text" value="" name="char-id" />
			        <button onclick="settingsRedirect()">Go To Settings</button>
			</center>
		</div>
		
		<footer>
			<p>Active Since 2022</p>
			<button id="settingsBtn" onclick="switchActs('showSettings')">Settings</button>
			<button id="browseCharsBtn" style="display:none" onclick="switchActs('browseChars')">Browse Characters</button>
			<p>The Grid Styling Is Mostly From This 
				<a href="http://web.simmons.edu/~grovesd/comm244/demo/thumbnail-grid/steps/step-3.html">Website</a>
				.
			</p>
		</footer>
		
	</div> <!-- End .container -->
	<script src="/js/browseChars.js"></script>
	</body>
</html>`);
					return true;
				} default: return;
			}
		}
		case "POST": {
			switch (url.pathname) { 
				case "/goapi/getCCPreMadeCharacters": {
					res.end();
					return true;
				} default: return;
			}
		}
	}
};
