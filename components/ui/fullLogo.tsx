import Image from "next/image"
import sbFullLogo from "@/public/sports-blocks-full-logo.png"

const FullLogo = () => {
    return (
        <Image
            src={sbFullLogo}
            alt="Sports Blocks logo"
        />
    )
}

export default FullLogo