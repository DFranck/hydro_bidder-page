import { Duration } from "./proto-types-gen/src/google/protobuf/duration";
import { ConsumerAdditionProposal } from "./proto-types-gen/src/interchain_security/ccv/provider/v1/provider";

export type ConsumerAdditionProposalJSON = {
    spawn_time: string;
    title: string;
    summary: string;
    chain_id: string;
    initial_height: {
      revision_number: number;
      revision_height: number;
    };
    unbonding_period: number;
    ccv_timeout_period: number;
    transfer_timeout_period: number;
    consumer_redistribution_fraction: string;
    blocks_per_distribution_transmission: number;
    historical_entries: number;
    genesis_hash: string;
    binary_hash: string;
    distribution_transmission_channel: string;
    top_N: number;
    validators_power_cap: number;
    validator_set_cap: number;
    allowlist: string[];
    denylist: string[];
  };

export function toConsumerPropProto(
    prop: ConsumerAdditionProposalJSON
  ): ConsumerAdditionProposal {
    return {
      title: prop.title,
      description: prop.summary,
      chainId: prop.chain_id,
      unbondingPeriod: Duration.create({
        nanos: prop.unbonding_period,
      }),
      ccvTimeoutPeriod: Duration.create({
        nanos: prop.ccv_timeout_period,
      }),
      transferTimeoutPeriod: Duration.create({
        nanos: prop.transfer_timeout_period,
      }),
      genesisHash: Uint8Array.from([]),
      binaryHash: Uint8Array.from([]),
      blocksPerDistributionTransmission:
        prop.blocks_per_distribution_transmission.toString(),
      historicalEntries: prop.historical_entries.toString(),
      distributionTransmissionChannel: "",
      consumerRedistributionFraction: prop.consumer_redistribution_fraction,
      topN: prop.top_N,
      validatorsPowerCap: prop.validators_power_cap,
      validatorSetCap: prop.validator_set_cap,
      allowlist: [],
      denylist: [],
      initialHeight: {
        revisionNumber: prop.initial_height?.revision_number.toString() || "0",
        revisionHeight: prop.initial_height?.revision_number.toString() || "0",
      },
      spawnTime: new Date(prop.spawn_time),
    };
  }