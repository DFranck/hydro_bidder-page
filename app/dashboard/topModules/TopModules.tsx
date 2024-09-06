import Image from "next/image";
import { mockGlobalState } from "../../mockData";

export enum TabLabel {
    VOTING = 'voting',
    DEPLOYED = 'deployed',
    LOCKUPS = 'lockups',
    TRIBUTE = 'tribute'
};

export const DashboardTopModules = ({ tab, onTabChange }: {
    tab: TabLabel
    onTabChange?: (value: TabLabel) => void
}) => {
    const bgColor = 'bg-transparent bg-[linear-gradient(180deg,rgba(0,59,147,0.30)_0%,rgba(0,97,255,0.70)_100%)]';
    const activeBgColor = 'bg-white bg-[linear-gradient(180deg,rgba(255,255,255,1)_64%,rgba(0,35,255,1)_64%)]';
    const isTributeActive = tab === TabLabel.TRIBUTE;
    // const isLockupsOrVotingActive = tab === TabLabel.LOCKUPS || tab === TabLabel.VOTING;
    const isLockupsOrVotingActive = false // Make it false by default because we only have one tab right now
    return (
        <div className="flex flex-row justify-between">
            {/* <div onClick={() => onTabChange && onTabChange(TabLabel.TRIBUTE)} className={`relative cursor-pointer flex w-[380px] h-[360px] flex-col shrink-0 p-6 rounded-[10px] ${tab === TabLabel.TRIBUTE ? activeBgColor : bgColor}`}>
                <Image alt="Rewards snapshot" src={isTributeActive ? '/images/Rewards_Light-black.svg' : '/images/Rewards_Light.svg'} width={100} height={100} />
                <div
                    onClick={() => undefined}
                    className="absolute top-4 right-4 inline-flex h-10 justify-center items-center gap-2.5 shrink-0 px-6 py-0 rounded-[10px] bg-[#00FFC2] text-[#080815] text-center text-xl not-italic font-medium leading-[21px]"
                >
                    Claim Rewards
                </div>
                <h3 className={`py-4 ${isTributeActive ? 'text-[#080815]' : 'text-white'}`}>Rewards snapshot</h3>
                <p className={`text-xl not-italic font-normal leading-[150%] ${isTributeActive ? 'text-[#080815]' : 'text-white'}`}>Your ROI on your staked stATOM</p>
                <p className={`text-[${isTributeActive ? 'white' : '#E4B472'}] slashed-zero text-5xl not-italic font-bold leading-[124.7%] tracking-[-1.296px] pt-[30px]`}>123</p>
                <p className={`text-[${isTributeActive ? 'white' : '#FFE1B8'}] slashed-zero text-base not-italic font-medium leading-[130%] uppercase`}>USDC EQUIVALENT</p>
            </div> */}
            <div onClick={() => onTabChange && onTabChange(TabLabel.LOCKUPS)} className={`gap-[155px] relative cursor-pointer flex w-[820px] h-[360px] flex-row shrink-0 p-6 rounded-[10px] ${isLockupsOrVotingActive ? activeBgColor : bgColor}`}>
                <div className="flex flex-col">
                    <Image alt="Locked ATOM" src={isLockupsOrVotingActive ? '/images/Lock_Light-black.svg' : '/images/Lock_Light.svg'} width={100} height={100} />
                    <h3 className={`py-4 ${isLockupsOrVotingActive ? 'text-[#080815]' : 'text-white'}`}>Locked ATOM</h3>
                    <p className={`text-xl not-italic font-normal leading-[150%] ${isLockupsOrVotingActive ? 'text-[#080815]' : 'text-white'}`}>Your locked ATOM balance</p>
                    <p className={`text-[${isLockupsOrVotingActive ? 'white' : '#E4B472'}] slashed-zero text-5xl not-italic font-bold leading-[124.7%] tracking-[-1.296px] pt-[30px]`}>{mockGlobalState.totalLockedTokens}</p>
                    <p className={`text-[${isLockupsOrVotingActive ? 'white' : '#FFE1B8'}] slashed-zero text-base not-italic font-medium leading-[130%] uppercase`}>IN 3 Lockups</p>
                </div>
                <div className="flex flex-col">
                    <Image alt="Voting Power" src={isLockupsOrVotingActive ? '/images/Wallet_Light-black.svg' : '/images/Wallet_Light.svg'} width={100} height={100} />
                    <div
                        onClick={() => undefined}
                        className="absolute top-4 right-4 inline-flex h-10 justify-center items-center gap-2.5 shrink-0 px-6 py-0 rounded-[10px] bg-[#00FFC2] text-[#080815] text-center text-xl not-italic font-medium leading-[21px]"
                    >
                        New Lockup
                    </div>
                    <h3 className={`py-4 ${isLockupsOrVotingActive ? 'text-[#080815]' : 'text-white'}`}>Voting Power</h3>
                    <p className={`text-xl not-italic font-normal leading-[150%] ${isLockupsOrVotingActive ? 'text-[#080815]' : 'text-white'}`}>Your current Voting Power</p>
                    <p className={`text-[${isLockupsOrVotingActive ? 'white' : '#E4B472'}] slashed-zero text-5xl not-italic font-bold leading-[124.7%] tracking-[-1.296px] pt-[30px]`}>456</p>
                    <p className={`text-[${isLockupsOrVotingActive ? 'white' : '#FFE1B8'}] slashed-zero text-base not-italic font-medium leading-[130%] uppercase`}>until (pull date of soonest lockup)</p>
                </div>
            </div>
        </div>
    )
}

export const ProposalListTopModules = () => {
    const bgColor = 'bg-transparent bg-[linear-gradient(180deg,rgba(0,59,147,0.30)_0%,rgba(0,97,255,0.70)_100%)]';
    return (
        <div className="flex flex-row justify-between">
            <div className={`flex w-[380px] h-[206px] flex-col shrink-0 p-6 rounded-[10px] ${bgColor}`}>
                <h3 className={`pb-4 text-white whitespace-pre-wrap`}>Current Round <br />Tribute Value</h3>
                <p className={`text-[#E4B472] slashed-zero text-5xl not-italic font-bold leading-[124.7%] tracking-[-1.296px]`}>{12345.67.toLocaleString('en-US', { maximumFractionDigits: 2, style: "currency", currency: "USD" })}</p>
                <p className={`text-[#FFE1B8] slashed-zero text-base not-italic font-medium leading-[130%] uppercase`}>USDC EQUIVALENT</p>
            </div>
            <div className={`flex w-[380px] h-[206px] flex-col shrink-0 p-6 rounded-[10px] ${bgColor}`}>
                <h3 className={`pb-4 text-white whitespace-pre-wrap`}>Current Round <br />Time Remaining</h3>
                <p className={`text-[#E4B472] slashed-zero text-5xl not-italic font-bold leading-[124.7%] tracking-[-1.296px]`}>{'00:10'}</p>
                <p className={`text-[#FFE1B8] slashed-zero text-base not-italic font-medium leading-[130%] uppercase`}>DAYS: HOURS</p>
            </div>
            <div className={`flex w-[380px] h-[206px] flex-col shrink-0 p-6 rounded-[10px] ${bgColor}`}>
                <h3 className={`pb-4 text-white whitespace-pre-wrap`}>Total Locked<br />ATOM</h3>
                <p className={`text-[#E4B472] slashed-zero text-5xl not-italic font-bold leading-[124.7%] tracking-[-1.296px]`}>{12345.00.toLocaleString('en-US', { maximumFractionDigits: 2 })}</p>
                <p className={`text-[#FFE1B8] slashed-zero text-base not-italic font-medium leading-[130%] uppercase`}>$1,200,534 USDC Equivalent</p>
            </div>
        </div>
    )
}