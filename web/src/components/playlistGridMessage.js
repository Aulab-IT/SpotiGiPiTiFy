export default function PlaylistGridMessage(playlist , call_id) {

console.log(`save-playlist-${call_id}`);

return (`
<div class="flex items-end gap-2.5 my-2">
   <img class="w-10 h-10 rounded-full" src="./media/bot-profile.png" alt="Profile Image">
   <div class="flex flex-col gap-1 w-full">
      <div class="flex flex-col w-full leading-1.5 p-4 border-gray-200 bg-gray-100 rounded-e-xl rounded-ss-xl dark:bg-spotify-grey dark:border-aulab-yellow border-2">
         <div class="flex items-center space-x-2 rtl:space-x-reverse mb-2">
            <span class="text-sm font-semibold text-gray-900 dark:text-white">${playlist.name}</span>
         </div>
         <p class="text-sm font-normal text-gray-900 dark:text-white">This is the new office <3</p>
         <div class="my-2.5">
            ${
                playlist.tracks.map((track) => {
                    return (`
                        <div class="group relative">
                            <span>${track.artist}</span>
                            <p class="text-sm text-white">${track.name}</p>   
                            <!--  <div class="absolute w-full h-full bg-gray-900/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg flex items-center justify-center">
                                <button data-tooltip-target="download-image-1" class="inline-flex items-center justify-center rounded-full h-8 w-8 bg-white/30 hover:bg-white/50 focus:ring-4 focus:outline-none dark:text-white focus:ring-gray-50">
                                    <svg class="w-4 h-4 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 18">
                                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 1v11m0 0 4-4m-4 4L4 8m11 4v3a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-3"/>
                                    </svg>
                                </button>
                                <div id="download-image-1" role="tooltip" class="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700">
                                    Download image
                                    <div class="tooltip-arrow" data-popper-arrow></div>
                                </div>
                            </div> -->
                            <!-- <img src="/docs/images/blog/image-1.jpg" class="rounded-lg" /> -->
                        </div>
                    `)
                })
            }

         </div>
         <div class="flex justify-between items-center">
            <span class="text-sm font-normal text-gray-500 dark:text-gray-400">Salva la playlist su spotify:</span>
            <button id="save-playlist-${call_id}" class="text-sm text-blue-700 dark:text-blue-500 font-medium inline-flex items-center hover:underline">
                <svg class="w-3 h-3 me-1.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 18">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 1v11m0 0 4-4m-4 4L4 8m11 4v3a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-3"/>
                </svg>
                Save all
            </button>
         </div>
      </div>
   </div>
</div>
`)
}