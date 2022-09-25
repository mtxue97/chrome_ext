let list = [];
let obj = {};

// 监听来自content script的消息
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse)
{
  alert(`收到来自content script的消息：${sender}`);
	console.log('收到来自content script的消息：');
	console.log(request, sender);
	sendResponse('我是popup，已收到你的消息：' + JSON.stringify(request));
  // 读取数据，第一个参数是指定要读取的key以及设置默认值
  chrome.storage.local.get('list', function(res) {
    list = res.list;
  });
});

$('#download').click(() => {
  download();
});


var bg = chrome.extension.getBackgroundPage();
bg.test(); // 访问backgrouund中的函数
// alert(bg.document.body.innerHTML); // 访问bg的DOM

// 向content-script注入代码片段
function executeScriptToCurrentTab(code) {
  getCurrentTabId((tabId) => {
    chrome.tabs.executeScript(tabId, { code: code });
  });
}

// 获取当前选项卡ID
function getCurrentTabId(callback) {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    if (callback) callback(tabs.length ? tabs[0].id : null);
  });
}

// 修改背景色
$("#gray_mode").click(() => {
  const code = 'document.body.style.filter = "grayscale(3)";';
  executeScriptToCurrentTab(code);
});

// 页面加滤镜
$("#change_bg").click(() => {
  // download();
  // changeBackgroundStyle();
});
function changeBackgroundStyle() {
  const code = 'document.body.style.filter = "grayscale(3)";';
  executeScriptToCurrentTab(code);
}

function download() {
  let prefix = document.getElementById("prefixInput").value;
  console.log(prefix);
  let str = '';
  // let str = JSON.stringify({
  //   "sa.test": "hahaha",
  // });
  list.forEach(item=>{
    let key = `${prefix}.${getRandomString(6)}`;
    obj[key] = item;
  });
  console.log(obj);
  str = JSON.stringify(obj);
  str.replace('",', '"\n')
  chrome.downloads.download(
    {
      url: "data:," + str,
      filename: "test.yml",
      conflictAction: "uniquify",
    },
    function (id) {

    }
  );
}

// chrome.runtime.onMessage.addListener((req,sender, sendResponse) => {
//   sendResponse('我收到了你的来信')
//   console.log('接收了来自 content.js的消息', req.info)
// })

// 建立长连接
$("#long_connect").click(() => {
  getCurrentTabId((tabId) => {
    var port = chrome.tabs.connect(tabId, {name: 'test-connect'});
    port.postMessage({question: 'how are you?'});
    port.onMessage.addListener(function(msg) {
      alert('popup收到问候：'+ msg.answer);
      if(msg.answer && msg.answer.startsWith('fine, thank you, and you?'))
      {
        port.postMessage({question: "I'm fine too"});
      }
    });
  });
});

const _charStr = 'abacdefghjklmnopqrstuvwxyzABCDEFGHJKLMNOPQRSTUVWXYZ0123456789';

/**
 * 随机生成索引
 * @param min 最小值
 * @param max 最大值
 * @param i 当前获取位置
 */
 function getRandomIndex(min, max, i){
  let index = Math.floor(Math.random()*(max-min+1)+min),
      numStart = _charStr.length - 10;
  //如果字符串第一位是数字，则递归重新获取
  if(i==0&&index>=numStart){
      index = getRandomIndex(min, max, i);
  }
  //返回最终索引值
  return index;
}

/**
 * 随机生成字符串
 * @param len 指定生成字符串长度
 */
function getRandomString(len){
  let min = 0, max = _charStr.length-1, _str = '';
  //判断是否指定长度，否则默认长度为15
  len = len || 15;
  //循环生成字符串
  for(var i = 0, index; i < len; i++){
      index = getRandomIndex(min, max, i);
      _str += _charStr[index];
  }
  return _str;
}