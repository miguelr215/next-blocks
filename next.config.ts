import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	/* config options here */
	images: {
		remotePatterns: [
			{
				protocol: "https", // Specify the protocol, e.g., 'https'
				hostname: "a.espncdn.com", // Specify the domain name without leading protocol or path
			},
			// Add more domains as needed
			// {
			//   protocol: 'https',
			//   hostname: 'another-example.com',
			//   pathname: '/images/**',
			// },
		],
	},
};

export default nextConfig;
