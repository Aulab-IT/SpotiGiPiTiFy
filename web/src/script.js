const chatForm = document.querySelector('#chatForm');
const responseDiv = document.querySelector('#response'); 
const message =  document.querySelector('#message');
const playlistTracks = document.querySelector('#playlistTracks');
const playlistName = document.querySelector('#playlistName');
const savePlaylistBtn = document.querySelector("#savePlaylistBtn")

import AssistantMessage from './components/assistantMessage.js';
import UserMessage from './components/userMessage.js';

import LoadingMessage from './components/loadingMessage.js';

let messages = [];
let playlist = {}


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
    
    console.log(messages);
    
    renderMessages()
    renderPlaylist()
}

function renderMessages() {
    responseDiv.innerHTML = '';

    console.dir(messages)

    messages.forEach(message => {
        let div = document.createElement('div');

        if(message.role === 'user') {
            div.innerHTML = UserMessage(message.content);

            responseDiv.appendChild(div);
        }

        if(message.role === 'tool' && message.name === 'speak_to_user') {
            div.innerHTML = AssistantMessage(message.content)

            responseDiv.appendChild(div);
        }
    });



    setTimeout(() => {
        responseDiv.scrollTop = responseDiv.scrollHeight;
    }, 300);

}

function renderPlaylist() {

    if(playlist.tracks?.length) {
        savePlaylistBtn.classList.remove('hidden')
    } else {
        savePlaylistBtn.classList.add('hidden')
    }

    playlistTracks.innerHTML = '';
    playlistName.innerHTML = playlist.name ?? '<div class="h-4 bg-gray-200 rounded-full dark:bg-gray-700 w-96 mb-4 animate-pulse"></div>';

    if(playlist.tracks?.length) {
        
        playlist.tracks.forEach(track => {
            const a = document.createElement('a');
            a.setAttribute('href' , track.spotify_external_url )
            a.setAttribute("target" , "_blank")
    
            a.classList.add('group' , 'relative' , 'flex' , 'gap-x-2' , 'curson-pointer');
            a.innerHTML = `
                <div class="relative">
                    <div class="absolute transition-all bg-black bg-opacity-30 transparent w-full h-full rounded-lg opacity-0 group-hover:opacity-100 flex items-center justify-center">
                        <svg class="w-5 h-5 opacity-90 fill-spotify-green" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                            <path d="M320 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l82.7 0L201.4 265.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L448 109.3l0 82.7c0 17.7 14.3 32 32 32s32-14.3 32-32l0-160c0-17.7-14.3-32-32-32L320 0zM80 32C35.8 32 0 67.8 0 112L0 432c0 44.2 35.8 80 80 80l320 0c44.2 0 80-35.8 80-80l0-112c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 112c0 8.8-7.2 16-16 16L80 448c-8.8 0-16-7.2-16-16l0-320c0-8.8 7.2-16 16-16l112 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L80 32z"/>
                        </svg>
                    </div>
                    <img src="${track.album_image}" class="rounded-lg w-20" />
                </div>
                <div>
                    <p class="text-md font-semibold text-white group-hover:underline">${track.name}</p>   
                    <span class="text-sm text-gray-400 group-hover:underline" >${track.artist}</span>
                </div> 
            `;
    
            playlistTracks.appendChild(a);
        })
    } else {
        for (let i = 0; i < 5; i++) {

            const div = document.createElement('div');

            div.classList.add("space-y-8", "animate-pulse", "space-y-0", "space-x-8", "flex", "items-center");
            
            div.innerHTML = `
                <div class="flex items-center justify-center h-20 bg-gray-300 rounded w-24 dark:bg-gray-700">
                <svg class="w-5 h-5 text-gray-200 dark:text-gray-600" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
                    <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z"/>
                </svg>
                </div>
                <div class="w-full">
                <div class="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-48 mb-4"></div>
                <div class="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[480px] mb-2.5"></div>

                </div>
                <span class="sr-only">Loading...</span>
            `
                playlistTracks.appendChild(div);
        }
    }

}

async function savePlaylist(e){
    if(!playlist.tracks.length) return

    const response = await fetch('http://127.0.0.1:8080/chat/save-playlist' , {
        method : 'POST',
        headers : {
            'Content-Type' : 'application/json',
        },
        body : JSON.stringify({
            playlist : playlist
        })
    });

    console.log("Response from server: ", response);

}

message.addEventListener('keydown', (e) => {
    e.key === 'Enter' && !e.shiftKey && formSubmit(e);
})

chatForm.addEventListener('submit', formSubmit);
savePlaylistBtn.addEventListener('click' , savePlaylist)

renderPlaylist() 