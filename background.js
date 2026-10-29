importScripts("clean.js");

// 현재 탭 주소를 정리해서 클립보드에 복사 (단축키 / 툴바 버튼)
function copyText(text) {
  const ta = document.createElement("textarea");
  ta.value = text;
  ta.style.cssText = "position:fixed;opacity:0";
  document.documentElement.appendChild(ta);
  ta.select();
  const ok = document.execCommand("copy");
  ta.remove();
  return ok;
}

function badge(text) {
  chrome.action.setBadgeText({ text });
  setTimeout(() => chrome.action.setBadgeText({ text: "" }), 1500);
}

async function copyCleanUrl(tab) {
  try {
    const [{ result }] = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: copyText,
      args: [self.cleanUrl(tab.url)],
    });
    badge(result ? "OK" : "!");
  } catch {
    badge("!");
  }
}

chrome.action.onClicked.addListener(copyCleanUrl);
chrome.commands.onCommand.addListener(async (command) => {
  if (command !== "copy-clean-url") return;
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (tab) copyCleanUrl(tab);
});
