import React from "react";
import { useNavigate } from "react-router-dom";
import { useGetMyFollowers } from "../hooks/useFollow";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { Card, CardContent } from "@/shared/components/ui/card";
import { User, MapPin, Briefcase, ArrowLeft } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { useFollow, useUnfollow } from "../hooks/useFollow";

const MyFollowersPage: React.FC = () => {
  const navigate = useNavigate();
  const [page, setPage] = React.useState(1);
  const pageSize = 10;

  const { data: followersData, isLoading, error } = useGetMyFollowers(
    page,
    pageSize
  );

  const followMutation = useFollow();
  const unfollowMutation = useUnfollow();

  const handleFollow = (id: string) => {
    followMutation.mutate(id);
  };

  const handleUnfollow = (id: string) => {
    unfollowMutation.mutate(id);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-muted/30 p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <Skeleton className="h-12 w-48 mb-6" />
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !followersData) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center p-4">
        <Card className="max-w-md border-0 shadow-md">
          <CardContent className="pt-6">
            <p className="text-destructive text-center">
              Failed to load followers. Please try again.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 p-2 sm:p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 sm:gap-4 mb-6 px-2 sm:px-0">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="rounded-full h-8 w-8 sm:h-10 sm:w-10"
          >
            <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
          <h1 className="text-xl sm:text-2xl font-bold">My Followers</h1>
          <span className="text-muted-foreground text-sm sm:text-base">
            ({followersData.totalCount})
          </span>
        </div>

        {/* Followers List */}
        {followersData.items.length > 0 ? (
          <div className="space-y-3 sm:space-y-4">
            {followersData.items.map((follower) => (
              <Card key={follower.userId} className="border-0 shadow-sm">
                <CardContent className="p-3 sm:p-4">
                  <div className="flex items-center gap-2 sm:gap-4">
                    {/* Clickable Area for Profile Navigation */}
                    <div 
                      className="flex items-center gap-2 sm:gap-4 flex-1 cursor-pointer hover:opacity-80 transition-opacity min-w-0"
                      onClick={() => navigate(`/profile/${follower.userId}`)}
                    >
                      {/* Avatar */}
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        {follower.profilePictureUrl ? (
                          <img
                            src={follower.profilePictureUrl}
                            alt={follower.fullName}
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          <User className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm sm:text-base truncate">
                          {follower.fullName}
                        </h3>
                        {follower.jobTitle && (
                          <div className="flex items-center gap-1 text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1">
                            <Briefcase className="h-3 w-3 shrink-0" />
                            <span className="truncate">{follower.jobTitle}</span>
                          </div>
                        )}
                        {follower.country && (
                          <div className="flex items-center gap-1 text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1">
                            <MapPin className="h-3 w-3 shrink-0" />
                            <span className="truncate">{follower.country}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Follow Button */}
                    {follower.isFollowedByMe ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleUnfollow(follower.userId)}
                        disabled={unfollowMutation.isPending}
                        className="rounded-full text-xs sm:text-sm px-3 sm:px-4 shrink-0"
                      >
                        Unfollow
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        onClick={() => handleFollow(follower.userId)}
                        disabled={followMutation.isPending}
                        className="rounded-full text-xs sm:text-sm px-3 sm:px-4 shrink-0"
                      >
                        Follow
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Pagination */}
            {followersData.totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-6">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={!followersData.hasPreviousPage}
                >
                  Previous
                </Button>
                <span className="text-sm text-muted-foreground">
                  Page {followersData.pageNumber} of {followersData.totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => p + 1)}
                  disabled={!followersData.hasNextPage}
                >
                  Next
                </Button>
              </div>
            )}
          </div>
        ) : (
          <Card className="border-0 shadow-sm">
            <CardContent className="p-8 text-center">
              <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No followers yet</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default MyFollowersPage;
