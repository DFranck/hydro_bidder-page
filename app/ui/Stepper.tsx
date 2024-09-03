"use client";

import React from "react";
import { Stepper } from "../subframe/components/Stepper";

function LockupSteper() {
    return (
        <Stepper>
            <Stepper.Step
                variant="completed"
                firstStep={true}
                stepNumber="1"
                label="Create an account"
            />
            <Stepper.Step variant="active" stepNumber="2" label="Enter details" />
            <Stepper.Step lastStep={true} stepNumber="3" label="Start building!" />
        </Stepper>
    );
}

export default LockupSteper;