const chatForm = document.querySelector('#chatForm');
const responseDiv = document.querySelector('#response'); 
const message =  document.querySelector('#message');
const playlistDiv = document.querySelector('#playlist-response');

import AssistantMessage from './components/assistantMessage.js';
import UserMessage from './components/userMessage.js';
import PlaylistGridMessage from './components/playlistGridMessage.js';
import LoadingMessage from './components/loadingMessage.js';
// let messages = [];
let playlist = {};

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
                "id": "call_53P4QMQ9CJZqJsx41Hj4FzQd",
                "function": {
                    "arguments": "{\"message\":\"Ciao! Sono qui per aiutarti a creare una playlist su Spotify. Per quale occasione o attività hai bisogno della musica? Ad esempio, per rilassarti, studiare, allenarti, fare festa o viaggiare? E c'è un tema specifico che vuoi seguire?\"}",
                    "name": "speak_to_user"
                },
                "type": "function"
            }
        ]
    },
    {
        "tool_call_id": "call_53P4QMQ9CJZqJsx41Hj4FzQd",
        "role": "tool",
        "name": "speak_to_user",
        "content": "Ciao! Sono qui per aiutarti a creare una playlist su Spotify. Per quale occasione o attività hai bisogno della musica? Ad esempio, per rilassarti, studiare, allenarti, fare festa o viaggiare? E c'è un tema specifico che vuoi seguire?"
    },
    {
        "role": "user",
        "content": "Vorrei creare una playlist per fare l'amore. Vorrei una playlist romantica e calma"
    },
    {
        "content": null,
        "refusal": null,
        "role": "assistant",
        "audio": null,
        "function_call": null,
        "tool_calls": [
            {
                "id": "call_SzTcx4AnfCMZe9ZRV8UJHzQn",
                "function": {
                    "arguments": "{\"message\":\"Perfetto! Una playlist romantica e calma è l'ideale per creare l'atmosfera giusta. Passiamo al prossimo passo: che tipo di emozioni vuoi evocare con questa playlist? Hai preferenze per un ritmo veloce, medio o lento?\"}",
                    "name": "speak_to_user"
                },
                "type": "function"
            }
        ]
    },
    {
        "tool_call_id": "call_SzTcx4AnfCMZe9ZRV8UJHzQn",
        "role": "tool",
        "name": "speak_to_user",
        "content": "Perfetto! Una playlist romantica e calma è l'ideale per creare l'atmosfera giusta. Passiamo al prossimo passo: che tipo di emozioni vuoi evocare con questa playlist? Hai preferenze per un ritmo veloce, medio o lento?"
    },
    {
        "role": "user",
        "content": "la vorrei far bagnare, con un ritmo variabile"
    },
    {
        "content": null,
        "refusal": null,
        "role": "assistant",
        "audio": null,
        "function_call": null,
        "tool_calls": [
            {
                "id": "call_dFDdI2ZSdFQSX50OhOLDn5f2",
                "function": {
                    "arguments": "{\"message\":\"Capisco, quindi cercheremo di creare una playlist che alterni ritmi per mantenere l'atmosfera interessante e coinvolgente. Ora, quali generi musicali preferisci per questa playlist? Ad esempio, pop, jazz, R&B, soul, ecc.?\"}",
                    "name": "speak_to_user"
                },
                "type": "function"
            }
        ]
    },
    {
        "tool_call_id": "call_dFDdI2ZSdFQSX50OhOLDn5f2",
        "role": "tool",
        "name": "speak_to_user",
        "content": "Capisco, quindi cercheremo di creare una playlist che alterni ritmi per mantenere l'atmosfera interessante e coinvolgente. Ora, quali generi musicali preferisci per questa playlist? Ad esempio, pop, jazz, R&B, soul, ecc.?"
    },
    {
        "role": "user",
        "content": "jazz e R&B "
    },
    {
        "content": null,
        "refusal": null,
        "role": "assistant",
        "audio": null,
        "function_call": null,
        "tool_calls": [
            {
                "id": "call_tZxQe9tX1gXRgrgFhEGsdSHn",
                "function": {
                    "arguments": "{\"message\":\"Ottima scelta! Jazz e R&B sono perfetti per creare una playlist romantica e sensuale. Ci sono artisti specifici o brani che desideri includere o evitare? Preferisci musica famosa o alcuni pezzi meno conosciuti?\"}",
                    "name": "speak_to_user"
                },
                "type": "function"
            }
        ]
    },
    {
        "tool_call_id": "call_tZxQe9tX1gXRgrgFhEGsdSHn",
        "role": "tool",
        "name": "speak_to_user",
        "content": "Ottima scelta! Jazz e R&B sono perfetti per creare una playlist romantica e sensuale. Ci sono artisti specifici o brani che desideri includere o evitare? Preferisci musica famosa o alcuni pezzi meno conosciuti?"
    },
    {
        "role": "user",
        "content": "metterei berry white"
    },
    {
        "content": null,
        "refusal": null,
        "role": "assistant",
        "audio": null,
        "function_call": null,
        "tool_calls": [
            {
                "id": "call_dAP5wCTRCNqlaPs7ZFC4nb0c",
                "function": {
                    "arguments": "{\"message\":\"Berry White è un'ottima scelta per una playlist romantica! Vuoi che includa anche altri artisti o brani specifici, o posso selezionare io alcune canzoni di jazz e R&B che si adattano al mood? Inoltre, hai preferenze per la lingua o la provenienza dei brani?\"}",
                    "name": "speak_to_user"
                },
                "type": "function"
            }
        ]
    },
    {
        "tool_call_id": "call_dAP5wCTRCNqlaPs7ZFC4nb0c",
        "role": "tool",
        "name": "speak_to_user",
        "content": "Berry White è un'ottima scelta per una playlist romantica! Vuoi che includa anche altri artisti o brani specifici, o posso selezionare io alcune canzoni di jazz e R&B che si adattano al mood? Inoltre, hai preferenze per la lingua o la provenienza dei brani?"
    },
    {
        "role": "user",
        "content": "vorrei dei brani francesi "
    },
    {
        "content": null,
        "refusal": null,
        "role": "assistant",
        "audio": null,
        "function_call": null,
        "tool_calls": [
            {
                "id": "call_8BKuqIBuGjZVbJVWc7HOyNGc",
                "function": {
                    "arguments": "{\"message\":\"Perfetto, includerò alcuni brani francesi che si adattano al mood romantico e sensuale. Infine, quanto tempo totale vuoi che duri la playlist? Oppure hai in mente un numero specifico di brani?\"}",
                    "name": "speak_to_user"
                },
                "type": "function"
            }
        ]
    },
    {
        "tool_call_id": "call_8BKuqIBuGjZVbJVWc7HOyNGc",
        "role": "tool",
        "name": "speak_to_user",
        "content": "Perfetto, includerò alcuni brani francesi che si adattano al mood romantico e sensuale. Infine, quanto tempo totale vuoi che duri la playlist? Oppure hai in mente un numero specifico di brani?"
    }
]

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

    renderMessages(messages)
    
    message.value = ''

    let loadingMessage = document.createElement('div')
    loadingMessage.innerHTML = LoadingMessage();
    responseDiv.appendChild(loadingMessage);
    
    const response = await fetch('http://127.0.0.1:8080/chat/spotify-assistant' , {
        method : 'POST',
        headers : {
            'Content-Type' : 'application/json',
        },
        body : JSON.stringify({
            messages : messages,
            playlist : playlist
        })
    })

    const data = await response.json();

    messages = data.messages
    playlist = data.playlist

    renderMessages(messages)
    renderPlaylist(playlist)
}

function renderMessages(messages) {
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

function renderPlaylist(playlist) {
    let div = document.createElement('div');
    div.innerHTML = PlaylistGridMessage(playlist);
    playlistDiv.appendChild(div);
}

async function savePlaylist(tool_call_id){
    console.log(`Saving playlist with tool call id ${tool_call_id}`);

    messages.push(
        {"role" : "user" , "content" : `action: salva la playlist creata con il tool call id ${tool_call_id}`}
    );

    console.log("Messages before saving playlist: ", messages);

    const response = await fetch('http://127.0.0.1:8080/chat/spotify-assistant' , {
        method : 'POST',
        headers : {
            'Content-Type' : 'application/json',
        },
        body : JSON.stringify({
            messages : messages,
            playlist : playlist
        })
    });

    console.log("Response from server: ", response);

    const data = await response.json();
    
    console.log("Data from server: ", data);
    
    messages = data
    renderMessages(messages)
}


renderMessages(messages)