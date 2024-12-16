export default function UserMessage(message) {
    return (
        `
            <div class="flex items-end gap-2.5 my-2 justify-start flex-row-reverse">
                <img class="w-10 h-10 rounded-full" src="./media/user-profile.jpg" alt="Profile Image">
                <div class="flex flex-col w-full max-w-[480px] leading-1.5 p-4 bg-gray-100 rounded-s-xl rounded-se-xl dark:bg-spotify-grey dark:border-gray-600 border-2">
                    <div class="flex items-center space-x-2 rtl:space-x-reverse">
                        <span class="text-sm font-semibold text-gray-900 dark:text-white">Marco Insabato</span>
                    </div>
                    <p class="text-sm font-normal py-2.5 text-gray-900 dark:text-white">${message}</p>
                </div>
            </div>
        `
    )
}