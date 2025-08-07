// 默认状态为off
let extensionEnabled = false;

// 更新插件图标文字
function updateIcon() {
  const text = extensionEnabled ? "ON" : "OFF";
  chrome.action.setBadgeText({ text: text });
  chrome.action.setBadgeBackgroundColor({ color: extensionEnabled ? "#4CAF50" : "#f44336" });
}

// 监听插件图标点击事件
chrome.action.onClicked.addListener((tab) => {
  // 切换状态
  extensionEnabled = !extensionEnabled;

  // 更新图标显示
  updateIcon();

  // 更新designMode状态
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: (enabled) => {
      document.designMode = enabled ? "on" : "off";
    },
    args: [extensionEnabled],
  });
});

// 初始化图标状态
updateIcon();