import Image from "next/image"
import sbSmallLogo from "@/public/sports-blocks-logo.png"

const SmallLogo = () => {
    return (
        <Image
            src={sbSmallLogo}
            alt="Sports Blocks logo"
        />
    )
}

export default SmallLogo