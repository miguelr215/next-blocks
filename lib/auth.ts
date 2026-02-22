import { db } from "@/db/drizzle";
import { schema } from "@/db/schema";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";

export const auth = betterAuth({
	baseURL: process.env.BETTER_AUTH_URL,
	socialProviders: {
		google: {
			clientId: process.env.GOOGLE_CLIENT_ID as string,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
		},
	},
	emailAndPassword: {
		enabled: true,
	},
	user: {
		additionalFields: {
			phoneNumber: {
				type: "string",
				required: false,
				input: false,
				fieldName: "phoneNumber",
			},
			phoneVerified: {
				type: "boolean",
				defaultValue: false,
				input: false,
				fieldName: "phoneVerified",
			},
			bgColor: {
				type: "string",
				defaultValue: "bg-primary",
				input: false,
				fieldName: "bgColor",
			},
			role: {
				type: "string",
				defaultValue: "USER",
				input: false,
				fieldName: "role",
			},
			isActive: {
				type: "boolean",
				defaultValue: true,
				input: false,
				fieldName: "isActive",
			},
			accountBalance: {
				type: "string",
				defaultValue: "0",
				input: false,
				fieldName: "accountBalance",
			},
		},
	},
	database: drizzleAdapter(db, {
		provider: "pg",
		schema,
	}),
	session: {
		cookieCache: {
			enabled: true,
			maxAge: 60 * 60 * 24 * 7, // 7 days
			strategy: "compact",
		},
	},
	plugins: [nextCookies()], // make sure nextCookies() is the last plugin in the array
});
