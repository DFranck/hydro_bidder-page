import { useChain } from "@cosmos-kit/react";
import TopModule from "./TopModule";
import { loggedInTopModulesConfig, loggedOutTopModulesConfig, loggedOutTopModulesConfigProposalView } from "./topModulesConfig";
import { TopModulesProps } from "./types";

const TopModules = ({ tab, onTabChange, isProposalDetailView, isConnected }: TopModulesProps) => {

    const LoggedInModules = ({ tab, onTabChange }: Partial<TopModulesProps>) => {
        const bgColor = 'bg-transparent bg-[linear-gradient(180deg,rgba(0,59,147,0.30)_0%,rgba(0,97,255,0.70)_100%)]';
        const activeBgColor = 'bg-white bg-[linear-gradient(180deg,rgba(255,255,255,1)_64%,rgba(0,35,255,1)_64%)]';
        const isActive = (items: any[]) => items.some((i: any) => i.tab === tab)
        return (
            <>
                <div onClick={() => onTabChange && onTabChange(loggedInTopModulesConfig[0].tab)} className={`relative cursor-pointer flex w-[380px] h-[360px] flex-col shrink-0 p-6 rounded-[10px] ${isActive([loggedInTopModulesConfig[0]]) ? activeBgColor : bgColor}`}>
                    <TopModule

                        isActive={isActive([loggedInTopModulesConfig[0]])}
                        {...loggedInTopModulesConfig[0]}
                    />
                </div>
                <div onClick={() => onTabChange && onTabChange(loggedInTopModulesConfig[1].tab)} className={`gap-[155px] relative cursor-pointer flex w-[820px] h-[360px] flex-row shrink-0 p-6 rounded-[10px] ${isActive([loggedInTopModulesConfig[1], loggedInTopModulesConfig[2]]) ? activeBgColor : bgColor}`}>
                    <div className="flex flex-col">
                        <TopModule

                            isActive={isActive([loggedInTopModulesConfig[1], loggedInTopModulesConfig[2]])}
                            {...loggedInTopModulesConfig[1]}
                        />
                    </div>
                    <div className="flex flex-col">
                        <TopModule

                            isActive={isActive([loggedInTopModulesConfig[1], loggedInTopModulesConfig[2]])}
                            {...loggedInTopModulesConfig[2]}
                        />
                    </div>
                </div>
            </>
        )
    }

    type LoggedOutModulesProps = { items: { title: string, value: number | string, valueDescription?: string }[] }

    const LoggedOutModules: React.FC<LoggedOutModulesProps> = ({ items }) => {

        const bgColor = 'bg-transparent bg-[linear-gradient(180deg,rgba(0,59,147,0.30)_0%,rgba(0,97,255,0.70)_100%)]';
        return (
            <>
                <div className={`flex w-[380px] h-[206px] flex-col shrink-0 p-6 rounded-[10px] ${bgColor}`}>
                    <h3 className={`pb-4 text-white whitespace-pre-wrap`}>{items[0].title}</h3>
                    <p className={`text-[#E4B472] slashed-zero text-5xl not-italic font-bold leading-[124.7%] tracking-[-1.296px]`}>{items[0].value.toLocaleString('en-US', { maximumFractionDigits: 2, style: "currency", currency: "USD" })}</p>
                    {items[0].valueDescription && <p className={`text-[#FFE1B8] slashed-zero text-base not-italic font-medium leading-[130%] uppercase`}>{items[0].valueDescription}</p>}
                </div>
                <div className={`flex w-[380px] h-[206px] flex-col shrink-0 p-6 rounded-[10px] ${bgColor}`}>
                    <h3 className={`pb-4 text-white whitespace-pre-wrap`}>{items[1].title}</h3>
                    <p className={`text-[#E4B472] slashed-zero text-5xl not-italic font-bold leading-[124.7%] tracking-[-1.296px]`}>{items[1].value.toLocaleString('en-US', { maximumFractionDigits: 2 })}</p>
                    {items[1].valueDescription && <p className={`text-[#FFE1B8] slashed-zero text-base not-italic font-medium leading-[130%] uppercase`}>{items[1].valueDescription}</p>}
                </div>
                <div className={`flex w-[380px] h-[206px] flex-col shrink-0 p-6 rounded-[10px] ${bgColor}`}>
                    <h3 className={`pb-4 text-white whitespace-pre-wrap`}>{items[2].title}</h3>
                    <p className={`text-[#E4B472] slashed-zero text-5xl not-italic font-bold leading-[124.7%] tracking-[-1.296px]`}>{items[2].value.toLocaleString('en-US', { maximumFractionDigits: 2 })}</p>
                    {items[2].valueDescription && <p className={`text-[#FFE1B8] slashed-zero text-base not-italic font-medium leading-[130%] uppercase`}>{items[2].valueDescription}</p>}
                </div>
            </>
        )
    }

    return (
        <div className='flex flex-row gap-[60px]'>

            {isConnected ?
                <LoggedInModules onTabChange={onTabChange} tab={tab} /> :
                isProposalDetailView ?
                    <LoggedOutModules items={loggedOutTopModulesConfigProposalView} /> :
                    <LoggedOutModules items={loggedOutTopModulesConfig} />
            }
        </div>
    )
}

export default TopModules;