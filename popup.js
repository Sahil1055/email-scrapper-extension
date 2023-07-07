let scrapeEmails = document.getElementById
('scrapeEmails');

let list = document.getElementById('emailList');

// // Handler to receive emails from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    let emails = request.emails;

    // Clear existing email list
    list.innerHTML = '';

    if (emails == null || emails.length == 0) {
        let li = document.createElement('li');
        li.innerText = "No emails found";
        list.appendChild(li);
    } else {
        emails.forEach((email) => {
            let li = document.createElement('li');
            li.innerText = email;
            list.appendChild(li);
        });
    }
});


// Buttons click event listener

scrapeEmails.addEventListener("click",async ()=> {
    //get current active tab of chrome window (chrome scripting api)
    let [tab]= await chrome.tabs.query({active:
    true, currentWindow: true});

    //executing script to parse emails on page
    chrome.scripting.executeScript ({
        target: {tabId: tab.id},
        func: scrapeEmailsFromPage,
    });
})

// Function to scrape emails
function scrapeEmailsFromPage() {
    const emailRegEx = /[\w\.=-]+@[\w\.-]+\.[\w]{2,3}/;
    
    let elements = document.querySelectorAll('body *');
    let emailsSet = new Set(); // Use a Set to store unique email addresses
    
    elements.forEach((element) => {
      let text = element.innerHTML;
      let matches = text.match(emailRegEx);
      
      if (matches) {
        matches.forEach((email) => {
          emailsSet.add(email);
        });
      }
    });
    
    let emails = Array.from(emailsSet); // Convert Set to Array
    chrome.runtime.sendMessage({ emails });
  }
  
