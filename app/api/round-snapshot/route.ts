import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    // Get round_id from the URL query parameters
    const url = new URL(request.url)
    const roundId = url.searchParams.get("round_id")

    if (!roundId) {
      return NextResponse.json(
        { error: "Missing round_id parameter" },
        { status: 400 }
      )
    }

    // Get Numia API key from environment variable
    const apiKey = process.env.NUMIA_COSMOS_HYDRO_APP_API_KEY

    if (!apiKey) {
      return NextResponse.json(
        { error: "API key not configured" },
        { status: 500 }
      )
    }

    const roundIdNumber = parseInt(roundId)

    // Fetch data from Numia API
    const response = await fetch(
      `https://cosmos.numia.xyz/hydro/round_snapshot?round_id=${roundIdNumber - 1}`,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      }
    )

    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch data: ${response.statusText}` },
        { status: response.status }
      )
    }

    const data = await response.json()

    // Process the data into CSV format
    let csvContent = "user_address;tranche_id;voted_on_bid;voting_power\n"
    
    for (const item of data) {
      const address = item.address
      
      try {
        // Parse the response string to JSON
        const responseObj = JSON.parse(item.response)
        const lockups = responseObj.data?.lockups_with_per_tranche_infos || []
        
        // Process each lockup
        for (const lockup of lockups) {
          const votingPower = lockup.lock_with_power?.current_voting_power || "0"
          
          // Process each tranche info
          for (const trancheInfo of lockup.per_tranche_info || []) {
            const trancheId = trancheInfo.tranche_id
            const votedOnBid = trancheInfo.current_voted_on_proposal || "0"
            
            // Add row to CSV
            csvContent += `${address};${trancheId};${votedOnBid};${votingPower}\n`
          }
        }
      } catch (e) {
        console.error(`Failed to parse response for address ${address}:`, e)
        // Skip this item if parsing fails
      }
    }

    // Return CSV content with appropriate headers
    return new NextResponse(csvContent, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="hydro-round-${roundId}-snapshot.csv"`,
      },
    })
  } catch (error) {
    console.error("Error processing snapshot data:", error)
    return NextResponse.json(
      { error: "Failed to process snapshot data" },
      { status: 500 }
    )
  }
}