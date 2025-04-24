export function CommonSteps(stepName: string) {
  switch (stepName) {
    case "WaitingForIBCSigning":
      return {
        isWorking: true,
        title: "(2/3) Transfer your Tokenized ATOM to Hydro",
        contents: (
          <p>
            Approve the transaction in your wallet to continue.
          </p>
        ),
      }

    case "WaitingForLockingSigning":
      return {
        isWorking: true,
        title: "(3/3) Lock your ATOM, get voting power",
        contents: (
          <p>
            Approve the transaction in your wallet to continue.
          </p>
        ),
      }

    case "WaitingForLockingBroadcast":
      return {
        isWorking: true,
        title: "(3/3) Lock your ATOM, get voting power",
        contents: <p>Wait until your transaction is included in a block. This should only take a few seconds.</p>,
      }

    case "WaitingForIBCBroadcastAndRelay":
      return {
        isWorking: true,
        title: "(2/3) Transfer your Tokenized ATOM to Hydro",
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
