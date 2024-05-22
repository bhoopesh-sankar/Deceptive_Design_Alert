const endpoint = "http://127.0.0.1:5000/";
const descriptions = {
  "Sneaking": "A strategy called 'sneaking' involves using little, covert movements. It frequently denotes a level of intelligence or stealth in accomplishing an objective without bringing unwanted notice to oneself.",
  "Urgency": "Urgency refers to the immediate need or importance of taking action. It implies that there is a time-sensitive aspect, encouraging individuals to act promptly to avoid missing out on a benefit or addressing a problem.",
  "Misdirection": "Distracting attention or focus from the primary idea or goal is known as misdirection. It has the ability to skew people's perception by getting them to focus on one thing while ignoring other things going on.",
  "Social Proof": "Social proof is the influence that others' actions and opinions have on our own decisions. It suggests that if many people are doing or endorsing something, it must be worthwhile or correct, influencing individuals to follow suit.",
  "Scarcity": "Scarcity is when something is perceived as limited or in short supply. It creates a sense of urgency by suggesting that the opportunity is rare or might not be available for long.",
  "Obstruction": "Obstruction is the act of creating barriers or obstacles that impede progress. It can be intentional or unintentional, hindering someone's ability to proceed with a certain action or goal.",
  "Forced Action": "Forced action involves pressuring or compelling individuals to take a specific action. It may leverage various tactics to limit choices or create a situation where individuals feel compelled to make a decision they might not have taken otherwise.",
};

function scrape() {
  // website has already been analyzed
  if (document.getElementById("chosen_count")) {
    return;
  }

  // aggregate all DOM elements on the page
  let elements = segments(document.body);
  let filtered_elements = [];

  for (let i = 0; i < elements.length; i++) {
    let text = elements[i].innerText.trim().replace(/\t/g, " ");
    if (text.length == 0) {
      continue;
    }
    filtered_elements.push(text);
  }

  // post to the web server
  fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tokens: filtered_elements }),
  })
    .then((resp) => resp.json())
    .then((data) => {
      // data = data.replace(/'/g, '"');
      // json = JSON.parse(data);
      // let dp_count = 0;
      let element_index = 0;
      let scar = 0,urg = 0,sp = 0,misd = 0,obs = 0,snek = 0;

      for (const key in data) {
        if (data.hasOwnProperty(key)) {
          const value = data[key];
          element_index +=1;
          for (let i = 0; i < elements.length; i++) {
            let text = elements[i].innerText.trim().replace(/\t/g, " ");
            if (text.length != 0 && text == key) {
              if(value == "Scarcity") {
                scar +=1;
              }else if(value === "Social Proof") {
                sp +=1;
              }else if(value === "Obstruction") {
                obs +=1;
              }else if(value === "Urgency") {
                urg +=1;
              }else if(value === "Misdirection") {
                misd +=1;
              }else if(value === "Sneaking") {
                snek +=1;
              }
              highlight(elements[i], value);

              break;
            }
          }
          // const matchingElement = filtered_elements.find(element => element == key);
          // if (matchingElement) {
          //   highlight(matchingElement,value);
          // }
        }
      }

     

      // store number of dark patterns
      let g = document.createElement("div");
      g.id = "chosen_count";
      g.value = element_index;
      g.scarcity = scar;
      g.urgency = urg;
      g.social_Proof = sp;
      g.obstruction = obs;
      g.misdirection = misd;
      g.sneaking = snek;
      g.style.opacity = 0;
      g.style.position = "fixed";
      document.body.appendChild(g);
      sendDarkPatterns(g.value,g.scarcity,g.urgency,g.social_Proof,g.misdirection,g.obstruction,g.sneaking);
    })
    .catch((error) => {
      alert(error);
      alert(error.stack);
    });
}

function highlight(element, type) {
    element.classList.add("chosen-highlight");

  let body = document.createElement("span");
  body.classList.add("chosen-highlight-body");

  /* header */
  let header = document.createElement("div");
  header.classList.add("modal-header");
  let headerText = document.createElement("h1");
  headerText.innerHTML = type + " Pattern";
  header.appendChild(headerText);
  body.appendChild(header);

  /* content */
  let content = document.createElement("div");
  content.classList.add("modal-content");
  content.innerHTML = descriptions[type];
  body.appendChild(content);

  element.appendChild(body);
  
}

function sendDarkPatterns(number,scar,urg,sp,misd,obs,snek) {
  chrome.runtime.sendMessage({
    message: "update_current_count",
    count: number,
    scarcity: scar,
    sneaking: snek,
    misdirection: misd,
    urgency: urg,
    social_Proof: sp,
    obstruction: obs
  });
}


function sendSearchType(number) {
  chrome.runtime.sendMessage({
    message: "update_search_type",
    count: number,
  });
}


chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.message === "analyze_site") {
    scrape();
  } else if (request.message === "popup_open") {
    let element = document.getElementById("chosen_count");
    if (element) {
      sendDarkPatterns(element.value);
    }
  }
});

function searching_pattern(){
  var searchInput = document.getElementById("searchInput").value;

    // Send the input value to your Python backend
    fetch("http://127.0.0.1:5000/process", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: "search=" + encodeURIComponent(searchInput),
    })
    .then(response => response.json())
    .then(data => {
        // Update the search output on your HTML page
        let k = document.createElement("div");
        k.id = "chosen_search";
        k.value = data;
        k.style.opacity = 0;
        k.style.position = "fixed";
        document.body.appendChild(k);
        sendSearchType(k.value);
        
    })
    .catch(error => {
        console.error('Error:', error);
        // Handle error as needed
    });
}


chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.message === "analyze_searching") {
  searching_pattern();
  } else if (request.message === "popup_open") {
    let element = document.getElementById("chosen_search");
    if (element) {
      sendSearchType(element.value);
    }
  }
});
