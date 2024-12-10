const chatForm = document.querySelector('#chatForm');
const responseDiv = document.querySelector('#response'); 
const message =  document.querySelector('#message');

import AssistantMessage from './components/assistantMessage.js';
import UserMessage from './components/userMessage.js';
import PlaylistGridMessage from './components/playlistGridMessage.js';
// let messages = [];

let messages = [
    {
        "role": "user",
        "content": "ciao"
    },
    {
        "content": null,
        "refusal": null,
        "role": "assistant",
        "audio": null,
        "function_call": null,
        "tool_calls": [
            {
                "id": "call_j4VhINGxyVjageDC55hdzOGr",
                "function": {
                    "arguments": "{\"message\":\"Ciao! Come stai oggi? Posso aiutarti a creare una playlist su Spotify. Dimmi un po' come ti senti oggi!\"}",
                    "name": "speak_to_user"
                },
                "type": "function"
            }
        ]
    },
    {
        "tool_call_id": "call_j4VhINGxyVjageDC55hdzOGr",
        "role": "tool",
        "name": "speak_to_user",
        "content": "Ciao! Come stai oggi? Posso aiutarti a creare una playlist su Spotify. Dimmi un po' come ti senti oggi!"
    },
    {
        "role": "user",
        "content": "mi sento felice"
    },
    {
        "content": null,
        "refusal": null,
        "role": "assistant",
        "audio": null,
        "function_call": null,
        "tool_calls": [
            {
                "id": "call_qGLEPOeH3UkFVLMDw4TxmKuO",
                "function": {
                    "arguments": "{\"message\":\"Che bello sentirlo! Cosa ti rende felice oggi? Hai qualche attività speciale o un bel ricordo che ti fa sentire così?\"}",
                    "name": "speak_to_user"
                },
                "type": "function"
            }
        ]
    },
    {
        "tool_call_id": "call_qGLEPOeH3UkFVLMDw4TxmKuO",
        "role": "tool",
        "name": "speak_to_user",
        "content": "Che bello sentirlo! Cosa ti rende felice oggi? Hai qualche attività speciale o un bel ricordo che ti fa sentire così?"
    },
    {
        "role": "user",
        "content": "e' il compleanno di annalisa"
    },
    {
        "content": null,
        "refusal": null,
        "role": "assistant",
        "audio": null,
        "function_call": null,
        "tool_calls": [
            {
                "id": "call_vOuvnVYXJf694uMKopVUpmhd",
                "function": {
                    "arguments": "{\"message\":\"Auguri ad Annalisa! I compleanni sono sempre un motivo di gioia. Stai organizzando qualcosa di speciale per lei?\"}",
                    "name": "speak_to_user"
                },
                "type": "function"
            }
        ]
    },
    {
        "tool_call_id": "call_vOuvnVYXJf694uMKopVUpmhd",
        "role": "tool",
        "name": "speak_to_user",
        "content": "Auguri ad Annalisa! I compleanni sono sempre un motivo di gioia. Stai organizzando qualcosa di speciale per lei?"
    },
    {
        "role": "user",
        "content": "una playlist"
    },
    {
        "content": null,
        "refusal": null,
        "role": "assistant",
        "audio": null,
        "function_call": null,
        "tool_calls": [
            {
                "id": "call_3O7ZOblsYFOGaqCi678OiM0K",
                "function": {
                    "arguments": "{\"message\":\"Perfetto! Una playlist è un'idea fantastica per festeggiare. Vuoi che inserisca delle canzoni particolari che piacciono ad Annalisa o delle canzoni felici e allegre per creare un'atmosfera festosa?\"}",
                    "name": "speak_to_user"
                },
                "type": "function"
            }
        ]
    },
    {
        "tool_call_id": "call_3O7ZOblsYFOGaqCi678OiM0K",
        "role": "tool",
        "name": "speak_to_user",
        "content": "Perfetto! Una playlist è un'idea fantastica per festeggiare. Vuoi che inserisca delle canzoni particolari che piacciono ad Annalisa o delle canzoni felici e allegre per creare un'atmosfera festosa?"
    },
    {
        "role": "user",
        "content": "vorrei delle canzoni felici dei musical"
    },
    {
        "content": null,
        "refusal": null,
        "role": "assistant",
        "audio": null,
        "function_call": null,
        "tool_calls": [
            {
                "id": "call_2yVZsx1FfBGVJRPPCZAduuFV",
                "function": {
                    "arguments": "{\"message\":\"Ottima scelta! Creerò una playlist con delle canzoni felici tratte da musical. Dammi un momento per metterla insieme.\"}",
                    "name": "speak_to_user"
                },
                "type": "function"
            }
        ]
    },
    {
        "tool_call_id": "call_2yVZsx1FfBGVJRPPCZAduuFV",
        "role": "tool",
        "name": "speak_to_user",
        "content": "Ottima scelta! Creerò una playlist con delle canzoni felici tratte da musical. Dammi un momento per metterla insieme."
    },
    {
        "role": "user",
        "content": "mi mostri la lista delle canzoni che hai scelto? "
    },
    // {
    //     "content": null,
    //     "refusal": null,
    //     "role": "assistant",
    //     "audio": null,
    //     "function_call": null,
    //     "tool_calls": [
    //         {
    //             "id": "call_DC1BldDm3IkH0y7jRgJZcgZ4",
    //             "function": {
    //                 "arguments": `{\"name\":\"Festa Musicale di Annalisa\",\"tracks\":[{\"name\":\"The Circle of Life\",\"artist\":\"Elton John\"},{\"name\":\"Mamma Mia\",\"artist\":\"ABBA\"},{\"name\":\"Good Morning Baltimore\",\"artist\":\"Hairspray Cast\"},{\"name\":\"You Can't Stop the Beat\",\"artist\":\"Hairspray Cast\"},{\"name\":\"Defying Gravity\",\"artist\":\"Idina Menzel & Kristin Chenoweth\"},{\"name\":\"Seasons of Love\",\"artist\":\"Rent Cast\"},{\"name\":\"Dancing Queen\",\"artist\":\"ABBA\"},{\"name\":\"Supercalifragilisticexpialidocious\",\"artist\":\"Julie Andrews & Dick Van Dyke\"},{\"name\":\"I Just Can't Wait to Be King\",\"artist\":\"Elton John\"},{\"name\":\"We're All in This Together\",\"artist\":\"High School Musical Cast\"}]}`,
    //                 "name": "show_playlist_to_user"
    //             },
    //             "type": "function"
    //         }
    //     ]
    // },
    // {
    //     "tool_call_id": "call_DC1BldDm3IkH0y7jRgJZcgZ4",
    //     "role": "tool",
    //     "name": "show_playlist_to_user",
    //     "content": `{\"name\": \"Festa Musicale di Annalisa\", \"tracks\": [{\"name\": \"The Circle of Life\", \"artist\": \"Elton John\"}, {\"name\": \"Mamma Mia\", \"artist\": \"ABBA\"}, {\"name\": \"Good Morning Baltimore\", \"artist\": \"Hairspray Cast\"}, {\"name\": \"You Can't Stop the Beat\", \"artist\": \"Hairspray Cast\"}, {\"name\": \"Defying Gravity\", \"artist\": \"Idina Menzel & Kristin Chenoweth\"}, {\"name\": \"Seasons of Love\", \"artist\": \"Rent Cast\"}, {\"name\": \"Dancing Queen\", \"artist\": \"ABBA\"}, {\"name\": \"Supercalifragilisticexpialidocious\", \"artist\": \"Julie Andrews & Dick Van Dyke\"}, {\"name\": \"I Just Can't Wait to Be King\", \"artist\": \"Elton John\"}, {\"name\": \"We're All in This Together\", \"artist\": \"High School Musical Cast\"}]}`
    // }
];



message.addEventListener('keydown', (e) => {
    e.key === 'Enter' && !e.shiftKey && formSubmit(e);
})

chatForm.addEventListener('submit', formSubmit);



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

        if(message.role === 'user' && !message.content.startsWith('action: ')) {
            div.innerHTML = UserMessage(message.content);

            responseDiv.appendChild(div);
        }

        if(message.role === 'tool' && message.name === 'speak_to_user') {
            div.innerHTML = AssistantMessage(message.content)

            responseDiv.appendChild(div);
        }

        if(message.role === 'tool' && message.name === 'show_playlist_to_user') {
            div.innerHTML = PlaylistGridMessage(JSON.parse(message.content) , message.tool_call_id);
            responseDiv.appendChild(div);

            let savePlaylistBtn = document.querySelector(`#save-playlist-${message.tool_call_id}`);

            savePlaylistBtn.addEventListener('click' , () => {
                savePlaylist(message.tool_call_id);
            })
        }
    });



    setTimeout(() => {
        responseDiv.scrollTop = responseDiv.scrollHeight;
    }, 300);

}

async function savePlaylist(tool_call_id){
    console.log(`Saving playlist with tool call id ${tool_call_id}`);

    messages.push(
        {"role" : "user" , "content" : `action: salva la playlist creata con il tool call id ${tool_call_id}`}
    );

    console.log("Messages before saving playlist: ", messages);

    const response = await fetch('http://127.0.0.1:8080/chat/completion' , {
        method : 'POST',
        headers : {
            'Content-Type' : 'application/json',
        },
        body : JSON.stringify({
            messages : messages,
        })
    });

    console.log("Response from server: ", response);

    const data = await response.json();
    
    console.log("Data from server: ", data);
    
    messages = data
    displayMessages(messages)
}


displayMessages(messages)