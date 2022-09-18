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
$("#update_bg_color").click(() => {
  const code = 'document.body.style.backgroundColor="red";';
  executeScriptToCurrentTab(code);
});

/**
 *页面加滤镜
 *
 */

$("#change_bg").click(() => {
  download();
  // changeBackgroundStyle();
});
function changeBackgroundStyle() {
  const code = 'document.body.style.filter = "grayscale(3)";';
  executeScriptToCurrentTab(code);
}

function download() {
  let str = JSON.stringify({
    "sa.ss": "hahaha",
  });
  chrome.downloads.download(
    {
      url: "data:," + str,
      // url: "data:,Hello%2C%20World!",
      filename: "test.yml",
      conflictAction: "uniquify",
    },
    function (id) {}
  );
}
