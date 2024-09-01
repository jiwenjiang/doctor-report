export function GetQueryString(name) {
  var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
  var r = window.location.search.substr(1).match(reg); //search,查询？后面的参数，并匹配正则
  if (r != null) return unescape(r[2]);
  return null;
}

export function isAndroid() {
  const u = navigator.userAgent;
  return u.indexOf('Android') > -1 || u.indexOf('Adr') > -1;
}
