function renameChar(charId) {
  const cName = $("input[name='cName']");
  const name = cName.val();
  alert(`Renaming Your Character to ${name}...`);
  const xhttp = new XMLHttpRequest();
  xhttp.open('POST', `/ajax/character/update/?title=true&id=${charId}&name=${name}`);
  xhttp.send();
}
function updateCharCopyPerms(charId) {
  const cPerms = $("input[name='copy']");
  const perms = cPerms.val();
  const xhttp = new XMLHttpRequest();
  xhttp.open('POST', `/ajax/character/update/?copyState=true&id=${charId}&anwser=${perms}`);
  xhttp.send();
}
