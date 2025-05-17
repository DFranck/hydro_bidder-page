import { ContentContainer } from "@/components/ContentContainer"
import { Icon } from "@/components/Icon"
import { IconString } from "@/components/Icon/types"
import { SOCIAL_MEDIA_LINKS } from "@/config"
import Image from "next/image"
import Link from "next/link"

export const Footer = () => {
  return (
    <div className="bg-black">
      <ContentContainer
        className="
          z-10
          flex-col
          items-center
          justify-between
          gap-3
          py-6
          text-base
          font-normal
          italic
          leading-[160%]
          text-white/60
          md:flex-row
        "
      >
        <Link href={"/"} className="relative block h-[35px] w-[160px]">
          <Image
            className="object-contain"
            src={"/images/logo.svg"}
            alt="Hydro Logo"
            fill
            sizes="160px"
          />
        </Link>

        <div className="px-6 text-center">
          <span>Built for the Cosmos Hub by </span>
          <a
            className="
              inline-flex
              items-center
              gap-1
              whitespace-nowrap
              underline
              hover:text-white
            "
            href="https://informal.systems"
            target="_blank"
          >
            <span>Informal Systems</span>
            <Icon name="solid:arrow-up-right" />
          </a>
        </div>

        <div
          className="
            flex
            flex-row
            items-center
            justify-between
            gap-3
          "
        >
          {SOCIAL_MEDIA_LINKS.map(({ name, url, icon }) => (
            <a href={url} target="_blank" title={name} key={name}>
              <Icon name={icon as IconString} />
              <span className="sr-only">{name}</span>
            </a>
          ))}
        </div>
      </ContentContainer>
    </div>
  )
}
