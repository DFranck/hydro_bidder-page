import Image from "next/image";

type TopModule = {
    title: string,
    description: string,
    icon: string,
    activeIcon: string,
    value: number,
    valueDescription: string,
    isActive?: boolean;
    hasRewards?: boolean;
}

const TopModule = ({ title, description, icon, activeIcon, value, valueDescription, isActive, hasRewards }: TopModule) => {
    return (
        <>
            <Image alt={title} src={isActive ? activeIcon : icon} width={100} height={100} />
            {hasRewards && <div className="absolute top-4 right-4 inline-flex h-10 justify-center items-center gap-2.5 shrink-0 px-6 py-0 rounded-[10px] bg-[#00FFC2] text-[#080815] text-center text-xl not-italic font-medium leading-[21px]">Claim Rewards</div>}
            <h3 className={`py-4 ${isActive ? 'text-[#080815]' : 'text-white'}`}>{title}</h3>
            <p className={`text-xl not-italic font-normal leading-[150%]  ${isActive ? 'text-[#080815]' : 'text-white'}`}>{description}</p>
            <p className={`text-[${isActive ? 'white' : '#E4B472'}] slashed-zero text-5xl not-italic font-bold leading-[124.7%] tracking-[-1.296px] pt-[30px]`}>{value}</p>
            <p className={`text-[${isActive ? 'white' : '#FFE1B8'}] slashed-zero text-base not-italic font-medium leading-[130%] uppercase`}>{valueDescription}</p>
        </>)
}

export default TopModule;