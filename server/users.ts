"use server";

import { auth } from "@/lib/auth";

export const signIn = async (email: string, password: string) => {
	try {
		await auth.api.signInEmail({
			body: {
				email,
				password,
			},
		});

		return {
			success: true,
			message: "Sign in successful",
		};
	} catch (error) {
		const e = error as Error;
		return {
			success: false,
			message: `Error: ${e.message}`,
		};
	}
};

export const signUp = async () => {
	await auth.api.signUpEmail({
		body: {
			email: "mr@test.com",
			password: "password123",
			name: "Johnny",
		},
	});
};
