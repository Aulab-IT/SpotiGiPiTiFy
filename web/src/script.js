const chatForm = document.querySelector('#chatForm');
const responseDiv = document.querySelector('#response'); 
const message =  document.querySelector('#message');

let messages = [];

message.addEventListener('keydown', (e) => {
    e.key === 'Enter' && !e.shiftKey && formSubmit(e);
})
chatForm.addEventListener('submit', formSubmit);

const userMessageTemplate = `
<div class="flex items-end gap-2.5 my-2 justify-start flex-row-reverse">
   <img class="w-10 h-10 rounded-full" src="./media/user-profile.jpg" alt="Profile Image">
   <div class="flex flex-col w-full max-w-[480px] leading-1.5 p-4 bg-gray-100 rounded-s-xl rounded-se-xl dark:bg-spotify-grey dark:border-spotify-green border-2">
      <div class="flex items-center space-x-2 rtl:space-x-reverse">
         <span class="text-sm font-semibold text-gray-900 dark:text-white">Marco Insabato</span>
      </div>
      <p class="text-sm font-normal py-2.5 text-gray-900 dark:text-white">{message}</p>
   </div>
</div>

`
const assistantMessageTemplate = `
<div class="flex items-end gap-2.5 my-2">
   <img class="w-10 h-10 rounded-full" src="./media/bot-profile.png" alt="Profile Image">
   <div class="flex flex-col w-full max-w-[480px] leading-1.5 p-4  bg-gray-100 rounded-e-xl rounded-ss-xl dark:bg-spotify-grey dark:border-aulab-yellow border-2">
      <div class="flex items-center space-x-2 rtl:space-x-reverse">
         <span class="text-sm font-semibold text-gray-900 dark:text-white">SpoGPTfy</span>
      </div>
      <p class="text-sm font-normal py-2.5 text-gray-900 dark:text-white">{message}</p>
   </div>
</div>

`

async function formSubmit(e) {
    e.preventDefault();

    if(!message.value) {
        return;
    }

    messages.push(
        {"role" : "user" , "content" : message.value}
    );

    displayMessages(messages)
    
    message.value = ''
    
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
}

function displayMessages(messages) {
    responseDiv.innerHTML = '';

    console.dir(messages)

    messages.forEach(message => {
        let div = document.createElement('div');

        if(message.role === 'user') {
            div.innerHTML = userMessageTemplate.replace('{message}' , message.content);
        }

        if(message.role === 'tool' && message.name === 'speak_to_user') {
            div.innerHTML = assistantMessageTemplate.replace('{message}' , message.content);
        }  

        responseDiv.appendChild(div);
    });
}


