"use client"

import React from "react"
import { Stepper } from "../app/subframe/components/Stepper"

function LockupSteper() {
    return (
        <Stepper>
            <Stepper.Step
                variant="disabled"
                firstStep={true}
                stepNumber="1"
                label="Convert to LSM"
                description="Convert your staked ATOM to LSM Shares on the Cosmos Hub."
            />
            <Stepper.Step
                variant="disabled"
                stepNumber="2"
                label="Transfer to Neutron"
                description="Transfer to your LSM Shares to Neutron."
            />
            <Stepper.Step
                lastStep={true}
                variant="active"
                stepNumber="3"
                label="Get Voting Power"
                description="Lock your LSM shares for Voting Power on Neutron."
            />
        </Stepper>
    )
}

export default LockupSteper
