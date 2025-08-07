// 为每个标签页存储状态的对象
let tabStates = {};

// 更新插件图标文字
function updateIcon(tabId) {
  const extensionEnabled = tabStates[tabId] || false;
  const text = extensionEnabled ? "ON" : "OFF";
  chrome.action.setBadgeText({ text: text, tabId: tabId });
  chrome.action.setBadgeBackgroundColor({ color: extensionEnabled ? "#4CAF50" : "#f44336", tabId: tabId });
}

// 监听插件图标点击事件
chrome.action.onClicked.addListener((tab) => {
  // 切换当前标签页的状态
  tabStates[tab.id] = !tabStates[tab.id];

  // 更新图标显示
  updateIcon(tab.id);

  // 更新designMode状态
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: (enabled) => {
      document.designMode = enabled ? "on" : "off";
    },
    args: [tabStates[tab.id]],
  });
});

// 监听标签页更新事件
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete') {
    // 页面加载完成后，更新图标状态
    updateIcon(tabId);
  }
});

// 监听标签页激活事件
chrome.tabs.onActivated.addListener((activeInfo) => {
  // 当切换到不同标签页时，更新图标状态
  updateIcon(activeInfo.tabId);
});