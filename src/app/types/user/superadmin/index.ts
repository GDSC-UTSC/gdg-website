import { Admin, AdminResponse } from "../admin";

export class SuperAdmin extends Admin {
  /**
   * Grant super admin privileges to a user by email
   */
  static async grantSuperAdmin(email: string, token: string): Promise<AdminResponse> {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_CLOUD_FUNCTIONS_URL}/grantSuperAdmin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email.trim(), token }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to grant super admin privileges');
      }

      return data as AdminResponse;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to grant super admin privileges');
    }
  }

  /**
   * Check if the current user is a super admin
   * This method could be extended to verify against the server if needed
   */
  static async verify(userId: string): Promise<boolean> {
    try {
      // This could be implemented if server-side verification is needed
      // For now, we rely on the client-side UserData.isSuperAdmin check
      return true;
    } catch (error) {
      console.error('Super admin verification error:', error);
      return false;
    }
  }
}