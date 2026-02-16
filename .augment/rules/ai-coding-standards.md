---
type: "always_apply"
---

# AI Coding Standards

## Description

Comprehensive coding standards, rules and guidelines for AI-generated code.

---

## General Principles

- Never hardcode secrets, API keys, or sensitive data. Always use environment variables.
- Write clean, maintainable, and self-documenting code.
- Prioritize readability over cleverness.
- Follow the principle of least surprise.
- Keep functions small and focused on a single responsibility.

---

## TypeScript & ES6+ Standards

### 1. Variable Naming Conventions

#### **Use Descriptive, Meaningful Names**

```typescript
// ❌ Bad
const d = new Date();
const arr = [];
const temp = getUserData();

// ✅ Good
const currentDate = new Date();
const activeUsers = [];
const userProfile = getUserData();
```

#### **Naming Patterns by Type**

**Variables and Functions: camelCase**

```typescript
// Variables
const userName = "John";
const isAuthenticated = true;
const maxRetryCount = 3;

// Functions
function calculateTotal(items: Item[]): number {}
function fetchUserData(userId: string): Promise<User> {}
```

**Classes and Interfaces: PascalCase**

```typescript
// Classes
class UserService {}
class PaymentProcessor {}

// Interfaces
interface UserProfile {}
interface ApiResponse<T> {}

// Type Aliases
type RequestStatus = "pending" | "success" | "error";
```

**Constants: UPPER_SNAKE_CASE**

```typescript
const API_BASE_URL = process.env.API_URL;
const MAX_UPLOAD_SIZE = 5 * 1024 * 1024; // 5MB
const DEFAULT_TIMEOUT_MS = 30000;
```

**Private Class Members: Prefix with underscore (optional)**

```typescript
class UserService {
	private _cache: Map<string, User>;
	private _apiKey: string;

	public async getUser(id: string): Promise<User> {
		// Implementation
	}
}
```

**Boolean Variables: Use is/has/should prefix**

```typescript
const isLoading = false;
const hasPermission = true;
const shouldRetry = false;
const canEdit = user.role === "admin";
```

**Arrays: Use plural nouns**

```typescript
const users = ["Alice", "Bob"];
const activeConnections = [];
const errorMessages = [];
```

**Functions returning booleans: Use is/has/can/should prefix**

```typescript
function isValidEmail(email: string): boolean {}
function hasAccess(user: User, resource: Resource): boolean {}
function canDelete(item: Item): boolean {}
```

---

### 2. Async/Await Standards

#### **Always Use async/await Over Promises**

```typescript
// ❌ Bad - Using .then() chains
function getUser(id: string) {
	return fetch(`/api/users/${id}`)
		.then((response) => response.json())
		.then((data) => data.user)
		.catch((error) => console.error(error));
}

// ✅ Good - Using async/await
async function getUser(id: string): Promise<User> {
	try {
		const response = await fetch(`/api/users/${id}`);
		const data = await response.json();
		return data.user;
	} catch (error) {
		console.error("Failed to fetch user:", error);
		throw error;
	}
}
```

#### **Always Handle Errors with try/catch**

```typescript
// ❌ Bad - No error handling
async function deleteUser(id: string): Promise<void> {
	await fetch(`/api/users/${id}`, { method: "DELETE" });
}

// ✅ Good - Proper error handling
async function deleteUser(id: string): Promise<void> {
	try {
		const response = await fetch(`/api/users/${id}`, { method: "DELETE" });

		if (!response.ok) {
			throw new Error(`Failed to delete user: ${response.statusText}`);
		}
	} catch (error) {
		console.error(`Error deleting user ${id}:`, error);
		throw error; // Re-throw to allow caller to handle
	}
}
```

#### **Use Promise.all for Parallel Operations**

```typescript
// ❌ Bad - Sequential awaits (slower)
async function getUserData(userId: string): Promise<UserData> {
	const profile = await fetchProfile(userId);
	const posts = await fetchPosts(userId);
	const comments = await fetchComments(userId);

	return { profile, posts, comments };
}

// ✅ Good - Parallel execution (faster)
async function getUserData(userId: string): Promise<UserData> {
	try {
		const [profile, posts, comments] = await Promise.all([
			fetchProfile(userId),
			fetchPosts(userId),
			fetchComments(userId),
		]);

		return { profile, posts, comments };
	} catch (error) {
		console.error("Failed to fetch user data:", error);
		throw error;
	}
}
```

#### **Use Promise.allSettled for Independent Operations**

```typescript
// When you want all operations to complete regardless of failures
async function syncUserData(userId: string): Promise<SyncResult> {
	const results = await Promise.allSettled([
		syncProfile(userId),
		syncPreferences(userId),
		syncActivity(userId),
	]);

	// Process results - some may have succeeded, others failed
	const succeeded = results.filter((r) => r.status === "fulfilled");
	const failed = results.filter((r) => r.status === "rejected");

	return {
		successCount: succeeded.length,
		failureCount: failed.length,
		errors: failed.map((f) => f.reason),
	};
}
```

---

### 3. Comment Standards

#### **Use JSDoc for Functions, Classes, and Interfaces**

````typescript
/**
 * Fetches user profile data from the API.
 *
 * @param userId - The unique identifier of the user
 * @param includePrivate - Whether to include private profile fields
 * @returns Promise resolving to the user profile
 * @throws {NotFoundError} When user doesn't exist
 * @throws {UnauthorizedError} When lacking permission to view private fields
 *
 * @example
 * ```typescript
 * const profile = await fetchUserProfile('user-123', false);
 * console.log(profile.name);
 * ```
 */
async function fetchUserProfile(
	userId: string,
	includePrivate: boolean = false,
): Promise<UserProfile> {
	// Implementation
}
````

#### **Explain WHY, Not WHAT**

```typescript
// ❌ Bad - Commenting the obvious
// Loop through users
for (const user of users) {
	// Set active to true
	user.active = true;
}

// ✅ Good - Explaining the reasoning
// Mark all users as active to comply with GDPR retention policy
// Inactive users are handled by the monthly cleanup job
for (const user of users) {
	user.active = true;
}
```

#### **Use TODO, FIXME, and NOTE Comments**

```typescript
// TODO: Add pagination support when user count exceeds 1000
async function getAllUsers(): Promise<User[]> {
	// Implementation
}

// FIXME: This causes memory leak with large datasets
// See issue #123 for details
function processLargeFile(file: File): void {
	// Implementation
}

// NOTE: This function is called by external webhook
// Do not change signature without updating webhook configuration
async function handleWebhook(payload: WebhookPayload): Promise<void> {
	// Implementation
}
```

#### **Comment Complex Logic**

```typescript
async function calculateDiscount(user: User, cart: Cart): Promise<number> {
	// Apply tiered discount based on user loyalty level
	// Bronze: 5%, Silver: 10%, Gold: 15%, Platinum: 20%
	const loyaltyDiscount = LOYALTY_DISCOUNTS[user.loyaltyTier];

	// Additional 5% discount for orders over $100
	// This stacks with loyalty discount (business requirement from Q4 2024)
	const volumeDiscount = cart.total > 100 ? 0.05 : 0;

	// Discounts are multiplicative, not additive
	// Example: 10% loyalty + 5% volume = 1 - (0.9 * 0.95) = 14.5% total
	const totalDiscount = 1 - (1 - loyaltyDiscount) * (1 - volumeDiscount);

	return cart.total * totalDiscount;
}
```

#### **Document Complex Types**

```typescript
/**
 * Represents the state of an async operation.
 *
 * - idle: Operation hasn't started
 * - loading: Operation in progress
 * - success: Operation completed successfully
 * - error: Operation failed
 */
type AsyncState = "idle" | "loading" | "success" | "error";

/**
 * Configuration for API retry behavior.
 */
interface RetryConfig {
	/** Maximum number of retry attempts */
	maxRetries: number;

	/** Delay in milliseconds between retries */
	retryDelay: number;

	/** Whether to use exponential backoff (doubles delay each retry) */
	useExponentialBackoff: boolean;
}
```

---

### 4. ES6+ Best Practices

#### **Use const by Default, let When Needed**

```typescript
// ❌ Bad
var userName = "John";
let apiUrl = "https://api.example.com"; // Never reassigned

// ✅ Good
const userName = "John";
const apiUrl = "https://api.example.com";
let retryCount = 0; // Will be reassigned
```

#### **Use Destructuring**

```typescript
// ❌ Bad
function displayUser(user) {
	console.log(user.name);
	console.log(user.email);
	console.log(user.role);
}

// ✅ Good
function displayUser({ name, email, role }: User): void {
	console.log(name);
	console.log(email);
	console.log(role);
}

// Array destructuring
const [firstName, lastName] = fullName.split(" ");
const [first, ...rest] = items;
```

#### **Use Arrow Functions Appropriately**

```typescript
// ✅ Good - For callbacks and short functions
const doubled = numbers.map((n) => n * 2);
const filtered = users.filter((user) => user.active);

// ✅ Good - For methods that don't need 'this' binding
const utils = {
	add: (a: number, b: number) => a + b,
	multiply: (a: number, b: number) => a * b,
};

// ❌ Bad - Don't use arrow functions for class methods
class UserService {
	getUser = async (id: string) => {}; // Avoid this
}

// ✅ Good - Use regular methods in classes
class UserService {
	async getUser(id: string): Promise<User> {}
}
```

#### **Use Template Literals**

```typescript
// ❌ Bad
const message = "Hello, " + userName + "! You have " + count + " messages.";

// ✅ Good
const message = `Hello, ${userName}! You have ${count} messages.`;

// ✅ Good - Multi-line strings
const html = `
  <div class="user-card">
    <h2>${user.name}</h2>
    <p>${user.email}</p>
  </div>
`;
```

#### **Use Spread Operator**

```typescript
// ✅ Good - Array spreading
const allItems = [...activeItems, ...inactiveItems];
const copy = [...originalArray];

// ✅ Good - Object spreading
const updatedUser = { ...user, lastLogin: new Date() };
const merged = { ...defaults, ...userConfig };
```

#### **Use Optional Chaining and Nullish Coalescing**

```typescript
// ✅ Good - Optional chaining
const userName = user?.profile?.name;
const firstPost = user?.posts?.[0];
const result = api.getData?.();

// ✅ Good - Nullish coalescing
const displayName = user.name ?? "Anonymous";
const timeout = config.timeout ?? DEFAULT_TIMEOUT;

// ❌ Bad - Old way
const userName = user && user.profile && user.profile.name;
const displayName = user.name || "Anonymous"; // Wrong if name is ''
```

---

### 5. Type Safety

#### **Always Define Return Types**

```typescript
// ❌ Bad
async function getUser(id: string) {
	return await db.users.findById(id);
}

// ✅ Good
async function getUser(id: string): Promise<User | null> {
	return await db.users.findById(id);
}
```

#### **Use Strict TypeScript Configuration**

```json
{
	"compilerOptions": {
		"strict": true,
		"noImplicitAny": true,
		"strictNullChecks": true,
		"strictFunctionTypes": true,
		"noUnusedLocals": true,
		"noUnusedParameters": true,
		"noImplicitReturns": true
	}
}
```

#### **Avoid 'any' Type**

```typescript
// ❌ Bad
function processData(data: any): any {
	return data.value;
}

// ✅ Good - Use generics
function processData<T>(data: T): T {
	return data;
}

// ✅ Good - Use unknown for truly unknown types
function processData(data: unknown): string {
	if (typeof data === "object" && data !== null && "value" in data) {
		return String(data.value);
	}
	throw new Error("Invalid data format");
}
```

---

### 6. Error Handling

#### **Create Custom Error Classes**

```typescript
/**
 * Thrown when a requested resource is not found.
 */
class NotFoundError extends Error {
	constructor(resource: string, id: string) {
		super(`${resource} with id ${id} not found`);
		this.name = "NotFoundError";
	}
}

/**
 * Thrown when API rate limit is exceeded.
 */
class RateLimitError extends Error {
	constructor(public retryAfter: number) {
		super(`Rate limit exceeded. Retry after ${retryAfter}ms`);
		this.name = "RateLimitError";
	}
}

// Usage
async function getUser(id: string): Promise<User> {
	const user = await db.users.findById(id);

	if (!user) {
		throw new NotFoundError("User", id);
	}

	return user;
}
```

#### **Validate Input Early**

```typescript
async function createUser(data: CreateUserInput): Promise<User> {
	// Validate input at the start
	if (!data.email || !isValidEmail(data.email)) {
		throw new ValidationError("Invalid email address");
	}

	if (!data.password || data.password.length < 8) {
		throw new ValidationError("Password must be at least 8 characters");
	}

	// Proceed with creation
	try {
		const user = await db.users.create(data);
		return user;
	} catch (error) {
		console.error("Failed to create user:", error);
		throw error;
	}
}
```

---

### 7. Code Organization

#### **One Export Per File for Classes**

```typescript
// user-service.ts
export class UserService {
	// Implementation
}

// ❌ Avoid multiple class exports in one file
```

#### **Group Related Functions**

```typescript
// user-utils.ts

/**
 * Validates if an email address is properly formatted.
 */
export function isValidEmail(email: string): boolean {
	// Implementation
}

/**
 * Formats a user's full name.
 */
export function formatUserName(user: User): string {
	// Implementation
}

/**
 * Checks if a user has a specific permission.
 */
export function hasPermission(user: User, permission: string): boolean {
	// Implementation
}
```

#### **Use Barrel Exports**

```typescript
// models/index.ts
export { User } from "./user";
export { Post } from "./post";
export { Comment } from "./comment";

// Usage
import { User, Post, Comment } from "./models";
```

---

## Summary Checklist

- [ ] Variables use camelCase, classes use PascalCase, constants use UPPER_SNAKE_CASE
- [ ] Boolean variables/functions use is/has/can/should prefix
- [ ] All async functions use async/await (not .then())
- [ ] All async functions have try/catch error handling
- [ ] Functions have JSDoc comments with @param, @returns, @throws
- [ ] Complex logic has explanatory comments (WHY, not WHAT)
- [ ] Using const by default, let only when reassignment needed
- [ ] All functions have explicit return types
- [ ] No hardcoded secrets or sensitive data
- [ ] Using ES6+ features: destructuring, spread, template literals, optional chaining
- [ ] Custom error classes for different error types
- [ ] Input validation happens early in functions
