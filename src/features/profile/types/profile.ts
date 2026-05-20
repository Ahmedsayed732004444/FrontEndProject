export const UserGender = {
  Male: 0,
  Female: 1,
} as const;

export type UserGender = (typeof UserGender)[keyof typeof UserGender];

export interface UserProfileResponse {
  fullName: string;
  firstName: string;
  lastName: string;
  email: string;
  gender: UserGender | null;
  jobTitle: string | null;
  country: string | null;
  city: string | null;
  university: string | null;
  currentCompany: string | null;
  degree: string | null;
  yearsOfExperience: number | null;
  summary: string | null;
  graduationYear: number | null;
  cvFileUrl: string | null;
  profilePictureUrl: string | null;
  coverPictureUrl: string | null;
  skills: string[];
  followersCount: number;
  followingCount: number;
  isFollowedByMe: boolean;
}

export interface BasicInfoRequest {
  firstName: string;
  lastName: string;
  gender?: UserGender | null;
  country?: string | null;
  city?: string | null;
  jobTitle?: string | null;
  yearsOfExperience?: number | null;
  currentCompany?: string | null;
  summary?: string | null;
  university?: string | null;
  degree?: string | null;
  graduationYear?: number | null;
  skills?: string[];
}
