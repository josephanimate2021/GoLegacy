var json;
var grid = document.getElementsByTagName('ul')[0];
var loadMore = document.getElementById('load_more');
const listReq = new XMLHttpRequest();
listReq.open('GET', '/charList');
listReq.send();

var C = 0;
function loadRows() {
	let c = C; C += 69;
	for (; c < C; c++) {
		if (c > json.length - 1) loadMore.remove();
		const tbl = json[c];
		var htmlFunction;
		if (!c > json) htmlFunction = '<center><p>You currently have no characters at the monent. <a href="/cc_browser?themeId=family">Create one now using the swf edition of the cc browser.</a></p></center>';
		else htmlFunction = '<li><p>Character Id: ' + tbl.id + '</p><a href="javascript:;" title="' + tbl.name + '"><figure><img src="/char_thumbs/' + tbl.id + '.png" alt="Character ' + tbl.id + '" /><figcaption><p class="description"><span onclick="' + tbl.function + '" class="price">Make A Copy</span></p></figcaption></figure></a></li>';
		grid.insertAdjacentHTML('beforeend', htmlFunction);
	}
}

loadMore.onclick = loadRows;
listReq.onreadystatechange = function (e) {
	if (listReq.readyState != 4) return;
	json = JSON.parse(listReq.responseText);
	loadRows();
}
		
function copyRedirect(charId, tId) {
	location.href = `/cc?themeId=${tId}&original_asset_id=${charId}`;
}
function settingsRedirect() {
	const charId = $("input[name='char-id']");
	const id = charId.val();
	if (id != '' && id != 'c' && id != 'c-') window.location.href = `/settings/character?id=${id}`;
	else alert("You must insert an id that starts with c- to access the character settings.");
}
function switchActs(act) {
	switch (act) {
		case "showSettings": {
			document.getElementById('browser').style.display = "none";
			document.getElementById('settings').style.display = "block";
			document.getElementById('welcome-message').innerHTML = 'Character Settings';
			document.getElementById('settingsBtn').style.display = "none";
			document.getElementById('browseCharsBtn').style.display = "block";
			break;
		} case "browseChars": {
			document.getElementById('browser').style.display = "block";
			document.getElementById('settings').style.display = "none";
			document.getElementById('welcome-message').innerHTML = 'Browse Your Own Characters';
			document.getElementById('settingsBtn').style.display = "block";
			document.getElementById('browseCharsBtn').style.display = "none";
			break;
		}
	}
}
function copyCharId() {
	/* Get the text field */
	var copyText = document.getElementById('charId');

	/* Select the text field */
	copyText.select();
	copyText.setSelectionRange(0, 99999); /* For mobile devices */

	/* Copy the text inside the text field */
	navigator.clipboard.writeText(copyText.value);

	/* Alert the copied text */
	alert("sucessfully copied your character id into your clipboard.");
}
