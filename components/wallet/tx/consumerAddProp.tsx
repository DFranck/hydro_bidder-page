"use client";
import { Button } from "@/components/ui/button";
import { useChain } from "@cosmos-kit/react";

import { StdFee } from "@cosmjs/amino";

import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { FileInput, LoaderCircleIcon } from "lucide-react";
import { prepareProposal } from "./prop";
import { PB } from "../../../lib/pocketbase";
import { useRouter } from "next/navigation";
import { ConsumerAdditionProposalJSON, toConsumerPropProto } from "../../../app/types";
import { DEFAULT_CHAIN } from "@/config";

export function getAccountURL(address: string) {
  return `http://localhost:3000/rpc/cosmos/auth/v1beta1/accounts/${address}`;
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

export function SubmitChainAdditionProp({
  recordId,
  reload,
  ics_prop,
}: {
  recordId?: string;
  ics_prop: ConsumerAdditionProposalJSON;
  reload?: boolean;
}) {
  const { getSigningStargateClient, address } = useChain(DEFAULT_CHAIN);
  const router = useRouter();

  const { toast } = useToast();

  const [isReviewing, setIsReviewing] = useState(false);

  const fee: StdFee = {
    amount: [
      {
        denom: "uatom",
        amount: "100000",
      },
    ],
    gas: "1000000",
  };

  const submitProposalMessage = async () => {
    let response: any;
    try {
      setIsReviewing(true);
      const stargateClient = await getSigningStargateClient();
      if (!stargateClient || !address) {
        console.error("stargateClient undefined or address undefined.");
        return;
      }

      if (!address) {
        console.error("Account address not found.");
        return;
      }

      const propMsg = prepareProposal(address, toConsumerPropProto(ics_prop));
      // console.log("Submitting proposal message.", propMsg);
      response = await stargateClient.signAndBroadcast(
        "cosmos1uu2v5wa80vn3rku6l2fd686p4vr6662sz6y8k4",
        [propMsg],
        fee,
        ""
      );
      // console.log("HAVE RES", response, recordId);
      if (response.code === 0 && recordId) {
        // console.log("Updating record stage to voting.", recordId);
        try {
          await PB.collection("chains").update(recordId, {
            stage: "voting",
          });
        } catch (error) {
          console.error("Error submitting txs.", error);
        }
        // console.log(response);
      }
      toast({
        title: response.code === 0 ? "Success" : "Error",
        description:
          response.code === 0
            ? "Your Tx has been submitted successfully."
            : `Error submitting Tx - Code: ${response.code}\nLog: ${response.rawLog}`,
        variant: response.code === 0 ? "default" : "destructive",
      });
      if (response?.code === 0 && reload) {
        router.refresh();
      }
    } catch (error) {
      const anyErr = error as any;
      // console.log("HAVE ERROR", error);
      if (
        (typeof error === "string" && error.includes("Request rejected")) ||
        anyErr?.message.includes("Request rejected")
      ) {
        toast({
          title: "Transaction aborted",
          description: "You rejected the transaction.",
        });
      } else {
        toast({
          title: "Error",
          description: "Error submitting txs. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setIsReviewing(false);
    }
  };

  return (
    <Button
      variant={"default"}
      className="w-full lg:w-44 flex justify-start mt-4"
      disabled={!address || isReviewing}
      onClick={address ? submitProposalMessage : () => { }}
    >
      <FileInput className="w-4 h-4 mr-2" />
      {isReviewing ? (
        <LoaderCircleIcon className="animate-spin h-4 w-4" />
      ) : (
        "Submit proposal"
      )}
    </Button>
  );
}
