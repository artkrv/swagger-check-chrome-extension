chrome.tabs?.onActivated.addListener(() => {
  setIcon(false);
  check();
});

chrome.action.onClicked.addListener(() => {
  check(true);
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete") {
    check();
  }
});

const check = (showAlert = false) => {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    const tab = tabs?.[0];

    if (!tab) {
      return;
    }

    const url = new URL(`${tab.url}`);
    const newUrl = new URL(`${url.origin}/swagger/index.html`);

    fetch(newUrl.href)
      .then((response) => {
        if (response.status === 200) {
          setIcon();
          if (showAlert) {
            chrome.tabs.create({ url: newUrl.href });
          }
        } else {
          setIcon(false);

          if (showAlert) {
            showNotAllowed();
          }
        }
      })
      .catch((error) => {
        console.log({ error });
        setIcon(false);
      });
  });
};

const setIcon = (active = true) =>
  chrome.action.setIcon({
    path: `./icons/${active ? "active16" : "inactive16"}.png`,
  });

const showNotAllowed = () => {
  chrome.notifications.create("NotAllowed", {
    type: "basic",
    iconUrl: "./icons/active.png",
    title: "Ouch! :(",
    message: "Swagger not allowed",
  });
  setTimeout(() => {
    chrome.notifications.clear("NotAllowed");
  }, 2000);
};
