export default function AssistantMessage(message) {
    return (`
        <div class="flex items-end gap-2.5 my-2">
            <img class="w-10 h-10 rounded-full" src="./media/bot-profile.png" alt="Profile Image">
            <div class="flex flex-col w-full max-w-[480px] leading-1.5 p-4  bg-gray-100 rounded-e-xl rounded-ss-xl dark:bg-spotify-grey dark:border-aulab-yellow border-2">
                <div class="flex items-center space-x-2 rtl:space-x-reverse">
                    <span class="text-sm font-semibold text-gray-900 dark:text-white">SpotiGiPify</span>
                </div>
                <p class="text-sm font-normal py-2.5 text-gray-900 dark:text-white">${message}</p>
            </div>
        </div>
    `)
}
