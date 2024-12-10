const chatForm = document.querySelector('#chatForm');
const responseDiv = document.querySelector('#response'); 
let messages = [];

chatForm.addEventListener('submit', formSubmit);

async function formSubmit(e) {
    e.preventDefault();

    
    const message =  document.querySelector('#message');

    if(!message.value) {
        return;
    }

    messages.push(
        {"role" : "user" , "content" : message.value}
    );
    
    const response = await fetch('http://127.0.0.1:8080/chat/completion' , {
        method : 'POST',
        headers : {
            'Content-Type' : 'application/json',
        },
        body : JSON.stringify({
            messages : messages,
        })
    })

    const data = await response.json();
    
    messages = data
    displayMessages(messages)
    // responseDiv.innerHTML = data.choices[0].message.content;
    

    message.value = ''
}

function displayMessages(messages) {
    responseDiv.innerHTML = '';

    messages.forEach(message => {
        let div = document.createElement('div');
        div.textContent = message.role + ": " + message.content;
        responseDiv.appendChild(div);
    });
}
