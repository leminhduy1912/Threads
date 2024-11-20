const Comments = () => {
    return (
        <section className="bg-gray-900 py-7 antialiased mt-3 rounded-xl ">
            <div className="max-w-2xl mx-auto px-4 ">
                <div className="bg-slate-800 p-4 rounded-lg">
                    <footer className="flex justify-between items-center mb-2 ">
                        <div className="flex items-center">
                            <p className="inline-flex items-center mr-3 text-sm text-gray-900 dark:text-white font-semibold"><img
                                className="mr-2 w-6 h-6 rounded-full"
                                src="https://flowbite.com/docs/images/people/profile-picture-2.jpg"
                                alt="Michael Gough" />Michael Gough</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                <time dateTime="2022-02-08"
                                    title="February 8th, 2022">Feb. 8, 2022</time>
                            </p>
                        </div>
                    </footer>
                    <p className="text-start text-gray-500 dark:text-gray-400">Very straight-to-point article. Really worth time reading. Thank you! But tools are just the
                        instruments for the UX designers. The knowledge of the design tools are as important as the
                        creation of the design strategy.</p>
                    <div className="flex items-center mt-4 space-x-4">
                        <button type="button"
                            className="flex items-center text-sm text-gray-500 hover:underline dark:text-gray-400 font-medium">
                            <svg className="mr-1.5 w-3.5 h-3.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 18">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5h5M5 8h2m6-3h2m-5 3h6m2-7H2a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h3v5l5-5h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1Z" />
                            </svg>
                            Reply
                        </button>
                    </div>
                </div>
                {/* </article> */}
                <article className="mt-3 p-6 mb-3 ml-6 lg:ml-12 text-base bg-slate-800 rounded-lg ">
                    <footer className="flex justify-between items-center mb-2">
                        <div className="flex items-center">
                            <p className="inline-flex items-center mr-3 text-sm text-gray-900 dark:text-white font-semibold"><img
                                className="mr-2 w-6 h-6 rounded-full"
                                src="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
                                alt="Jese Leos" />Jese Leos</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">

                            </p>
                        </div>
                    </footer>
                    <p className="text-start text-gray-500 dark:text-gray-400">Much appreciated! Glad you liked it ☺️</p>
                    <div className="flex items-center mt-4 space-x-4">
                        <button type="button"
                            className="flex items-center text-sm text-gray-500 hover:underline dark:text-gray-400 font-medium">
                            <svg className="mr-1.5 w-3.5 h-3.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 18">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5h5M5 8h2m6-3h2m-5 3h6m2-7H2a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h3v5l5-5h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1Z" />
                            </svg>
                            Reply
                        </button>
                    </div>
                </article>
            </div>
        </section>
    )
}
export default Comments