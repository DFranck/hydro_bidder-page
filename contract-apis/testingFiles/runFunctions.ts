
import { fetchRoundTributes } from "./../mergedFetchers/fetchRoundTributes";
import * as fs from 'fs';
import { fetchRoundLockups  } from "./../mergedFetchers/fetchRoundLockups";
import { fetchRoundBids     } from "./../mergedFetchers/fetchRoundBids";
import { calculateRoundDeploymentMetrics } from "./../testingFiles/calculateRoundDeploymentMetrics";
import { hydroPrices        } from "./../auxFiles/hydro_prices";
import { fetchBidDescriptionsById } from "../mergedFetchers/fetchBidDescriptions";
import { fetchCurrentRoundId } from "./../fetchCurrentRoundId";
import { Proposal } from "../../app/ts_types/HydroBase.types"
import { fetchHydroData } from "./../fetchHydroData";
import { fetchBidsData } from "./fetchBidsData";
import { fetchHydroData2 } from "./fetchHydroData2";


async function run() {

  /*const tranches = [1]

  console.log('Fetching proposal descriptions...');
  const bidDescriptions = await fetchBidDescriptionsById();
  //console.log('Bid Descriptions:', bidDescriptions);

  console.log('Fetching current round...');
  const current_round_id = await fetchCurrentRoundId();
  //console.log('Round ID:', current_round_id);

  const all_bids = []
  try {

    for (let evaluated_round_id=0; evaluated_round_id < current_round_id + 1; evaluated_round_id++) {

      console.log('Fetching proposal tributes...');
      const roundTributes = await fetchRoundTributes(evaluated_round_id, current_round_id);
      //console.log('Round Tributes:', roundTributes);

      console.log("Fetching proposal lockups...")
      const roundLockups = await fetchRoundLockups(evaluated_round_id, current_round_id)
      //console.log("Round lockups:", roundLockups)

      console.log("Fetching proposal bids...")
      let roundBids:Proposal[] = [];
      for (const tranche of tranches) {
        const bids = await fetchRoundBids(evaluated_round_id, tranche, current_round_id);
        roundBids = roundBids.concat(bids);
      }
      //console.log("Round bids:", roundBids)

      const roundParsedBids = calculateRoundDeploymentMetrics(evaluated_round_id, roundBids, roundLockups, roundTributes, hydroPrices, bidDescriptions, current_round_id)
      all_bids.push(roundParsedBids)
    }
  } catch (error) {
    console.error("Error:", error)
  }

  console.log('All Bids:', all_bids);*/
  console.log('Fetching Hydro Data...')
  fs.writeFileSync('bids.txt', JSON.stringify(await fetchHydroData(), null, 2))

  console.log('Fetching Hydro Data...')
  // Save the output to a file
  fs.writeFileSync('bids2.txt', JSON.stringify(await fetchHydroData2(), null, 2))

  console.log('Fetching Hydro Data...')
  // Save the output to a file
  fs.writeFileSync('bids3.txt', JSON.stringify(await fetchBidsData(), null, 2))
}

run()
