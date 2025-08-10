export interface AdminResponse {
  success: boolean;
  message: string;
  userId?: string;
}

export interface AdminError {
  error: string;
}

export class Admin {

  static async grantAdminByEmail(emailOrUserId: string, token: string, isUserId = false): Promise<AdminResponse> {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_CLOUD_FUNCTIONS_URL}/grantAdminByEmail`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ 
          [isUserId ? 'userId' : 'email']: emailOrUserId.trim(),
        }),
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


  static async removeAdminByEmail(emailOrUserId: string, token: string, isUserId = false): Promise<AdminResponse> {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_CLOUD_FUNCTIONS_URL}/removeAdminByEmail`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ 
          [isUserId ? 'userId' : 'email']: emailOrUserId.trim(),
        }),
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
