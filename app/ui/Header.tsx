import ConnectButton from "./ConnectButton"
import { Logo } from "./Logo"
import { NaviBurger } from "./NaviBurger"

export const Header = () => {
    return (
        <div className="z-10 w-full items-center justify-between font-mono text-sm lg:flex">
            <Logo />
            <div className="flex flex-row items-center justify-between gap-6">
                <ConnectButton />
                <NaviBurger />
            </div>
        </div>
    )
}