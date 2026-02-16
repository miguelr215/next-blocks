import Image from "next/image"
import footballLoaderGif from "@/public/football-loader.gif"

const footballLoader = () => {
    return (
        <div>
            <Image
                src={footballLoaderGif}
                alt="Loading..."
                width={300}
                height={300}
            />
        </div>
    )
}

export default footballLoader