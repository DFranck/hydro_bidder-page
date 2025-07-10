import orderBy from 'lodash/orderBy'

export function sortBidsInTranche(bids: any[]) {
  return orderBy(bids, ['vote_perc'], ['desc'])
}
