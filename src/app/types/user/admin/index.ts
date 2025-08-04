export interface AdminResponse {
  success: boolean;
  message: string;
  userId?: string;
}

export interface AdminError {
  error: string;
}

export class Admin {
  /**
   * Grant admin privileges to a user by email
   */
  static async grantAdmin(email: string, token: string): Promise<AdminResponse> {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_CLOUD_FUNCTIONS_URL}/grantAdmin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email.trim(), token }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to grant admin privileges');
      }

      return data as AdminResponse;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to grant admin privileges');
    }
  }

  /**
   * Remove admin privileges from a user by email
   */
  static async removeAdmin(email: string, token: string): Promise<AdminResponse> {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_CLOUD_FUNCTIONS_URL}/removeAdmin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email.trim(), token }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to remove admin privileges');
      }

      return data as AdminResponse;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to remove admin privileges');
    }
  }
}