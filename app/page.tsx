import Image from "next/image";
import Button from "./ui/Button";
import { HorizontalDivider } from "./ui/HorizontalDivider";
import { Newsletter } from "./ui/Newsletter";
import { Footer } from "./ui/Footer";
import { Convert } from "./ui/modals/steps/Convert";
import { GetHAtom } from "./ui/modals/steps/GetHAtom";
import { Congratulations } from "./ui/modals/steps/Congratulations";
import StartLockup from "./ui/modals/steps/StartLockup";

const howHydroWorksTiles = [
  {
    title: "Connect Wallet",
    description: "Correct your compatible wallet to the Hydro platform.",
    icon: "/images/Wallet_Light.svg",
  },
  {
    title: "Lock stATOM",
    description:
      "Lock ATOM for your chosen duration to get Voting Power.",
    icon: "/images/Lock_Light.svg",
  },
  {
    title: "Vote",
    description:
      "Use your Voting Power to choose the best projects that need liquidity and are offering you rewards.",
    icon: "/images/Vote_Light.svg",
  },
  {
    title: "Earn Rewards",
    description:
      "Receive tribute each round from projects in exchange for providing them with liquidity.",
    icon: "/images/Rewards_Light.svg",
  },
  {
    title: "Renew and Top-up",
    description:
      "Sustain or increase your voting power by renewing or adding to your ATOM lockups.",
    icon: "/images/Renew_Light.svg",
  },
  {
    title: "Repeat",
    description:
      "Participate in new rounds and tranches to continue earning rewards from projects on the Hydro platform.",
    icon: "/images/Repeat_Light.svg",
  },
];

const benefitsCheckList = [
  "Participate in the growth of the Cosmos ecosystem",
  "Provide attractive rewards for your project supporters",
  "Access liquidity for your project",
  "Gain exposure and visibility within the Cosmos community",
];

const howItWorksForProjectsTiles = [
  {
    title: "Get Allowlisted",
    description:
      "Apply to get your project allowlisted on Hydro and start the process.",
    icon: "/images/Graphic_List.svg",
  },
  {
    title: "Offer Tribute",
    description:
      "Offer tribute to incentivize ATOM holders to support your project and provide liquidity.",
    icon: "/images/Graphic_Offer.svg",
  },
  {
    title: "Gain Voter Support",
    description:
      "Attract voter support and access liquidity to your project’s growth.",
    icon: "/images/Graphic_Vote.svg",
  },
];

type Tile = {
  title: string;
  description: string;
  icon: string;
};

type TilesType = {
  tiles: Tile[];
  size: "small" | "large";
};

export default function Home() {
  const renderTiles = (data: TilesType) => {
    return (
      <div className={`grid grid-cols-3 gap-[60px] z-10 my-[60px] mx-[90px]`}>
        {data.tiles.map((tile, index) => {
          return (
            <div
              key={index}
              className={`flex w-[${data.size === "small" ? "285px" : "330px"
                }] flex-col items-start gap-4 shrink-0 ${data.size === "small" ? "p-6" : ""
                } rounded-[10px]`}
            >
              <Image
                src={tile.icon}
                alt={tile.title}
                width={data.size === "small" ? 100 : 220}
                height={data.size === "small" ? 100 : 220}
              />
              <h3>{tile.title}</h3>
              <p className="text-xl font-normal leading-[30px]">{tile.description}</p>
            </div>
          );
        })}
      </div>
    );
  };

  const renderBenefits = () => {
    return (
      <div className="mt-[20px] mb-[60px]">
        {benefitsCheckList.map((item, index) => {
          return (
            <div
              key={index}
              className="flex flex-row items-center gap-4 shrink-0 rounded-[10px]"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
              >
                <g clipPath="url(#clip0_174_196)">
                  <path
                    d="M6.90602 16.948C6.67402 16.948 6.44002 16.86 6.26402 16.682L0.266023 10.694C-0.0899765 10.34 -0.0899765 9.76401 0.266023 9.40801C0.620023 9.05201 1.19602 9.05201 1.55202 9.40801L6.91002 14.758L18.452 3.31601C18.808 2.96201 19.384 2.96401 19.738 3.32201C20.092 3.67801 20.09 4.25401 19.732 4.60801L7.54802 16.688C7.37002 16.864 7.14002 16.952 6.90802 16.952L6.90602 16.948Z"
                    fill="#FFE1B8"
                  />
                </g>
              </svg>
              <p className="w-[569px] text-white text-xl font-normal font-['Inter'] leading-10">{item}</p>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <main className="w-full mx-auto flex min-h-screen flex-col bg-[#080815] bg-contain bg-no-repeat bg-[url('/images/AdobeStock_633966567.png')] relative after:z-[0] after:content-[''] after:absolute after:shadow-[0_0px_100px_300px_black] after:pointer-events-none after:top-[978px] after:inset-x-0">
      <div className="ml-[88px]">
        <div className="mt-[155px]">
          <h1>Unlock the Power of Hydro</h1>
        </div>
        <p className="w-[733px] text-white text-xl font-normal font-['Inter'] leading-7 mt-[20px]">
          Hydro is a decentralized platform that allows you to lock your ATOM tokens <br />and earn rewards. Earn passive income, participate in ICS projects, and more.
        </p>
        <div className="flex gap-5 mt-[60px]">
          <Convert />
          <GetHAtom />
          <Congratulations />
          <StartLockup />
        </div>
      </div>
      <div className="text-center mt-[330px] z-[1]">
        <h2>How Hydro Works</h2>
      </div>
      <div className="flex flex-col items-center">
        <div className="text-center text-white text-xl font-normal leading-[30px] z-[1] mt-[20px]">
          Understand the step-by-step process of participating in the Hydro
          ecosystem.
        </div>
        {renderTiles({ tiles: howHydroWorksTiles, size: "small" })}
        <Button type="secondary" style="filled" title="Get Started" />
      </div>
      <HorizontalDivider style="mt-[60px] mb-[150px] mx-[60px]" />
      <div className="ml-[112px] bg-contain bg-no-repeat bg-right bg-[url('/images/AdobeStock_856949849.png')] mix-blend-screen">
        <p className="text-[#FFE1B8] slashed-zero text-base not-italic font-medium leading-[130%] tracking-[1.28px] uppercase">
          benefits
        </p>
        <h2>Unlock the Power of Liquidity</h2>
        <div className="w-[598px] text-xl leading-[30px] pt-5">
          Hydro provides a unique opportunity to project to access liquidity and
          gain exposure, while rewarding ATOM holders for their participation.
        </div>
        {renderBenefits()}
        <Button type="secondary" style="filled" title="Get Allowlisted" />
      </div>
      <div className="flex flex-col items-center px-[90px]  bg-gradient-to-b from-[rgba(0,21,45,0.20)] to-[rgba(0,59,147,0.40)]">
        <p className="text-[#FFE1B8] slashed-zero text-base not-italic font-medium leading-[130%] tracking-[1.28px] uppercase mt-[210px]">
          for projects
        </p>
        <h2 className="mt-[14px]">How it Works for Projects</h2>
        <p className="w-[693px] text-center text-white text-xl font-normal leading-[30px] mt-5">
          Hydro provides a unique opportunity for projects to access liquidity
          and gain exposure, while rewarding ATOM holders for their
          participation through a multi-step process involving tribute auctions.
        </p>
        {renderTiles({ tiles: howItWorksForProjectsTiles, size: "large" })}
        <div className="flex gap-5 mt-[60px] mb-[80px]">
          <Button type="secondary" style="filled" title="Get Allowlisted" />
          <Button type="secondary" style="outline" title="Read Docs" />
        </div>
      </div>
      <Newsletter />
      <Footer />
    </main>
  );
}
