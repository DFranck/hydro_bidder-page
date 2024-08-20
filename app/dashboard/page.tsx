'use client'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { HorizontalDivider } from "../ui/HorizontalDivider"
import { DataTable } from "./data-table"
import { activeProposalColumns, deployedProposalColumns } from "./proposals/columns"
import Image from "next/image"
import { activeProposals } from "./proposals/data"
import { myLockups } from "./lockups/data"
import { Lockup, LockupColumnProps, columns as lockupColumns } from "./lockups/columns"
import { totalEarnedTribute, tributeHistory } from "./tribute/data"
import { formatAmount, total } from "./tribute/utils"
import { HydroBaseQueryClient } from '../ts_types/HydroBase.client';
import { CosmWasmClient } from "@cosmjs/cosmwasm-stargate"
import { useCallback, useEffect, useMemo, useState } from "react"
import { TributeBaseQueryClient } from "../ts_types/TributeBase.client"
import { Button } from "@/components/ui/button"
// import { Proposal } from "../proto-types-gen/src/tendermint/types/types"
import { Proposal } from '../ts_types/HydroBase.types';
import { useChain } from "@cosmos-kit/react"


type Tab = {
    tab: 'voting' | 'lockups' | 'tribute',
    title: string
}

export default function Dashboard() {
    const [tab, setTab] = useState<Tab['tab']>('voting');
    const [roundProposals, setRoundProposals] = useState<Proposal[]>([]);
    const [currentTranche, setCurrentTranche] = useState(1);
    const [totalTranches, setTotalTranches] = useState(0);

    const { isWalletConnected } = useChain("cosmoshubtestnet")
    const renderCard = ({ tab, title }: Tab) => (
        <div key={title} onClick={() => onTabChange(tab)} className={`flex w-[380px] h-[360px] flex-col items-center justify-center gap-4 shrink-0 bg-[linear-gradient(180deg,rgba(0,59,147,0.30)_0%,rgba(0,97,255,0.70)_100%)] p-6 rounded-[10px]`}>
            {title}
        </div>
    )

    const onTabChange = (value: 'voting' | 'lockups' | 'tribute') => {
        setTab(value);
    }

    const dashboardCards = () => (
        <div className='grid grid-cols-3 gap-[60px] px-[90px]'>
            {
                ([{ tab: 'voting', title: 'Voting' }, { tab: 'lockups', title: 'Lockups' }, { tab: 'tribute', title: 'Tribute' }] as Tab[]).map(
                    (item: Tab) => renderCard(item)
                )
            }
        </div>
    )

    useEffect(() => {
        async function initiateClient() {
            const hydroContractAdress = 'neutron170q77yl3qfxyu43edpgc4u546mtp3jwwhxal3ujy79qw7qp6kgmszyuarv';
            const tributeContractAdress = 'neutron1qydlxxz4ze6m5k6v7xqg0wnuzuuxaxhghvhtwvs34qaku24nhltse3hm7p';
            const rpcEndpoint = "https://rpc-palvus.pion-1.ntrn.tech:443";
            const myAddress = 'neutron1cfznm042ncguprsfxzmze6xfkjft33eqw2djna';
            const client = await CosmWasmClient.connect(rpcEndpoint);
            const hydroQueryClient = new HydroBaseQueryClient(client, hydroContractAdress);
            const tranches = await hydroQueryClient.tranches();
            setTotalTranches(tranches.tranches.length);
            // const currentRound = await hydroQueryClient.currentRound();
            // const roundEnd = await hydroQueryClient.roundEnd({ roundId: 0 });
            // const totalLockedTokens = await hydroQueryClient.totalLockedTokens() // breaks
            // const constants = await hydroQueryClient.constants();
            // const contractAddressFromHQC = hydroQueryClient.contractAddress;
            // const expiredUserLockups = await hydroQueryClient.expiredUserLockups({ address: contractAddressFromHQC, limit: 10, startFrom: 0 }); // need correct startFrom
            // const proposal = await hydroQueryClient.proposal({ proposalId: 1, roundId: 0, trancheId: 1 }); // breaks
            const roundProposals = await hydroQueryClient.roundProposals({ roundId: 0, trancheId: 1, limit: 10, startFrom: 0 });
            // setRoundProposals(roundProposals.proposals);
            // const topNProposals = await hydroQueryClient.topNProposals({ numberOfProposals: 10, roundId: 0, trancheId: 1 }); // breaks
            // const userVotingPower = await hydroQueryClient.userVotingPower({ address: contractAddressFromHQC });
            // const whitelist = await hydroQueryClient.whitelist();
            // const whitelistAdmins = await hydroQueryClient.whitelistAdmins();
            // const roundTotalVotingPower = await hydroQueryClient.roundTotalVotingPower({ roundId: 0 }); // breaks
            const allUserLockups = await hydroQueryClient.allUserLockups({ address: myAddress, limit: 10, startFrom: 0 }); // need correct startFrom
            // const userVote = await hydroQueryClient.userVote({ address: myAddress, roundId: 0, trancheId: 1 }); // breaks
            console.log({
                tranches,
                // currentRound,
                // roundEnd,
                // totalLockedTokens,
                // constants,
                // contractAddressFromHQC,
                // expiredUserLockups,
                // proposal,
                // roundProposals,
                // topNProposals,
                // userVotingPower,
                // whitelist,
                // whitelistAdmins,
                // roundTotalVotingPower,
                allUserLockups,
                // userVote
            });

            const tributeQueryClient = new TributeBaseQueryClient(client, tributeContractAdress);
            const config = await tributeQueryClient.config(); // breaks
            const contractAddressFromTQC = tributeQueryClient.contractAddress;
            const proposalTributes = await tributeQueryClient.proposalTributes({ limit: 10, proposalId: 1, roundId: 0, startFrom: 0, trancheId: 1 }) // breaks
            console.log({ config, contractAddressFromTQC, proposalTributes });


        }
        initiateClient();

    }, [])

    const tabsBtnsClass = "inline-flex h-[30px] justify-center items-center gap-2.5 shrink-0 border text-[#FFE1B8] text-center text-base not-italic font-normal leading-[21px] px-5 py-0 rounded-[6px_6px_0px_0px] border-solid border-[#FFE1B8] data-[state=active]:bg-[#FFE1B8] data-[state=active]:text-foreground data-[state=active]:shadow-sm inline-flex h-[30px] justify-center items-center gap-2.5 shrink-0 border text-center text-base not-italic data-[state=active]:font-bold leading-[21px] px-5 py-0 rounded-[6px_6px_0px_0px] border-solid border-[#FFE1B8]"

    const onVoteProposal = useCallback((proposal: Proposal) => {
        alert(`clicked VOTE on row ${proposal.proposal_id}`);
    }, []);

    const onEditLockup = useCallback((lockup: Lockup) => {
        alert(`clicked EDIT on row ${lockup.id}`);
    }, []);

    const activeProposalsColumnsMemoized = useMemo(() => activeProposalColumns({ onVoteProposal }), [onVoteProposal]);

    const locukpColumnsMemoized = useMemo(() => lockupColumns({ onEditLockup }), [onEditLockup]);
    return (
        <div className='text-3xl bg-[linear-gradient(180deg,#010006_49.9%,#001C47_100%)]'>
            {isWalletConnected ?
                <>
                    {dashboardCards()}
                    <div className="px-[90px] pt-[70px] pb-[90px]">
                        <Tabs value={tab}>
                            <TabsList className="p-[unset] h-[unset] rounded-[unset] bg-transparent flex flex-row justify-start gap-[10px]">
                                <TabsTrigger className={tabsBtnsClass} value="voting" onClick={() => onTabChange('voting')}>Voting</TabsTrigger>
                                <TabsTrigger className={tabsBtnsClass} value="tribute" onClick={() => onTabChange('tribute')}>Earned Tribute</TabsTrigger>
                                <TabsTrigger className={tabsBtnsClass} value="lockups" onClick={() => onTabChange('lockups')}>Lockups</TabsTrigger>
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
                                                <Button variant="ghost" size="icon">
                                                    <Image src={'/images/Vector3.svg'} alt='tranches-left' width={14} height={24} />
                                                </Button>
                                                <p className="text-[32px] not-italic font-normal leading-[120%] tracking-[-0.4px]">{`TRANCH ${currentTranche}/${totalTranches}`}</p>
                                                <Button variant="ghost" size="icon">
                                                    <Image src={'/images/Vector4.svg'} alt='tranches-left' width={14} height={24} />
                                                </Button>
                                            </div>
                                        </div>
                                        <DataTable columns={activeProposalsColumnsMemoized} data={activeProposals} height=" h-[330px]" theme="light" />
                                        <div className="flex justify-center mt-[27px]">
                                            <Image src={'/images/Progress.svg'} alt='progress' width={577} height={69} />
                                        </div>
                                    </div>
                                    <div>
                                        <h3>Actively Deployed Proposals</h3>
                                        <p className="text-xl not-italic font-normal leading-[150%]">Winning proposals from previous rounds that are currently deployed</p>
                                        <DataTable columns={deployedProposalColumns} data={activeProposals} height=" h-[330px]" />
                                    </div>
                                </div>

                            </TabsContent>
                            {/*---------------------------------------------------------------- */}
                            <TabsContent value="tribute">
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
                            </TabsContent>
                            {/*---------------------------------------------------------------- */}

                            <TabsContent value="lockups">

                                <div>
                                    <h3>My Lockups</h3>
                                    <DataTable columns={locukpColumnsMemoized} data={myLockups} height=" h-[720px]" />
                                </div>
                            </TabsContent>
                        </Tabs>
                    </div>
                </> :

                <div className="flex justify-center min-h-screen">
                    <p className="text-xl not-italic font-bold leading-[150%]">Please connect your wallet to view your dashboard</p>
                </div>
            }
        </div>
    )
}