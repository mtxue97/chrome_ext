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
var menuItem = {
    "id" : "translate",
    "title": "使用谷歌翻译",
    "contexts": ["selection"]
};
chrome.contextMenus.create(menuItem);

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

  var notify = 0;
chrome.notifications.onClosed.addListener(function () {
  notify = 0;
  chrome.notifications.clear('AutoCopy');
});

chrome.extension.onMessage.addListener(
  function (req, sender, callback) {
    var rv, el, text, resp = {}, opts = {}, key;
    if (req.type === "config") {
      opts = {
        'alertOnCopy'                   : true,
        'alertOnCopySize'               : '14px',
        'alertOnCopyDuration'           : .75,
        'alertOnCopyLocation'           : 'bottomRight',
        'removeSelectionOnCopy'         : false,
        'enableForTextBoxes'            : true,
        'enableForContentEditable'      : true,
        'pasteOnMiddleClick'            : false,
        'ctrlToDisable'                 : false,
        'ctrlToDisableKey'              : 'ctrl',
        'ctrlState'                     : 'disable',
        'altToCopyAsLink'               : false,
        'altToCopyAsLinkModifier'       : 'alt',
        'copyAsLink'                    : false,
        'copyAsPlainText'               : false,
        'includeUrl'                    : false,
        'includeUrlToggle'              : false,
        'includeUrlToggleModifier'      : 'ctrlshift',
        'includeUrlToggleState'         : 'disable',
        'prependUrl'                    : false,
        'includeUrlText'                : '$crlfCopied from: $title - <$url>',
        'includeUrlCommentCountEnabled' : false,
        'includeUrlCommentCount'        : 5,
        'blockList'                     : blockListToObject(),
        'enableDebug'                   : false,
        'copyDelay'                     : false,
        'copyDelayWait'                 : 5,
        'clearClipboard'                : false,
        'clearClipboardWait'            : 10,
        'trimWhitespace'                : false,
        'nativeAlertOnCopy'             : false,
        'nativeAlertOnCopySound'        : false,
      };

      if (window.localStorage != null) {
	for (key in opts) {
	  if (opts.hasOwnProperty(key)) {
	    if (key === 'blockList') {
              resp[key] = blockListToObject();
	    } else if (key === 'ctrlToDisableKey' || key === 'ctrlState') {
              resp[key] = window.localStorage[key] || opts[key];
	    } else if (key === 'includeUrlCommentCount') {
	      if (window.localStorage.hasOwnProperty(key)) {
		resp[key] = parseInt(window.localStorage[key], 10);
	      } else {
		resp[key] = opts[key];
	      }
	    } else if (
              key === 'alertOnCopySize' || key === 'alertOnCopyDuration' ||
              key === 'alertOnCopyLocation' ||
              key === 'altToCopyAsLinkModifier' ||
              key === 'includeUrlToggleModifier' ||
              key === 'includeUrlToggleState' ||
              key === 'copyDelayWait' ||
              key === 'clearClipboardWait'
            ) {
	      resp[key] = window.localStorage[key] || opts[key];
	    } else if (key === 'includeUrlText') {
	      resp[key] = window.localStorage[key] || opts[key];
	    } else {
	      if (window.localStorage.hasOwnProperty(key)) {
                resp[key] = window.localStorage[key] === "true" ? true : false;
	      } else {
                resp[key] = opts[key];
	      }
	    }
	  }
	}

        callback(resp);
      } else {
        callback(opts);
      }
    } else if (req.type === "hideNotification") {
      chrome.notifications.onClosed.dispatch();
    } else if (req.type === "showNotification") {
      if (notify) {
        chrome.notifications.update(
          'AutoCopy', {
            'title'    : 'AutoCopy',
            'message'  : req.text,
            'type'     : 'basic',
            'iconUrl'  : 'assets/autoCopy-128.png',
            'priority' : 1,
            'silent'   : (req.opts.nativeAlertOnCopySound) ? false : true,
          },
          (id) => { 
            if (chrome.runtime.lastError) {
              console.log("Last error: ", id, chrome.runtime.lastError);
            }
          }
        );
      } else {
		  console.log(32323)
        chrome.notifications.create(
          'AutoCopy', {
            'title'    : 'AutoCopy',
            'message'  : req.text,
            'type'     : 'basic',
            'iconUrl'  : 'assets/autoCopy-128.png',
            'priority' : 1,
            'silent'   : (req.opts.nativeAlertOnCopySound) ? false : true,
          },
          (id) => { 
            if (chrome.runtime.lastError) {
              console.log("Last error: ", id, chrome.runtime.lastError);
            }
          }
        );
      }
      notify = 1;
    } else if (req.type === "clearClipboard") {
      el = document.createElement('textarea');
      document.body.appendChild(el);
      //-----------------------------------------------------------------------
      // Setting a null value will cause the clipboard to appear empty
      //-----------------------------------------------------------------------
      el.value = "\0";
      el.select();
      var rv = document.execCommand("copy");
      //console.log("Copy: " + rv);
      document.body.removeChild(el);
    } else if (req.type === "includeComment") {
        el = document.createElement('div');
	el.contentEditable='true';
        document.body.appendChild(el);
	el.unselectable = 'off';
	el.focus();
	rv = document.execCommand('paste');
	//console.log("Paste: " + rv);
	if (req.opts.prependUrl && req.comment) {
          //console.log("prepending comment: " + req.comment);
	  el.innerHTML = req.comment + '<br>' + el.innerHTML;
	} else if (req.comment) {
          //console.log("postpending comment: " + req.comment);
	  el.innerHTML = el.innerHTML + '<br>' + req.comment;
	}
	document.execCommand('SelectAll');
        rv = document.execCommand("copy");
        document.body.removeChild(el);
    } else if (req.type === "asLink") {
      if (req.text && req.text.length > 0) {
        if (opts.trimWhitesapce) {
          req.text = req.text.replace(/^\s+|\s+$/g, '');
          req.text = req.text.replace(/[\n\r]+$/g, '');
        }
        el = document.createElement('div');
	el.innerHTML = '<a title="' + req.title + '" href="' + req.href + 
          '">' + req.text + '</a>';
	el.contentEditable='true';
        document.body.appendChild(el);
	el.unselectable = 'off';
	el.focus();
	document.execCommand('SelectAll');
        rv = document.execCommand("copy");
        document.body.removeChild(el);
      }
    } else if (req.type === "reformat") {
      if (req.text && req.text.length > 0) {
        el = document.createElement('textarea');
        document.body.appendChild(el);
        if (opts.trimWhitesapce) {
          req.text = req.text.replace(/^\s+|\s+$/g, '');
          req.text = req.text.replace(/[\n\r]+$/g, '');
        }
        el.value = req.text;
        //console.log("textArea value: '" + req.text + "'");
        el.select();

        rv = document.execCommand("copy");
        //console.log("Copy: " + rv);
        document.body.removeChild(el);
      }
    } else if (req.type === "paste") {
      el = document.createElement('textarea');
      document.body.appendChild(el);
      el.value = "";
      el.select();
      var rv = document.execCommand("paste");
      //console.log("Paste: " + rv);
      rv = el.value
      document.body.removeChild(el);
      callback(rv);
    } else if (req.type === "getBlockList") {
      callback(blockListToObject());
    } else if (req.type === "writeBlockList") {
      storeBlockList(req.blockList);
    }
  }
);

function storeBlockList(oBlockList) {
  var arr = [];
  for (var n in oBlockList) {
    arr.push(n + ":" + oBlockList[n]);
  }

  window.localStorage.blockList = arr.join(",");
}

function blockListToObject() {
  var oBlockList = {};

  //---------------------------------------------------------------------------
  //  Temporary while we convert to a new name
  //---------------------------------------------------------------------------
  if (window.localStorage.blackList) {
    window.localStorage.blockList = window.localStorage.blockList;
    delete window.localStorage.blackList;
  }

  if (!window.localStorage.blockList) {
    //console.log("setting blocklist for first time");
    window.localStorage.blockList = "docs.google.com:1";
  }

  var domains    = window.localStorage.blockList.split(",");
  var len        = domains.length
  var parts      = [];
  var i;

  //console.log("In blockListToObject");
  for (i=0; i<len; i++) {
    parts = domains[i].split(":");

    oBlockList[parts[0]] = parseInt(parts[1],10);
  }

  //console.log("Walking blocklist");
  //for (i in oBlockList) {
  //  console.log("  Blocklist entry: " + i + " -> " + oBlockList[i]);
  //}

  return(oBlockList);
}

