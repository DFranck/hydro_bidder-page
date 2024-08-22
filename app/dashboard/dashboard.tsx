'use client'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { HorizontalDivider } from "../ui/HorizontalDivider"
import { DataTable } from "./data-table"
import { proposalColumns, deployedProposalColumns, makeProposalColumnDef } from "./proposals/columns"
import Image from "next/image"
import { mockMyLockups } from "./lockups/data"
import { Lockup, columns as lockupColumns } from "./lockups/columns"
import { totalEarnedTribute, tributeHistory } from "./tribute/data"
import { formatAmount, total } from "./tribute/utils"
import { useCallback, useState } from "react"
import { Button } from "@/components/ui/button"
import { LockEntry, Proposal } from '../ts_types/HydroBase.types';
import { GlobalState } from '../types';
import { useChain } from "@cosmos-kit/react"
import { Tribute } from "../ts_types/TributeBase.types"
import TopModule, { TabLabel } from "./TopModule"
import { topModulesConfig } from "./topModulesConfig"

type Tab = {
    tab: TabLabel,
    title: string
}

export default function Dashboard({
    lastProposalTranches,
    currentProposalTranches,
    lastVotingPower,
    currentVotingPower,
    globalState,
    currentProposalTributes,
    lastProposalTributes,
    userLockups
}: {
    currentProposalTranches: Map<number, Proposal[]>,
    currentVotingPower: number,
    currentProposalTributes: Map<number, Tribute[]>,
    lastProposalTranches?: Map<number, Proposal[]>,
    lastVotingPower?: number,
    lastProposalTributes?: Map<number, Tribute[]>
    globalState: GlobalState,
    userLockups: LockEntry[] // lockup we get from the response doesn't have id and voting power required by the UI
}) {
    const [tab, setTab] = useState<TabLabel>(TabLabel.VOTING);
    const [currentTranche, setCurrentTranche] = useState(0);

    const { isWalletConnected } = useChain("cosmoshubtestnet")

    const onTabChange = (value: TabLabel) => {
        setTab(value);
    }

    const TopModules = () => (
        <div className='grid grid-cols-3 gap-[60px] px-[90px]'>
            {
                topModulesConfig.map(
                    (item) => <TopModule
                        key={item.title}
                        isActive={tab === item.tab}
                        onTabChange={onTabChange}
                        {...item}
                    />
                )
            }
        </div>
    )

    const tabsBtnsClass = "inline-flex h-[30px] justify-center items-center gap-2.5 shrink-0 border text-[#FFE1B8] text-center text-base not-italic font-normal leading-[21px] px-5 py-0 rounded-[6px_6px_0px_0px] border-solid border-[#FFE1B8] data-[state=active]:bg-[#FFE1B8] data-[state=active]:text-foreground data-[state=active]:shadow-sm inline-flex h-[30px] justify-center items-center gap-2.5 shrink-0 border text-center text-base not-italic data-[state=active]:font-bold leading-[21px] px-5 py-0 rounded-[6px_6px_0px_0px] border-solid border-[#FFE1B8]"

    const onVoteProposal = useCallback((proposal: Proposal) => {
        alert(`clicked VOTE on row ${proposal.proposal_id}`);
    }, []);

    const onEditLockup = useCallback((lockup: LockEntry) => {
        // alert(`clicked EDIT on row ${lockup.id}`);
    }, []);

    // const sumLockupAmounts = () => {
    //     return Array.from(userLockups).reduce((sum, lockup) => {
    //         return sum + parseInt(lockup.funds.amount);
    //     }, 0);
    // }

    return (
        <div className='text-3xl bg-[linear-gradient(180deg,#010006_49.9%,#001C47_100%)]'>
            {isWalletConnected && <TopModules />}
            <div className="px-[90px] pt-[70px] pb-[90px]">
                <Tabs value={tab}>
                    <TabsList className="p-[unset] h-[unset] rounded-[unset] bg-transparent flex flex-row justify-start gap-[10px]">
                        <TabsTrigger className={tabsBtnsClass} value="voting" onClick={() => onTabChange(TabLabel.VOTING)}>Voting</TabsTrigger>
                        <TabsTrigger className={tabsBtnsClass} value="tribute" onClick={() => onTabChange(TabLabel.TRIBUTE)}>Earned Tribute</TabsTrigger>
                        <TabsTrigger className={tabsBtnsClass} value="lockups" onClick={() => onTabChange(TabLabel.LOCKUPS)}>Lockups</TabsTrigger>
                    </TabsList>
                    <HorizontalDivider style="mt-[-21px]" />
                    <TabsContent value="voting">
                        <div className="flex flex-col items-start gap-[44px]">
                            <div>
                                <div className="flex flex-row justify-between">
                                    <div>
                                        <h3>Vote Now to Earn Rewards</h3>
                                        <p className="text-xl not-italic font-normal leading-[150%]">View and vote on active proposals</p>
                                    </div>
                                    <div className="flex flex-row gap-[18px] justify-end items-center">
                                        <Button variant="ghost" size="icon" onClick={() => setCurrentTranche((currentTranche - 1 + globalState.tranches.length) % globalState.tranches.length)}>
                                            <Image src={'/images/Vector3.svg'} alt='tranches-left' width={14} height={24} />
                                        </Button>
                                        <p className="text-[32px] not-italic font-normal leading-[120%] tracking-[-0.4px]">{`TRANCH ${currentTranche + 1}/${globalState.tranches.length}`}</p>
                                        <Button variant="ghost" size="icon" onClick={() => setCurrentTranche((currentTranche + 1) % globalState.tranches.length)}>
                                            <Image src={'/images/Vector4.svg'} alt='tranches-right' width={14} height={24} />
                                        </Button>
                                    </div>
                                </div>
                                {currentProposalTranches.get(currentTranche) && (
                                    <div className="mb-8">
                                        <h4 className="text-xl font-bold mb-4">{globalState.tranches.find(tranche => tranche.id === currentTranche)?.name || `Tranche ${currentTranche}`}</h4>
                                        <DataTable
                                            columns={proposalColumns(() => { })}
                                            data={(currentProposalTranches.get(currentTranche) || []).map((proposal) => makeProposalColumnDef(proposal, currentProposalTributes.get(proposal.proposal_id)!))}
                                            height="h-[330px]"
                                            theme="light"
                                        />
                                    </div>
                                )}
                                <div className="flex justify-center mt-[27px]">
                                    <Image src={'/images/Progress.svg'} alt='progress' width={577} height={69} />
                                </div>
                            </div>
                            {lastProposalTranches && lastProposalTributes && lastProposalTranches.get(currentTranche) && (
                                <div>
                                    <h3>Actively Deployed Proposals</h3>
                                    <p className="text-xl not-italic font-normal leading-[150%]">Winning proposals from previous rounds that are currently deployed</p>
                                    <DataTable
                                        columns={proposalColumns(() => { })}
                                        data={
                                            (lastProposalTranches.get(currentTranche) || [])
                                                .map((proposal) => makeProposalColumnDef(proposal, lastProposalTributes.get(proposal.proposal_id)!))
                                        }
                                        height=" h-[330px]"
                                    />
                                </div>
                            )}
                        </div>

                    </TabsContent>
                    {/*---------------------------------------------------------------- */}
                    {isWalletConnected && <TabsContent value="tribute">
                        <div className="flex flex-row gap-[60px]">
                            <div className="w-[550px] h-[356px] shrink-0 bg-[linear-gradient(180deg,rgba(0,21,45,0.40)_0%,rgba(0,59,147,0.60)_100%)] rounded-[10px] p-6">
                                <h3 className="font-bold mb-[18px]">Total Earned Tribute</h3>
                                <table style={{ width: '100%', color: 'white', fontSize: '20px' }}>
                                    <tbody>
                                        {totalEarnedTribute.map((item, index) => (
                                            <tr key={index} style={{ borderBottom: '1px solid white' }}>
                                                <td style={{ paddingTop: '8px', paddingBottom: '8px', paddingRight: '10px', display: 'flex', alignItems: 'start', flexDirection: 'row', WebkitAlignItems: 'center', gap: '5px' }}>{<Image src={'/images/Ellipse.svg'} alt='twitter' width={12} height={12} />}{item.tributeToken}</td>
                                                <td style={{ paddingTop: '8px', paddingBottom: '8px', textAlign: 'right', fontWeight: 'bold' }}>{formatAmount(item.tributeAmount)}</td>
                                            </tr>
                                        ))}
                                        <tr style={{ color: '#E4B472' }}>
                                            <td style={{ paddingTop: '10px', fontWeight: 'bold' }}>TOTAL</td>
                                            <td style={{ paddingTop: '10px', textAlign: 'right', fontWeight: 'bold' }}>{total.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div className="w-[-webkit-fill-available] mt-6">
                                <h3 className="font-bold mb-[18px]">Tribute History</h3>
                                <div className="flex flex-col gap-[16px] h-[278px] overflow-y-auto">
                                    {tributeHistory.map((item, index) => {
                                        return (
                                            <div key={index} className="flex flex-row bg-[#303132] rounded-[10px] p-6 justify-between px-6 py-[14px]">
                                                <div className="flex flex-col">
                                                    <p className="text-base not-italic font-normal leading-[150%]">{item.title}</p>
                                                    <p className="text-xl not-italic font-bold leading-[150%]">{item.amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</p>
                                                </div>
                                                <p className="text-base not-italic font-normal leading-[150%]">{item.period}</p>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>
                    </TabsContent>}
                    {/*---------------------------------------------------------------- */}

                    <TabsContent value="lockups">
                        <div>
                            <h3>My Lockups</h3>
                            <DataTable columns={lockupColumns({ onEditLockup })} data={userLockups} height=" max-h-[720px]" />
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}

function RewardsSnapshot({ amount }: { amount: number }) {
    return (
        <div className="bg-[#1a1b23] rounded-lg p-4 max-w-sm">
            <div className="flex justify-between items-center mb-2">
                <div className="flex items-center">
                    <div className="bg-blue-600 rounded-full p-2 mr-2">
                        <span className="text-white text-xl">$</span>
                    </div>
                    <h2 className="text-white text-lg font-semibold">Rewards<br />Snapshot</h2>
                </div>
                <button className="bg-[#4ade80] text-black px-4 py-2 rounded-md text-sm font-medium">
                    Claim Rewards
                </button>
            </div>
            <p className="text-gray-400 text-sm mb-2">Your ROI on your staked stATOM</p>
            <p className="text-[#4ade80] text-3xl font-bold">
                ${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <p className="text-gray-400 text-xs">USDC EQUIVALENT</p>
        </div>
    );
}
