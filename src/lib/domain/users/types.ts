/**
 * Role-Based Access Control (RBAC) types.
 * 
 * Note: These roles will eventually be managed via Clerk's publicMetadata
 * to determine user permissions across the application.
 */
export type UserRole = "customer" | "reseller" | "admin";
