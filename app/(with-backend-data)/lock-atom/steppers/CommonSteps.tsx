export function CommonSteps(stepName: string) {
  switch (stepName) {
    case "WaitingForIBCSigning":
      return {
        isWorking: true,
        title: "Transfer your Tokenized ATOM to Hydro",
        contents: (
          <p>
            Approve the transaction in your wallet to continue. This will start
            the transfer of your tokenized {process.env.NEXT_PUBLIC_VOTING_TOKEN_NAME} to Hydro.
          </p>
        ),
      }

    case "WaitingForLockingSigning":
      return {
        isWorking: true,
        title: "Lock your ATOM, get voting power",
        contents: (
          <p>
            Approve in your wallet again to lock your {process.env.NEXT_PUBLIC_VOTING_TOKEN_NAME}. This will initiate
            the locking of your {process.env.NEXT_PUBLIC_STAKED_TOKEN_NAME} into the Hydro contract to receive
            voting power.
          </p>
        ),
      }

    case "WaitingForLockingBroadcast":
      return {
        isWorking: true,
        title: `Locking Your ${process.env.NEXT_PUBLIC_VOTING_TOKEN_NAME}...`,
        contents: <p>Just a few seconds, unless the network is congested</p>,
      }

    case "WaitingForIBCBroadcastAndRelay":
      return {
        isWorking: true,
        title: "Transfer your Tokenized ATOM to Hydro",
        contents: (
          <p>
            Wait until the transfer is complete. This could take 30 seconds or longer if the network is congested. If
            you exit Hydro, this status may not be visible when you return, but
            the transfer will continue. Once the transfer is complete, you will
            need to return to initiate the lockup process.
          </p>
        ),
      }
  }

  return {
    isWorking: false,
    title: "",
    contents: null,
  }
}
