document.addEventListener("DOMContentLoaded", function () {
  const toggleSwitch = document.getElementById("toggleSwitch");
  const statusText = document.getElementById("statusText");

  // 获取当前标签页的design mode状态
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    const currentTab = tabs[0];

    // 获取当前状态
    chrome.scripting.executeScript(
      {
        target: { tabId: currentTab.id },
        func: () => document.designMode,
      },
      (results) => {
        if (results && results[0]) {
          const isDesignMode = results[0].result === "on";
          toggleSwitch.checked = isDesignMode;
          statusText.textContent = isDesignMode ? "ON" : "OFF";
        }
      }
    );
  });

  // 监听开关变化
  toggleSwitch.addEventListener("change", function () {
    const isEnabled = toggleSwitch.checked;
    statusText.textContent = isEnabled ? "ON" : "OFF";

    // 获取当前活动标签页
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const currentTab = tabs[0];

      // 设置designMode
      chrome.scripting.executeScript({
        target: { tabId: currentTab.id },
        func: (enabled) => {
          document.designMode = enabled ? "on" : "off";
        },
        args: [isEnabled],
      });
    });
  });
});
