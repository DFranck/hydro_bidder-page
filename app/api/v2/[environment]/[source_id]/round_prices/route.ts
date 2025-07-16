import { fetchRoundPrices } from '@/app/api/v2/[environment]/[source_id]/build_round_data/_helpers/fetchRoundPrices';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ environment: string; source_id: string }> }
) {
  try {
    const { environment, source_id } = await params
    const { searchParams } = new URL(request.url)
    const chainId = searchParams.get('chainId')
    const roundId = searchParams.get('roundId')
    const cacheDuration = searchParams.get('cacheDuration')

    if (!chainId || !roundId) {
      return NextResponse.json(
        { error: 'chainId and roundId are required' },
        { status: 400 }
      )
    }

    const roundPrices = await fetchRoundPrices({
      chainId,
      roundId: parseInt(roundId),
      cacheDuration: cacheDuration ? parseInt(cacheDuration) : undefined,
    })

    return NextResponse.json(roundPrices)
  } catch (error) {
    console.error('Error fetching round prices:', error)
    return NextResponse.json(
      { error: 'Failed to fetch round prices' },
      { status: 500 }
    )
  }
}
