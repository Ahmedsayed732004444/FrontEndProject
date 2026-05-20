export interface FollowerListItem {
  userId: string;
  fullName: string;
  jobTitle: string | null;
  profilePictureUrl: string | null;
  country: string | null;
  isFollowedByMe: boolean;
}

export interface PaginatedFollowList {
  items: FollowerListItem[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface FollowRequest {
  followingId: string;
}
