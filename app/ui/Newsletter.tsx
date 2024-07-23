export const Newsletter = () => {
    return (
        <div className="flex flex-row px-[72px] py-[130px] items-center justify-between bg-[#080815]">
            <div className="flex flex-col">
                <h2>Sign up for updates</h2>
                <p className="text-xl not-italic font-medium leading-[150%]">
                    Stay up to date with the latest news and updates from Hydro.
                </p>
            </div>
            <form className="flex">

                <label htmlFor="email-address" className="sr-only">Email address</label>
                <input id="email-address" name="email" type="email" autoComplete="email" required={true} className="flex w-[500px] h-[60px] bg-[transparent] items-center shrink-0 border px-6 py-5 rounded-[10px] border-solid border-white" placeholder="Enter your email" />

                <button type="submit" className="flex w-[170px] h-[60px] bg-[#fff] justify-center items-center gap-2.5 shrink-0 px-6 py-5 rounded-[10px] text-[#080815] text-center text-xl not-italic font-medium leading-[21px] ml-[-170px]">Notify me</button>
            </form>
        </div>
    )
}