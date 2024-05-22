window.onload = function () {
  chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { message: "popup_open" });
  });

  document.getElementsByClassName("analyze-button")[0].onclick = function () {
    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { message: "analyze_site" });
      document.getElementsByClassName("number")[0].textContent = "detecting ...";
    });
  };

  document.getElementsByClassName("searching")[0].onclick = function () {
    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { message: "analyze_searching" });
      document.getElementsByClassName("search-output")[0].textContent = "detecting ...";
    });
  };
};

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.message === "update_current_count") {
    document.getElementsByClassName("number")[0].textContent = request.count;
    document.getElementsByClassName("scarcity")[0].textContent = request.scarcity;
    document.getElementsByClassName("social_Proof")[0].textContent = request.social_Proof;
    document.getElementsByClassName("misdirection")[0].textContent = request.misdirection;
    document.getElementsByClassName("urgency")[0].textContent = request.urgency;
    document.getElementsByClassName("sneaking")[0].textContent = request.sneaking;
    document.getElementsByClassName("obstruction")[0].textContent = request.obstruction;
  }
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.message === "update_search_type") {
    document.getElementsByClassName("search-output")[0].textContent = data;
    document.getElementById("output2").style.display = "block";
  }
});


