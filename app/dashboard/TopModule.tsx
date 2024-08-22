import Image from "next/image";

export enum TabLabel {
    VOTING = 'voting',
    LOCKUPS = 'lockups',
    TRIBUTE = 'tribute'
};

type TopModule = {
    onTabChange: (value: TabLabel) => void,
    tab: TabLabel,
    title: string,
    description: string,
    icon: string,
    activeIcon: string,
    value: number,
    valueDescription: string,
    isActive?: boolean;
    hasRewards?: boolean;
}

const TopModule = ({ onTabChange, tab, title, description, icon, activeIcon, value, valueDescription, isActive, hasRewards }: TopModule) => {
    const bgColor = 'bg-transparent bg-[linear-gradient(180deg,rgba(0,59,147,0.30)_0%,rgba(0,97,255,0.70)_100%)]';
    const activeBgColor = 'bg-white bg-[linear-gradient(180deg,rgba(255,255,255,1)_64%,rgba(0,35,255,1)_64%)]';
    return (
        <div onClick={() => onTabChange(tab)} className={`relative cursor-pointer flex w-[380px] h-[360px] flex-col shrink-0 p-6 rounded-[10px] ${isActive ? activeBgColor : bgColor}`}>
            <Image alt={title} src={isActive ? activeIcon : icon} width={100} height={100} />
            {hasRewards && <div className="absolute top-4 right-4 inline-flex h-10 justify-center items-center gap-2.5 shrink-0 px-6 py-0 rounded-[10px] bg-[#00FFC2] text-[#080815] text-center text-xl not-italic font-medium leading-[21px]">Claim Rewards</div>}
            <h3 className={`py-4 ${isActive ? 'text-[#080815]' : 'text-white'}`}>{title}</h3>
            <p className={`text-xl not-italic font-normal leading-[150%]  ${isActive ? 'text-[#080815]' : 'text-white'}`}>{description}</p>
            <p className={`text-[${isActive ? 'white' : '#FFE1B8'}] slashed-zero text-5xl not-italic font-bold leading-[124.7%] tracking-[-1.296px] pt-[30px]`}>{value}</p>
            <p className={`text-[${isActive ? 'white' : '#FFE1B8'}] slashed-zero text-base not-italic font-medium leading-[130%] uppercase`}>{valueDescription}</p>
        </div>
    )
}

export default TopModule;