"use client";
/*
 * Documentation:
 * Stepper — https://app.subframe.com/library?component=Stepper_3c5d47dc-1b1a-45d9-b244-18422d7bfb56
 */

import React from "react";
import * as SubframeCore from "@subframe/core";

interface StepProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "completed" | "active" | "disabled";
  firstStep?: boolean;
  lastStep?: boolean;
  stepNumber?: string;
  label?: string;
  description?: string;
  className?: string;
}

const Step = React.forwardRef<HTMLElement, StepProps>(function Step(
  {
    variant = "default",
    firstStep = false,
    lastStep = false,
    stepNumber,
    label,
    description,
    className,
    ...otherProps
  }: StepProps,
  ref
) {
  return (
    <div
      className={SubframeCore.twClassNames(
        "group/c1145464 flex cursor-pointer flex-row gap-3 h-[136px] items-center relative",
        className,
        { "h-[82px]": firstStep },
        { 'items-start': firstStep },
      )}
      ref={ref as any}
      {...otherProps}
    >
      <div
        className={SubframeCore.twClassNames(
          "flex items-center justify-center flex-col",
          { "flex-col self-end": firstStep },
        )}
      >
        <div
          className={SubframeCore.twClassNames(
            "flex-grow border-l border-color-[#FFE1B8] h-[54px]",
            { "border-[unset] border-transparent": firstStep }
          )}
        />
        <div
          className={SubframeCore.twClassNames(
            "flex h-7 w-7 flex-none flex-col items-center justify-center gap-2 rounded-full bg-neutral-100",
            { "bg-brand-100": variant === "active" || variant === "completed" },
            {
              "bg-neutral-600": variant === "disabled",
            }
          )}
        >
          {stepNumber ? (
            <span
              className={SubframeCore.twClassNames(
                "text-caption-bold font-caption-bold text-subtext-color",
                {
                  "text-brand-700":
                    variant === "active" || variant === "completed",
                }
              )}
            >
              {stepNumber}
            </span>
          ) : null}
        </div>
        <div
          className={SubframeCore.twClassNames(
            "flex-grow border-l border-color-[#FFE1B8] h-[54px]",
            { "border-[unset] border-transparent": lastStep }
          )}
        />
      </div>

      <div
        className={SubframeCore.twClassNames({ "mt-9": !firstStep })}
      >
        {label ? (
          <span
            className={SubframeCore.twClassNames(
              "text-center text-base not-italic font-semibold leading-6 tracking-[0.08px]",
              { "font-body-bold": variant === "active" },
              {
                "text-neutral-600": variant === "disabled",
              }
            )}
          >
            {label}
          </span>
        ) : null}
        {description ? (
          <div
            className={SubframeCore.twClassNames(
              "text-gray-500 text-sm not-italic font-medium leading-5 tracking-[0.07px] w-[225px]",
              {
                "text-neutral-600": variant === "disabled",
              }
            )}
          >
            {description}
          </div>
        ) : null}
      </div>
    </div>
  );
});

interface StepperRootProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  className?: string;
}

const StepperRoot = React.forwardRef<HTMLElement, StepperRootProps>(
  function StepperRoot(
    { children, className, ...otherProps }: StepperRootProps,
    ref
  ) {
    return children ? (
      <div
        className={SubframeCore.twClassNames(
          "flex flex-col items-start",
          className
        )}
        ref={ref as any}
        {...otherProps}
      >
        {children}
      </div>
    ) : null;
  }
);

export const Stepper = Object.assign(StepperRoot, {
  Step,
});
