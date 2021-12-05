$('#get_popup_title').click(e => {
	console.log('get_popup_title')
	var views = chrome.extension.getViews({type:'popup'});
	if(views.length > 0) {
		alert(views[0].document.title);
	} else {
		alert('popup未打开！');
	}
});

// chrome.runtime.onInstalled.addListener(function(){
// 	chrome.declarativeContent.onPageChanged.removeRules(undefined, function(){
// 		chrome.declarativeContent.onPageChanged.addRules([
// 			{
// 				conditions: [
// 					// 只有打开百度才显示pageAction
// 					new chrome.declarativeContent.PageStateMatcher({pageUrl: {urlContains: 'baidu.com'}})
// 				],
// 				actions: [new chrome.declarativeContent.ShowPageAction()]
// 			}
// 		]);
// 	});
// });

// ---------------------使用localStorage----------------
localStorage.setItem('test', 'eee');
console.log(localStorage.getItem('test'));

// ---------------------设置badge------------------
chrome.browserAction.setBadgeText({text: '哈喽'});
// chrome.browserAction.setBadgeBackgroundColor({color: 'red'});

// ---------------------右键菜单----------------
chrome.contextMenus.create({
	title: '使用百度搜索：%s', // %s表示选中的文字
	contexts: ['selection'], // 只有当选中文字时才会出现此右键菜单
	onclick: function(params)
	{
		// 注意不能使用location.href，因为location是属于background的window对象
		chrome.tabs.create({url: 'https://www.baidu.com/s?ie=utf-8&wd=' + encodeURI(params.selectionText)});
	}
});

// ---------------------测试函数----------------
function test() {
	console.log('我是background！');
}

//---------------------桌面通知------------
chrome.notifications.create(null, {
	type: "basic",
	iconUrl: "origin.png",
	title: "喝水小助手",
	message: "看到此消息的人可以和我一起来喝一杯水",
  });
  