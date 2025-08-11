"use client"
import { WalletButton } from "@/app/(v2)/v2/components/WalletButton";
import { Icon } from "@/components/Icon";
import { StyledText } from "@/components/StyledText";
import { useChain } from "@cosmos-kit/react";
import { useEffect, useState } from "react";
import { getDisplayDenom } from "../../../utils/getDisplayDenom";
import { LockupActionFormProps } from "../../types";
import { LockupActionSubmit } from "../LockupActionSubmit";

export default function BuyActionFields(props: LockupActionFormProps<"buy">) {
  const {lockup, payload, onClose, onConfirm, isProcessing, isFormValid, isDisabled } =
    props

  const neutron = useChain("neutron");
  const [hasEnough, setHasEnough] = useState(false);
  const [loadingBalance, setLoadingBalance] = useState(true);
  const price = lockup?.listing?.price; 
const isListed = lockup.listing.collection !== "not-for-sale"

  useEffect(() => {
    let cancelled = false;
    if(!isListed) {
      setLoadingBalance(false);
      return
    }
    const checkBalance = async () => {
      const address = neutron.address;

      if (!address || !price) {
        console.warn("No address or no price -> cannot buy");
        if (!cancelled) {
          setHasEnough(false);
          setLoadingBalance(false);
        }
        return;
      }

      setLoadingBalance(true);
      try {
        const client = await neutron.getStargateClient();
        const balances = await client.getAllBalances(address);
        const haveBase = balances.find((b) => b.denom === price.denom)?.amount ?? "0";
        const have = BigInt(haveBase);
        const need = BigInt(price.amount);

        if (!cancelled) setHasEnough(have >= need);
      } catch (e) {
        console.error("balance check failed:", e);
        if (!cancelled) setHasEnough(false);
      } finally {
        if (!cancelled) setLoadingBalance(false);
       
      }
    };

    checkBalance();
    return () => { cancelled = true; };
  }, [neutron.address, lockup?.listing?.price?.denom, lockup?.listing?.price?.amount]);

 if (loadingBalance) {
    return (
      <div className="flex gap-4 justify-end ">
        <StyledText
          as="button"
          variant="button.secondary"
          type="button"
          className="border-none"
          onClick={onClose}
        >
          Close
        </StyledText>
        <StyledText
        as="button"
        variant="button.primary.small"
        disabled
      >
        <Icon name="solid:loader" className="animate-spin"/>
      </StyledText>
      </div>
    );
  }
if ((!neutron.address || !hasEnough) && isListed) {

  return (
    <div className="flex gap-4 justify-end ">
      <StyledText
        as="button"
        variant="button.secondary"
        type="button"
        className="border-none"
        onClick={onClose}
        disabled={isProcessing}
      >
        Close
      </StyledText>

      {!neutron.address ? (
        <WalletButton inline />
      ) : (
        <StyledText
          as="a"
          href="https://go.skip.build/?src_asset=ibc%2FF663521BF1836B00F5F177680F74BFB9A8B5654A694D0D2BC249E03CF2509013&src_chain=cosmoshub-4&dest_asset=ibc%2FC4CFF46FD6DE35CA4CF4CE031E643C8FDC9BA4B99AE598E9B0ED98FE3A2319F9&dest_chain=neutron-1&amount_in=&amount_out="
          target="_blank"
          rel="noopener noreferrer"
          variant="button.primary"
          tooltip={`You have insufficient ${getDisplayDenom(
            price?.denom
          )} to purchase this NFT. Buy more ${getDisplayDenom(price?.denom)}.`}
        >
          {`Buy more ${getDisplayDenom(price?.denom)}`}
        </StyledText>
      )}
    </div>
  );
}

  return (
    <LockupActionSubmit
      isDisabled={isDisabled ? true : false}
      action="buy"
      onClose={onClose}
      onConfirm={onConfirm}
      isProcessing={isProcessing}
      isFormValid={isFormValid}
      payload={payload}
    />
  )
}
