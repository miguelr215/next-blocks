"use server";

import { auth } from "@/lib/auth";
import { db } from "@/db/drizzle";
import { user } from "@/db/schema";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";

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

export const signUp = async (
  username: string,
  email: string,
  password: string,
) => {
  try {
    await auth.api.signUpEmail({
      body: {
        email,
        password,
        name: username,
      },
    });

    return {
      success: true,
      message: "Sign up successful",
    };
  } catch (error) {
    const e = error as Error;
    return {
      success: false,
      message: `Error: ${e.message}`,
    };
  }
};

/**
 * Updates the authenticated user's email address.
 *
 * @param email - The new email address to set
 * @returns Object with success status and message
 */
export const updateUserEmail = async (email: string) => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return {
        success: false,
        message: "User not authenticated",
      };
    }

    await db.update(user).set({ email }).where(eq(user.id, session.user.id));

    return {
      success: true,
      message: "Email updated successfully",
    };
  } catch (error) {
    const e = error as Error;
    return {
      success: false,
      message: `Error: ${e.message}`,
    };
  }
};

/**
 * Updates the authenticated user's display name.
 *
 * @param name - The new display name to set
 * @returns Object with success status and message
 */
export const updateUserName = async (name: string) => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return {
        success: false,
        message: "User not authenticated",
      };
    }

    await db.update(user).set({ name }).where(eq(user.id, session.user.id));

    return {
      success: true,
      message: "Name updated successfully",
    };
  } catch (error) {
    const e = error as Error;
    return {
      success: false,
      message: `Error: ${e.message}`,
    };
  }
};

/**
 * Updates the authenticated user's profile image.
 *
 * @param image - The new image URL to set
 * @returns Object with success status and message
 */
export const updateUserImage = async (image: string) => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return {
        success: false,
        message: "User not authenticated",
      };
    }

    await db.update(user).set({ image }).where(eq(user.id, session.user.id));

    return {
      success: true,
      message: "Image updated successfully",
    };
  } catch (error) {
    const e = error as Error;
    return {
      success: false,
      message: `Error: ${e.message}`,
    };
  }
};

/**
 * Updates the authenticated user's background color.
 *
 * @param bgColor - The new background color class to set (e.g. "bg-primary", "bg-red-500")
 * @returns Object with success status and message
 */
export const updateUserBgColor = async (bgColor: string) => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return {
        success: false,
        message: "User not authenticated",
      };
    }

    await db.update(user).set({ bgColor }).where(eq(user.id, session.user.id));

    return {
      success: true,
      message: "Background color updated successfully",
    };
  } catch (error) {
    const e = error as Error;
    return {
      success: false,
      message: `Error: ${e.message}`,
    };
  }
};

/**
 * Updates the authenticated user's phone number.
 *
 * @param phoneNumber - The new phone number to set
 * @returns Object with success status and message
 */
export const updateUserPhoneNumber = async (phoneNumber: string) => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return {
        success: false,
        message: "User not authenticated",
      };
    }

    await db
      .update(user)
      .set({ phoneNumber })
      .where(eq(user.id, session.user.id));

    return {
      success: true,
      message: "Phone number updated successfully",
    };
  } catch (error) {
    const e = error as Error;
    return {
      success: false,
      message: `Error: ${e.message}`,
    };
  }
};
