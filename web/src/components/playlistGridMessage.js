export default function PlaylistGridMessage(playlist) {

console.log(playlist);

return (`
<div class="flex items-end gap-2.5 my-2">
   <img class="w-10 h-10 rounded-full" src="./media/bot-profile.png" alt="Profile Image">
   <div class="flex flex-col gap-1 w-full">
      <div class="flex flex-col w-full leading-1.5 p-4 border-gray-200 bg-gray-100 rounded-e-xl rounded-ss-xl dark:bg-spotify-grey dark:border-aulab-yellow border-2">
         <div class="flex items-center space-x-2 rtl:space-x-reverse mb-2">
            <span class="text-sm font-semibold text-gray-900 dark:text-white">${playlist.name}</span>
         </div>
         <div class="my-2.5 flex flex-col gap-2">
            ${
                playlist.tracks.map((track) => {
                    return (`
                        <div class="group relative flex gap-x-2">
                            <a href="${track.spotify_external_url}" target="_blank">
                                <img src="${track.album_image}" class="rounded-lg w-14" />
                            </a>
                            <div>
                                <p class="text-sm text-white">${track.name}</p>   
                                <span class="text-xs text-gray-400" >${track.artist}</span>
                            </div> 
                            
                        </div>
                    `)
                }).toString().replace(/,/g, '')
            }

         </div>
      </div>
   </div>
</div>
`)
}