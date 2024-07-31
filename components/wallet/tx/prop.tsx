import { MsgExecLegacyContent, MsgSubmitProposal } from "@/app/proto-types-gen/src/cosmos/gov/v1/tx";
import { Duration } from "@/app/proto-types-gen/src/google/protobuf/duration";
import { ConsumerAdditionProposal } from "@/app/proto-types-gen/src/interchain_security/ccv/provider/v1/provider";
import { MsgOptIn, MsgOptOut } from "@/app/proto-types-gen/src/interchain_security/ccv/provider/v1/tx";
import { ConsumerAdditionProposalJSON } from "@/app/types";



export function getAccountURL(address: string) {
  return `http://localhost:3000/rpc/cosmos/auth/v1beta1/accounts/${address}`;
}

export const DEFAULT_AUTHORITY =
  "cosmos10d07y265gmmuvt4z0w9aw880jnsr700j6zn9kn";

export const CONSUMER_PROP: ConsumerAdditionProposal = {
  title: "Add consumer chain",
  description:
    ".md description of your chain and all other relevant information",
  chainId: "newchain-1",
  unbondingPeriod: Duration.create({ seconds: "86400" }),
  ccvTimeoutPeriod: Duration.create({ seconds: "259200" }),
  transferTimeoutPeriod: Duration.create({ seconds: "1800" }),
  genesisHash: Uint8Array.from([]),
  binaryHash: Uint8Array.from([]),
  blocksPerDistributionTransmission: "1000",
  historicalEntries: "10000",
  distributionTransmissionChannel: "",
  consumerRedistributionFraction: "0.75",
  topN: 0,
  validatorsPowerCap: 0,
  validatorSetCap: 2,
  allowlist: [],
  denylist: [],
  initialHeight: {
    revisionNumber: "1",
    revisionHeight: "0",
  },
  spawnTime: new Date(),
};

export function prepareProposal(
  address: string,
  prop: ConsumerAdditionProposal
) {
  const consumerAddProp = ConsumerAdditionProposal.fromPartial(CONSUMER_PROP);
  // console.log("CONSUMER", consumerAddProp);
  const consumerAddMsg = MsgExecLegacyContent.fromPartial({
    content: {
      typeUrl: "/interchain_security.ccv.provider.v1.ConsumerAdditionProposal",
      value: ConsumerAdditionProposal.encode(prop).finish(),
    },
    authority: DEFAULT_AUTHORITY,
  });
  // console.log("CONSUMER ADD MSG", consumerAddMsg);

  const propMsg = {
    typeUrl: "/cosmos.gov.v1.MsgSubmitProposal",
    value: MsgSubmitProposal.fromPartial({
      proposer: address,
      initialDeposit: [
        {
          denom: "uatom",
          amount: "10000",
        },
      ],
      metadata: "metadata",
      title: "TITLE",
      summary: "SUMMARY",
      messages: [
        {
          typeUrl: "/cosmos.gov.v1.MsgExecLegacyContent",
          value: MsgExecLegacyContent.encode(consumerAddMsg).finish(),
        },
      ],
    }),
  };

  // console.log("PROP ADD MESSAGE STRING", JSON.stringify(propMsg, null, 2));
  return propMsg;
}

export function prepareProposalFromJSON(
  address: string,
  prop: ConsumerAdditionProposalJSON
) {
  const consumerAddProp = ConsumerAdditionProposal.fromJSON(prop);
  // console.log("CONSUMER", consumerAddProp);
  const consumerAddMsg = MsgExecLegacyContent.fromPartial({
    content: {
      typeUrl: "/interchain_security.ccv.provider.v1.ConsumerAdditionProposal",
      value: ConsumerAdditionProposal.encode(consumerAddProp).finish(),
    },
    authority: DEFAULT_AUTHORITY,
  });
  // console.log("CONSUMER ADD MSG", consumerAddMsg);

  const propMsg = {
    typeUrl: "/cosmos.gov.v1.MsgSubmitProposal",
    value: MsgSubmitProposal.fromPartial({
      proposer: address,
      initialDeposit: [
        {
          denom: "uatom",
          amount: "10000",
        },
      ],
      metadata: "metadata",
      title: "TITLE",
      summary: "SUMMARY",
      messages: [
        {
          typeUrl: "/cosmos.gov.v1.MsgExecLegacyContent",
          value: MsgExecLegacyContent.encode(consumerAddMsg).finish(),
        },
      ],
    }),
  };

  // console.log("PROP ADD MESSAGE STRING", JSON.stringify(propMsg, null, 2));
  return propMsg;
}

export function prepareOptIn(providerAddr: string, chainId: string) {
  const optInMsg = {
    typeUrl: "/interchain_security.ccv.provider.v1.MsgOptIn",
    value: MsgOptIn.fromPartial({
      chainId: chainId,
      providerAddr: providerAddr,
    }),
  };
  // console.log("OPT IN MESSAGE STRING", JSON.stringify(optInMsg, null, 2));
  return optInMsg;
}

export function prepareOptOut(providerAddr: string, chainId: string) {
  const optInMsg = {
    typeUrl: "/interchain_security.ccv.provider.v1.MsgOptOut",
    value: MsgOptOut.fromPartial({
      chainId: chainId,
      providerAddr: providerAddr,
    }),
  };
  // console.log("OPT OUT MESSAGE STRING", JSON.stringify(optInMsg, null, 2));
  return optInMsg;
}

export type SignResult = {
  signature: Buffer | null;
  return_code: string | number;
};

export type Account = {
  "@type": string;
  address: string;
  pub_key: { "@type": string; key: string };
  account_number: string;
  sequence: string;
};
