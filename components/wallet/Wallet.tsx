import { useEffect } from "react";
import { WalletStatus } from "@cosmos-kit/core";
import { useChain } from "@cosmos-kit/react";
import { CHAIN_NAME, CHAIN_NAME_STORAGE_KEY, DEFAULT_CHAIN } from "@/config";
import {
  WButtonConnect,
  WButtonConnected,
  WButtonConnecting,
  WButtonDisconnected,
  WButtonError,
  WButtonNotExist,
  WButtonRejected,
} from "./Connect";
import { useToast } from "../ui/use-toast";

export type WalletProps = {
  chainName?: string;
  onChainChange?: (chainName?: string) => void;
};

export function Wallet({
  chainName = CHAIN_NAME,
  onChainChange = () => { },
}: WalletProps) {
  const { chain, status, address, message, connect, openView } =
    useChain(DEFAULT_CHAIN);

  // console.log(DEFAULT_CHAIN, "USING CHAIN", chain);

  const { toast } = useToast();

  const ConnectButton = {
    [WalletStatus.Connected]: (
      <WButtonConnected address={address} onClick={openView} />
    ),
    [WalletStatus.Connecting]: <WButtonConnecting />,
    [WalletStatus.Disconnected]: <WButtonDisconnected onClick={connect} />,
    [WalletStatus.Error]: <WButtonError onClick={openView} />,
    [WalletStatus.Rejected]: <WButtonRejected onClick={connect} />,
    [WalletStatus.NotExist]: <WButtonNotExist onClick={openView} />,
  }[status] || <WButtonConnect onClick={connect} />;

  useEffect(() => {
    if (
      message &&
      [WalletStatus.Error, WalletStatus.Rejected].includes(status)
    ) {
      toast({
        title: "Wallet Connection Error",
        description: message,
        variant: "destructive",
      });
    }
  }, [message, status, toast]);

  useEffect(() => {
    const selected = localStorage.getItem(CHAIN_NAME_STORAGE_KEY);
    if (selected && selected !== chainName) {
      onChainChange(selected);
    }
  }, [chainName, onChainChange]);

  return (
    <>
      {ConnectButton}
    </>
  );
}
