import { Icon } from "@/components/Icon"
import { HYDRO_TELEGRAM_URL } from "@/config"

const LearnMoreOrJoinTelegram = (
  <span>
    <span className="font-bold underline">
      Learn More <Icon name="solid:arrow-up-right" />
    </span>{" "}
    and{" "}
    <a
      href={HYDRO_TELEGRAM_URL}
      className="font-bold underline"
      target="_blank"
    >
      Join Telegram <Icon name="solid:arrow-up-right" />
    </a>
  </span>
)

export const Banners = {
  maxCapacity: {
    href: "/docs#max-capacity",
    text: (
      <>
        Current lockup caps have been reached, but it&rsquo;s not over!{" "}
        {LearnMoreOrJoinTelegram}
      </>
    ),
  },
  pilotRounds: {
    href: "/docs#pilot-rounds",
    text: (
      <>Hydro is currently running pilot rounds. {LearnMoreOrJoinTelegram}</>
    ),
  },
}
