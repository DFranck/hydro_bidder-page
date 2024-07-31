"use client";
import { Button } from "@/components/ui/button";
import { useChain } from "@cosmos-kit/react";

import { StdFee } from "@cosmjs/amino";

import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { ArrowBigRight, LoaderCircleIcon } from "lucide-react";
import { prepareOptIn } from "./prop";
import { DEFAULT_CHAIN } from "@/config";

export const DEFAULT_VALOPER =
  "cosmosvaloper1uu2v5wa80vn3rku6l2fd686p4vr6662s8wsj6x";

export function SubmitOptIn() {
  const { getSigningStargateClient, address } = useChain(DEFAULT_CHAIN);

  const { toast } = useToast();

  const [isReviewing, setIsReviewing] = useState(false);

  const fee: StdFee = {
    amount: [
      {
        denom: "uatom",
        amount: "100000",
      },
    ],
    gas: "500000",
  };

  const sendOptIn = async () => {
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

      const optInMsg = prepareOptIn(DEFAULT_VALOPER, "newchain-1");
      response = await stargateClient.signAndBroadcast(
        "cosmos1uu2v5wa80vn3rku6l2fd686p4vr6662sz6y8k4",
        [optInMsg],
        fee,
        ""
      );
      // console.log(response);
      toast({
        title: response.code === 0 ? "Success" : "Error",
        description:
          response.code === 0
            ? "Your Tx has been submitted successfully."
            : `Error submitting Tx - Code: ${response.code}\nLog: ${response.rawLog}`,
        variant: response.code === 0 ? "default" : "destructive",
      });
    } catch (error) {
      // console.log("ERROR", error);
      const anyErr = error as any;
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
      className="w-full flex justify-start min-w-44"
      variant={"ghost"}
      disabled={!address || isReviewing}
      onClick={address ? sendOptIn : () => {}}
    >
      {isReviewing ? (
        <LoaderCircleIcon className="animate-spin h-4 w-4" />
      ) : (
        <>
          <ArrowBigRight className="w-4 h-4 text-green-400 mr-2" />
          Validator Opt-in
        </>
      )}
    </Button>
  );
}
