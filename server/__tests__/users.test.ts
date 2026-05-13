import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock the auth module
const mockSignInEmail = vi.fn();
const mockSignUpEmail = vi.fn();
const mockGetSession = vi.fn();
vi.mock("@/lib/auth", () => ({
  auth: {
    api: {
      signInEmail: (...args: unknown[]) => mockSignInEmail(...args),
      signUpEmail: (...args: unknown[]) => mockSignUpEmail(...args),
      getSession: (...args: unknown[]) => mockGetSession(...args),
    },
  },
}));

// Use vi.hoisted for variables referenced inside vi.mock factories
const {
  mockWhere,
  mockSet,
  mockUpdate,
  mockEq,
  mockAnd,
  mockHeaders,
  mockHashPassword,
} = vi.hoisted(() => {
  const mockWhere = vi.fn();
  const mockSet = vi.fn(() => ({ where: mockWhere }));
  const mockUpdate = vi.fn((_table: unknown) => ({ set: mockSet }));
  const mockEq = vi.fn((...args: unknown[]) => args);
  const mockAnd = vi.fn((...args: unknown[]) => args);
  const mockHeaders = vi.fn();
  const mockHashPassword = vi.fn();
  return {
    mockWhere,
    mockSet,
    mockUpdate,
    mockEq,
    mockAnd,
    mockHeaders,
    mockHashPassword,
  };
});

// Mock db with chainable update method
vi.mock("@/db/drizzle", () => ({
  db: {
    update: (table: unknown) => mockUpdate(table),
  },
}));

// Mock schema (required import in users.ts)
vi.mock("@/db/schema", () => ({
  account: { userId: "account.userId", providerId: "account.providerId" },
  user: { id: "user.id" },
}));

// Mock drizzle-orm (required import in users.ts)
vi.mock("drizzle-orm", () => ({
  and: (...args: unknown[]) => mockAnd(...args),
  eq: (...args: unknown[]) => mockEq(...args),
}));

// Mock next/headers (required import in users.ts)
vi.mock("next/headers", () => ({
  headers: (...args: unknown[]) => mockHeaders(...args),
}));

// Mock better-auth/crypto (required import in users.ts)
vi.mock("better-auth/crypto", () => ({
  hashPassword: (...args: unknown[]) => mockHashPassword(...args),
}));

import {
  signIn,
  signUp,
  updateUserBgColor,
  updateUserEmail,
  updateUserImage,
  updateUserName,
  updateUserPassword,
  updateUserPhoneNumber,
} from "@/server/users";

describe("signIn", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns success when sign in succeeds", async () => {
    mockSignInEmail.mockResolvedValue(undefined);

    const result = await signIn("test@example.com", "password123");

    expect(result).toEqual({
      success: true,
      message: "Sign in successful",
    });
  });

  it("calls auth.api.signInEmail with correct email and password", async () => {
    mockSignInEmail.mockResolvedValue(undefined);

    await signIn("user@example.com", "myPassword");

    expect(mockSignInEmail).toHaveBeenCalledTimes(1);
    expect(mockSignInEmail).toHaveBeenCalledWith({
      body: {
        email: "user@example.com",
        password: "myPassword",
      },
    });
  });

  it("returns failure with error message when sign in throws", async () => {
    mockSignInEmail.mockRejectedValue(new Error("Invalid credentials"));

    const result = await signIn("bad@example.com", "wrongPassword");

    expect(result).toEqual({
      success: false,
      message: "Error: Invalid credentials",
    });
  });

  it("returns failure when auth API throws a network error", async () => {
    mockSignInEmail.mockRejectedValue(new Error("Network error"));

    const result = await signIn("test@example.com", "password123");

    expect(result).toEqual({
      success: false,
      message: "Error: Network error",
    });
  });

  it("handles non-Error thrown values by casting to Error", async () => {
    mockSignInEmail.mockRejectedValue({ message: "some object error" });

    const result = await signIn("test@example.com", "password123");

    // The catch block casts to Error, so e.message should still work
    expect(result.success).toBe(false);
    expect(result.message).toBe("Error: some object error");
  });

  it("passes empty string email and password without pre-validation", async () => {
    mockSignInEmail.mockResolvedValue(undefined);

    const result = await signIn("", "");

    expect(result).toEqual({
      success: true,
      message: "Sign in successful",
    });
    expect(mockSignInEmail).toHaveBeenCalledWith({
      body: {
        email: "",
        password: "",
      },
    });
  });
});

describe("signUp", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns success when sign up succeeds", async () => {
    mockSignUpEmail.mockResolvedValue(undefined);

    const result = await signUp("testuser", "test@example.com", "password123");

    expect(result).toEqual({
      success: true,
      message: "Sign up successful",
    });
  });

  it("calls auth.api.signUpEmail with correct username, email, and password", async () => {
    mockSignUpEmail.mockResolvedValue(undefined);

    await signUp("myUser", "user@example.com", "myPassword");

    expect(mockSignUpEmail).toHaveBeenCalledTimes(1);
    expect(mockSignUpEmail).toHaveBeenCalledWith({
      body: {
        email: "user@example.com",
        password: "myPassword",
        name: "myUser",
      },
    });
  });

  it("returns failure with error message when sign up throws", async () => {
    mockSignUpEmail.mockRejectedValue(new Error("Email already in use"));

    const result = await signUp(
      "testuser",
      "existing@example.com",
      "password123",
    );

    expect(result).toEqual({
      success: false,
      message: "Error: Email already in use",
    });
  });

  it("returns failure when auth API throws a network error", async () => {
    mockSignUpEmail.mockRejectedValue(new Error("Network error"));

    const result = await signUp("testuser", "test@example.com", "password123");

    expect(result).toEqual({
      success: false,
      message: "Error: Network error",
    });
  });

  it("handles non-Error thrown values by casting to Error", async () => {
    mockSignUpEmail.mockRejectedValue({ message: "some object error" });

    const result = await signUp("testuser", "test@example.com", "password123");

    expect(result.success).toBe(false);
    expect(result.message).toBe("Error: some object error");
  });

  it("passes empty strings without pre-validation", async () => {
    mockSignUpEmail.mockResolvedValue(undefined);

    const result = await signUp("", "", "");

    expect(result).toEqual({
      success: true,
      message: "Sign up successful",
    });
    expect(mockSignUpEmail).toHaveBeenCalledWith({
      body: {
        email: "",
        password: "",
        name: "",
      },
    });
  });
});

const mockSession = {
  user: { id: "user-123" },
};

/**
 * Shared setup for tests that require an authenticated session.
 * Clears all mocks and stubs headers before each test.
 */
function setupAuthenticatedTestSuite(): void {
  beforeEach(() => {
    vi.clearAllMocks();
    mockHeaders.mockResolvedValue(new Headers());
  });
}

/**
 * Generates the shared authenticated-update test cases used by
 * updateUserEmail, updateUserName, and updateUserImage.
 *
 * @param updateFn - The server function under test
 * @param fieldName - The DB column name being set (e.g. "email", "name", "image")
 * @param testValue - A representative non-empty value to use in tests
 * @param successMessage - The expected success message returned by updateFn
 */
function describeAuthenticatedUpdate(
  updateFn: (value: string) => Promise<{ success: boolean; message: string }>,
  fieldName: string,
  testValue: string,
  successMessage: string,
): void {
  setupAuthenticatedTestSuite();

  it("returns success when update succeeds", async () => {
    mockGetSession.mockResolvedValue(mockSession);
    mockWhere.mockResolvedValue(undefined);

    const result = await updateFn(testValue);

    expect(result).toEqual({ success: true, message: successMessage });
  });

  it(`calls db.update with correct ${fieldName} and user id`, async () => {
    mockGetSession.mockResolvedValue(mockSession);
    mockWhere.mockResolvedValue(undefined);

    await updateFn(testValue);

    expect(mockUpdate).toHaveBeenCalledWith({ id: "user.id" });
    expect(mockSet).toHaveBeenCalledWith({ [fieldName]: testValue });
    expect(mockEq).toHaveBeenCalledWith("user.id", "user-123");
  });

  it("returns failure when user is not authenticated", async () => {
    mockGetSession.mockResolvedValue(null);

    const result = await updateFn(testValue);

    expect(result).toEqual({
      success: false,
      message: "User not authenticated",
    });
    expect(mockUpdate).not.toHaveBeenCalled();
  });

  it("returns failure when session is undefined", async () => {
    mockGetSession.mockResolvedValue(undefined);

    const result = await updateFn(testValue);

    expect(result).toEqual({
      success: false,
      message: "User not authenticated",
    });
  });

  it("returns failure with error message when db update throws", async () => {
    mockGetSession.mockResolvedValue(mockSession);
    mockWhere.mockRejectedValue(new Error("Database connection lost"));

    const result = await updateFn(testValue);

    expect(result).toEqual({
      success: false,
      message: "Error: Database connection lost",
    });
  });

  it("returns failure when getSession throws", async () => {
    mockGetSession.mockRejectedValue(new Error("Auth service unavailable"));

    const result = await updateFn(testValue);

    expect(result).toEqual({
      success: false,
      message: "Error: Auth service unavailable",
    });
  });

  it("handles non-Error thrown values by casting to Error", async () => {
    mockGetSession.mockRejectedValue({ message: "some object error" });

    const result = await updateFn(testValue);

    expect(result.success).toBe(false);
    expect(result.message).toBe("Error: some object error");
  });

  it("passes empty string without pre-validation", async () => {
    mockGetSession.mockResolvedValue(mockSession);
    mockWhere.mockResolvedValue(undefined);

    const result = await updateFn("");

    expect(result).toEqual({ success: true, message: successMessage });
    expect(mockSet).toHaveBeenCalledWith({ [fieldName]: "" });
  });

  it("passes headers to getSession", async () => {
    const fakeHeaders = new Headers({ authorization: "Bearer token" });
    mockHeaders.mockResolvedValue(fakeHeaders);
    mockGetSession.mockResolvedValue(mockSession);
    mockWhere.mockResolvedValue(undefined);

    await updateFn(testValue);

    expect(mockGetSession).toHaveBeenCalledWith({ headers: fakeHeaders });
  });
}

describe("updateUserEmail", () => {
  describeAuthenticatedUpdate(
    updateUserEmail,
    "email",
    "new@example.com",
    "Email updated successfully",
  );
});

describe("updateUserName", () => {
  describeAuthenticatedUpdate(
    updateUserName,
    "name",
    "New Name",
    "Name updated successfully",
  );
});

describe("updateUserImage", () => {
  describeAuthenticatedUpdate(
    updateUserImage as (
      value: string,
    ) => Promise<{ success: boolean; message: string }>,
    "image",
    "https://example.com/avatar.png",
    "Image updated successfully",
  );

  it("sets image to null to remove the profile image", async () => {
    mockGetSession.mockResolvedValue(mockSession);
    mockWhere.mockResolvedValue(undefined);

    const result = await updateUserImage(null);

    expect(result).toEqual({
      success: true,
      message: "Image updated successfully",
    });
    expect(mockSet).toHaveBeenCalledWith({ image: null });
  });
});

describe("updateUserBgColor", () => {
  describeAuthenticatedUpdate(
    updateUserBgColor,
    "bgColor",
    "bg-red-500",
    "Background color updated successfully",
  );
});

describe("updateUserPhoneNumber", () => {
  describeAuthenticatedUpdate(
    updateUserPhoneNumber,
    "phoneNumber",
    "+1234567890",
    "Phone number updated successfully",
  );
});

describe("updateUserPassword", () => {
  setupAuthenticatedTestSuite();

  it("returns success when password update succeeds", async () => {
    mockGetSession.mockResolvedValue(mockSession);
    mockHashPassword.mockResolvedValue("hashed-new-password");
    mockWhere.mockResolvedValue(undefined);

    const result = await updateUserPassword("newPassword123");

    expect(result).toEqual({
      success: true,
      message: "Password updated successfully",
    });
  });

  it("hashes the password before storing it", async () => {
    mockGetSession.mockResolvedValue(mockSession);
    mockHashPassword.mockResolvedValue("hashed-value");
    mockWhere.mockResolvedValue(undefined);

    await updateUserPassword("myNewPassword");

    expect(mockHashPassword).toHaveBeenCalledTimes(1);
    expect(mockHashPassword).toHaveBeenCalledWith("myNewPassword");
  });

  it("updates the account table with the hashed password", async () => {
    mockGetSession.mockResolvedValue(mockSession);
    mockHashPassword.mockResolvedValue("hashed-password-abc");
    mockWhere.mockResolvedValue(undefined);

    await updateUserPassword("rawPassword");

    expect(mockUpdate).toHaveBeenCalledWith({
      userId: "account.userId",
      providerId: "account.providerId",
    });
    expect(mockSet).toHaveBeenCalledWith({ password: "hashed-password-abc" });
  });

  it("filters by userId and credential providerId using and()", async () => {
    mockGetSession.mockResolvedValue(mockSession);
    mockHashPassword.mockResolvedValue("hashed");
    mockWhere.mockResolvedValue(undefined);

    await updateUserPassword("password");

    expect(mockEq).toHaveBeenCalledWith("account.userId", "user-123");
    expect(mockEq).toHaveBeenCalledWith("account.providerId", "credential");
    expect(mockAnd).toHaveBeenCalledTimes(1);
  });

  it("returns failure when user is not authenticated", async () => {
    mockGetSession.mockResolvedValue(null);

    const result = await updateUserPassword("newPassword123");

    expect(result).toEqual({
      success: false,
      message: "User not authenticated",
    });
    expect(mockUpdate).not.toHaveBeenCalled();
    expect(mockHashPassword).not.toHaveBeenCalled();
  });

  it("returns failure when session is undefined", async () => {
    mockGetSession.mockResolvedValue(undefined);

    const result = await updateUserPassword("newPassword123");

    expect(result).toEqual({
      success: false,
      message: "User not authenticated",
    });
  });

  it("returns failure with error message when db update throws", async () => {
    mockGetSession.mockResolvedValue(mockSession);
    mockHashPassword.mockResolvedValue("hashed");
    mockWhere.mockRejectedValue(new Error("Database connection lost"));

    const result = await updateUserPassword("newPassword123");

    expect(result).toEqual({
      success: false,
      message: "Error: Database connection lost",
    });
  });

  it("returns failure when hashPassword throws", async () => {
    mockGetSession.mockResolvedValue(mockSession);
    mockHashPassword.mockRejectedValue(new Error("Hashing failed"));

    const result = await updateUserPassword("newPassword123");

    expect(result).toEqual({
      success: false,
      message: "Error: Hashing failed",
    });
  });

  it("returns failure when getSession throws", async () => {
    mockGetSession.mockRejectedValue(new Error("Auth service unavailable"));

    const result = await updateUserPassword("newPassword123");

    expect(result).toEqual({
      success: false,
      message: "Error: Auth service unavailable",
    });
  });

  it("handles non-Error thrown values by casting to Error", async () => {
    mockGetSession.mockRejectedValue({ message: "some object error" });

    const result = await updateUserPassword("newPassword123");

    expect(result.success).toBe(false);
    expect(result.message).toBe("Error: some object error");
  });

  it("passes headers to getSession", async () => {
    const fakeHeaders = new Headers({ authorization: "Bearer token" });
    mockHeaders.mockResolvedValue(fakeHeaders);
    mockGetSession.mockResolvedValue(mockSession);
    mockHashPassword.mockResolvedValue("hashed");
    mockWhere.mockResolvedValue(undefined);

    await updateUserPassword("newPassword123");

    expect(mockGetSession).toHaveBeenCalledWith({ headers: fakeHeaders });
  });
});
