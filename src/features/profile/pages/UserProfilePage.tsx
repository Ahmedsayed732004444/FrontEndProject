import React from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { useUser } from "@/features/profile/hooks/userHooks";

const UserProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: user, isLoading, error } = useUser(id);
  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-4rem-4.5rem)] bg-muted/30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Skeleton className="h-48 w-full mb-4" />
          <div className="space-y-4">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-48 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-[calc(100vh-4rem-4.5rem)] bg-muted/30 flex items-center justify-center">
        <Card className="max-w-md border-0 shadow-md">
          <CardContent className="pt-6">
            <p className="text-destructive text-center">
              Failed to load user profile. Please try again.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem-4.5rem)] bg-muted/30">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 pt-8">
        <Card className="border-0 shadow-md">
          <CardContent className="pt-6 space-y-4">
            <div>
              <h1 className="text-2xl font-bold">
                {(user.firstName || "") + " " + (user.lastName || "")}
              </h1>
              <p className="text-muted-foreground mt-1">
                {user.email}
              </p>
            </div>

            {user.jobTitle && (
              <p className="text-sm">
                <span className="text-muted-foreground">Job Title: </span>
                <span className="font-medium">{user.jobTitle}</span>
              </p>
            )}

            <div className="flex gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Followers: </span>
                <span className="font-medium">{user.followersCount ?? 0}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Following: </span>
                <span className="font-medium">{user.followingCount ?? 0}</span>
              </div>
            </div>

            {user.summary && (
              <div>
                <h2 className="font-semibold mb-1">Summary</h2>
                <p className="text-muted-foreground whitespace-pre-wrap">
                  {user.summary}
                </p>
              </div>
            )}

            {Array.isArray(user.skills) && user.skills.length > 0 && (
              <div>
                <h2 className="font-semibold mb-1">Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {user.skills.map((skill: any, idx: number) => (
                    <span
                      key={`${idx}-${skill?.name ?? skill}`}
                      className="px-3 py-1 bg-muted rounded-full text-sm"
                    >
                      {typeof skill === "string" ? skill : skill.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <p className="text-sm text-muted-foreground">
              Social links, availability/status, and phone number are disabled.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserProfilePage;

