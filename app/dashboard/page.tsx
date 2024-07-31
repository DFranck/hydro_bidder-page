import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { HorizontalDivider } from "../ui/HorizontalDivider"
import { DataTable } from "./data-table"
import { activeProposalColumns, deployedProposalColumns } from "./proposals/columns"
import Image from "next/image"
import { activeProposals } from "./proposals/data"
import { myLockups } from "./lockups/data"
import { columns as lockupColumns } from "./lockups/columns"
import { totalEarnedTribute, tributeHistory } from "./tribute/data"
import { formatAmount, total } from "./tribute/utils"

export default function Dashboard() {
    const renderCard = (title: string) => (
        <div className={`flex w-[380px] h-[360px] flex-col items-center justify-center gap-4 shrink-0 bg-[linear-gradient(180deg,rgba(0,59,147,0.30)_0%,rgba(0,97,255,0.70)_100%)] p-6 rounded-[10px]`}>
            {title}
        </div>
    )

    const dashboardCards = () => (
        <div className='grid grid-cols-3 gap-[60px] px-[90px]'>
            {['Card 1', 'Card 2', 'Card 3'].map(renderCard)}
        </div>
    )

    const tabsBtnsClass = "inline-flex h-[30px] justify-center items-center gap-2.5 shrink-0 border text-[#FFE1B8] text-center text-base not-italic font-normal leading-[21px] px-5 py-0 rounded-[6px_6px_0px_0px] border-solid border-[#FFE1B8] data-[state=active]:bg-[#FFE1B8] data-[state=active]:text-foreground data-[state=active]:shadow-sm inline-flex h-[30px] justify-center items-center gap-2.5 shrink-0 border text-center text-base not-italic data-[state=active]:font-bold leading-[21px] px-5 py-0 rounded-[6px_6px_0px_0px] border-solid border-[#FFE1B8]"
    return (
        <div className='text-3xl bg-[linear-gradient(180deg,#010006_49.9%,#001C47_100%)]'>
            {dashboardCards()}
            <div className="px-[90px] pt-[70px] pb-[90px]">
                <Tabs defaultValue="voting">
                    <TabsList className="p-[unset] h-[unset] rounded-[unset] bg-transparent flex flex-row justify-start gap-[10px]">
                        <TabsTrigger className={tabsBtnsClass} value="voting">Voting</TabsTrigger>
                        <TabsTrigger className={tabsBtnsClass} value="tribute">Earned Tribute</TabsTrigger>
                        <TabsTrigger className={tabsBtnsClass} value="lockups">Lockups</TabsTrigger>
                    </TabsList>
                    <HorizontalDivider style="mt-[-21px]" />
                    <TabsContent value="voting">
                        <div className="flex flex-col items-start gap-[44px]">
                            <div>
                                <h3>Vote Now to Earn Rewards</h3>
                                <p className="text-xl not-italic font-normal leading-[150%]">View and vote on active proposals</p>
                                <DataTable columns={activeProposalColumns} data={activeProposals} height=" h-[200px]" />
                                <div className="flex justify-center mt-[27px]">
                                    <Image src={'/images/Progress.svg'} alt='twitter' width={577} height={69} />
                                </div>
                            </div>
                            <div>
                                <h3>Actively Deployed Proposals</h3>
                                <p className="text-xl not-italic font-normal leading-[150%]">Winning proposals from previous rounds that are currently deployed</p>
                                <DataTable columns={deployedProposalColumns} data={activeProposals} height=" h-[200px]" />
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
                            <DataTable columns={lockupColumns} data={myLockups} height=" h-[470px]" />
                        </div>
                    </TabsContent>
                </Tabs>
            </div>

        </div>
    )
}