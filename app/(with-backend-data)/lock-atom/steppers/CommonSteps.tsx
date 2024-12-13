export function CommonSteps(stepName: string) {
  switch (stepName) {
    case "WaitingForIBCSigning":
      return {
        isWorking: true,
        title: "Approve IBC Transfer",
        contents: (
          <p>
            Approve the transaction in your wallet to continue. This will start
            the transfer of your tokenized ATOM to Hydro.
          </p>
        ),
      }

    case "WaitingForLockingSigning":
      return {
        isWorking: true,
        title: "Approve Locking",
        contents: (
          <p>
            Approve in your wallet again to lock your ATOM. This will initiate
            the locking of your staked ATOM into the Hydro contract to receive
            voting power.
          </p>
        ),
      }

    case "WaitingForLockingBroadcast":
      return {
        isWorking: true,
        title: "Locking Your ATOM...",
        contents: <p>Just a few seconds, unless the network is congested</p>,
      }

    case "WaitingForIBCBroadcastAndRelay":
      return {
        isWorking: true,
        title: "Transferring to Hydro...",
        contents: (
          <p>
            This could take 30 seconds or longer if the network is congested. If
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
