// src/service/user-service.ts
import axiosInstance, { API_URL } from "../configuration/api";

export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  role?: string;
  status?: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  contactNumber?: string;
  profileImage?: string;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
  isTemporaryPassword?: boolean;
  token?: string;
}

export interface PaginatedResponse {
  success: boolean;
  data: User[];
  pagination: {
    total: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    nextPage: number | null;
    prevPage: number | null;
  };
  message: string;
}

export interface CreateStaffRequest {
  name: string;
  email: string;
  contactNumber: string;
  role?: string;
}

export interface CreateStaffResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    temporaryPassword: string;
    instructions: string;
  };
}

export interface UserRegisterForm {
  name: string;
  email: string;
  password: string;
  contactNumber: string;
}

export interface UpdateProfileRequest {
  name: string;
  contactNumber?: string;
}

export interface UpdatePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface ProfileResponse {
  success: boolean;
  data: User;
  message: string;
}

export interface ApiResponse {
  success: boolean;
  message: string;
  data?: User;
  errors?: string[];
}

// Profile Service Functions
export const getUserProfile = async (): Promise<ProfileResponse> => {
  try {
    const response = await axiosInstance.get(`${API_URL}/profile`);
    return response.data;
  } catch (error: any) {
    console.error("Error fetching user profile:", error);
    throw new Error(
      error.response?.data?.message || "Failed to fetch user profile"
    );
  }
};

export const updateUserProfile = async (
  profileData: UpdateProfileRequest
): Promise<ProfileResponse> => {
  try {
    const response = await axiosInstance.patch(
      `${API_URL}/profile`,
      profileData
    );
    return response.data;
  } catch (error: any) {
    console.error("Error updating user profile:", error);

    // Check for specific error types
    if (error.response?.status === 401) {
      throw new Error("Session expired. Please login again.");
    }

    if (error.response?.status === 409) {
      throw new Error("Email already in use.");
    }

    throw new Error(
      error.response?.data?.message || "Failed to update user profile"
    );
  }
};

// Remove email-related functions since users can't change email
export const updateUserPassword = async (
  passwordData: UpdatePasswordRequest
): Promise<ApiResponse> => {
  try {
    const response = await axiosInstance.patch(
      `${API_URL}/profile/password`,
      passwordData
    );
    return response.data;
  } catch (error: any) {
    console.error("Error updating user password:", error);

    if (error.response?.status === 401) {
      throw new Error("Current password is incorrect.");
    }

    throw new Error(
      error.response?.data?.message || "Failed to update password"
    );
  }
};
export const uploadProfileImage = async (
  imageFile: File
): Promise<ProfileResponse> => {
  try {
    const formData = new FormData();
    formData.append("profileImage", imageFile);

    const response = await axiosInstance.patch("/profile/image", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error: any) {
    console.error("Error uploading profile image:", error);
    throw new Error(
      error.response?.data?.message || "Failed to upload profile image"
    );
  }
};

export const removeProfileImage = async (): Promise<ProfileResponse> => {
  try {
    const response = await axiosInstance.delete("/profile/image");
    return response.data;
  } catch (error: any) {
    console.error("Error removing profile image:", error);
    throw new Error(
      error.response?.data?.message || "Failed to remove profile image"
    );
  }
};

// Existing User Management Functions
export const userLogin = async (email: string, password: string) => {
  try {
    const response = await axiosInstance.post("/user/login", {
      email: email,
      password: password,
    });
    return response.data;
  } catch (error) {
    console.error(`Error while login for ${email}:`, error);
    throw error;
  }
};

export const registerUser = async (formData: UserRegisterForm) => {
  try {
    const response = await axiosInstance.post("/user/register", {
      formData,
    });
    return response.data;
  } catch (error) {
    console.error(
      `Error while registering user with emailId: ${formData?.email}:`,
      error
    );
    throw error;
  }
};

export const fetchUsers = async (
  params?: PaginationParams
): Promise<PaginatedResponse> => {
  try {
    const queryParams = new URLSearchParams();

    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.search) queryParams.append("search", params.search);
    if (params?.sortBy) queryParams.append("sortBy", params.sortBy);
    if (params?.sortOrder) queryParams.append("sortOrder", params.sortOrder);
    if (params?.role) queryParams.append("role", params.role);
    if (params?.status) queryParams.append("status", params.status);

    const response = await axiosInstance.get(`/user?${queryParams.toString()}`);
    return response.data;
  } catch (error: any) {
    console.error("Error fetching users:", error);
    throw new Error(error.response?.data?.message || "Failed to fetch users");
  }
};

export const updateUserStatus = async (userId: string, status: string) => {
  try {
    const response = await axiosInstance.patch(`/user/${userId}/status`, {
      status,
    });
    return response.data;
  } catch (error: any) {
    console.error("Error updating user status:", error);
    throw new Error(
      error.response?.data?.message || "Failed to update user status"
    );
  }
};

export const updateUserRole = async (userId: string, role: string) => {
  try {
    const response = await axiosInstance.patch(`/user/${userId}/role`, {
      role,
    });
    return response.data;
  } catch (error: any) {
    console.error("Error updating user role:", error);
    throw new Error(
      error.response?.data?.message || "Failed to update user role"
    );
  }
};

export const deleteUser = async (userId: string) => {
  try {
    const response = await axiosInstance.delete(`/user/${userId}`);
    return response.data;
  } catch (error: any) {
    console.error("Error deleting user:", error);
    throw new Error(error.response?.data?.message || "Failed to delete user");
  }
};

export const bulkUpdateUsers = async (
  userIds: string[],
  updates: { status?: string; role?: string }
) => {
  try {
    const response = await axiosInstance.patch("/user/bulk/update", {
      userIds,
      ...updates,
    });
    return response.data;
  } catch (error: any) {
    console.error("Error in bulk update:", error);
    throw new Error(error.response?.data?.message || "Failed to update users");
  }
};

export const createStaffAccount = async (
  staffData: CreateStaffRequest
): Promise<CreateStaffResponse> => {
  try {
    const response = await axiosInstance.post("/user/staff", staffData);
    return response.data;
  } catch (error: any) {
    console.error("Error creating staff account:", error);
    throw new Error(
      error.response?.data?.message || "Failed to create staff account"
    );
  }
};

export const getUserById = async (userId: string) => {
  try {
    const response = await axiosInstance.get(`/user/${userId}`);
    return response.data;
  } catch (error: any) {
    console.error("Error fetching user:", error);
    throw new Error(error.response?.data?.message || "Failed to fetch user");
  }
};
