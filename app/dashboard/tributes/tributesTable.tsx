"use client"

import { Proposal } from "../../ts_types/HydroBase.types"
import { GlobalState } from "../../types"
import { useChain } from "@cosmos-kit/react"

export default function TributesTable({
    currentProposalTranches,
    globalState,
}: {
    currentProposalTranches: Map<number, Proposal[]>
    globalState: GlobalState
}) {
    const { isWalletConnected, address: walletAddress } =
        useChain("neutrontestnet")

    return (
        <>
            {isWalletConnected && walletAddress && (
                <div className="mt-10">
                    <Tributes walletAddress={walletAddress} />
                </div>
            )}
        </>
    )
}

function Tributes({ walletAddress }: { walletAddress: string }) {
    return (
        <div className="flex flex-row gap-[60px]">
            <div className="w-[550px] h-[356px] shrink-0 bg-[linear-gradient(180deg,rgba(0,21,45,0.40)_0%,rgba(0,59,147,0.60)_100%)] rounded-[10px] p-6">
                <h3 className="font-bold mb-[18px]">Total Earned Tribute</h3>
                <table
                    style={{
                        width: "100%",
                        color: "white",
                        fontSize: "20px",
                    }}
                >
                    <tbody>
                        {/* {totalEarnedTribute.map((item, index) => (
                                <tr key={index} style={{ borderBottom: '1px solid white' }}>
                                    <td style={{ paddingTop: '8px', paddingBottom: '8px', paddingRight: '10px', display: 'flex', alignItems: 'start', flexDirection: 'row', WebkitAlignItems: 'center', gap: '5px' }}>{<Image src={'/images/Ellipse.svg'} alt='twitter' width={12} height={12} />}{item.tributeToken}</td>
                                    <td style={{ paddingTop: '8px', paddingBottom: '8px', textAlign: 'right', fontWeight: 'bold' }}>{formatAmount(item.tributeAmount)}</td>
                                </tr>
                            ))} */}
                        <tr style={{ color: "#E4B472" }}>
                            <td
                                style={{
                                    paddingTop: "10px",
                                    fontWeight: "bold",
                                }}
                            >
                                TOTAL
                            </td>
                            {/* <td style={{ paddingTop: '10px', textAlign: 'right', fontWeight: 'bold' }}>{total.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</td> */}
                        </tr>
                    </tbody>
                </table>
            </div>
            <div className="w-[-webkit-fill-available] mt-6">
                <h3 className="font-bold mb-[18px]">Tribute History</h3>
                <div className="flex flex-col gap-[16px] h-[278px] overflow-y-auto">
                    {/* {tributeHistory.map((item, index) => {
                            return (
                                <div key={index} className="flex flex-row bg-[#303132] rounded-[10px] p-6 justify-between px-6 py-[14px]">
                                    <div className="flex flex-col">
                                        <p className="text-base not-italic font-normal leading-[150%]">{item.title}</p>
                                        <p className="text-xl not-italic font-bold leading-[150%]">{item.amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</p>
                                    </div>
                                    <p className="text-base not-italic font-normal leading-[150%]">{item.period}</p>
                                </div>
                            )
                        })} */}
                </div>
            </div>
        </div>
    )
}
