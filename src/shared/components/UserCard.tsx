import { useNavigate } from "react-router-dom";
import { MapPin, Briefcase, GraduationCap } from "lucide-react";

interface UserCardProps {
  user: Record<string, any>;
}

export const UserCard = ({ user }: UserCardProps) => {
  const navigate = useNavigate();

  const name = user.fullName || `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() || "Unknown User";
  const initials = name.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase();
  const skills: string[] = Array.isArray(user.skills)
    ? user.skills.map((s: any) => (typeof s === "string" ? s : s?.name ?? "")).filter(Boolean)
    : [];

  const handleClick = () => {
    if (user.id) navigate(`/profile/${user.id}`);
  };

  return (
    <div
      onClick={handleClick}
      className="card-interactive p-5 cursor-pointer flex flex-col gap-3"
    >
      {/* Avatar + name */}
      <div className="flex items-center gap-3">
        {user.profilePictureUrl ? (
          <img
            src={user.profilePictureUrl}
            alt={name}
            className="w-12 h-12 rounded-full object-cover border-2 border-subtle"
          />
        ) : (
          <div className="w-12 h-12 rounded-full avatar-fallback shrink-0">
            <span className="text-sm font-bold">{initials}</span>
          </div>
        )}
        <div className="min-w-0">
          <p className="font-semibold text-primary text-sm leading-tight truncate">{name}</p>
          {user.jobTitle && (
            <p className="text-xs text-secondary truncate flex items-center gap-1 mt-0.5">
              <Briefcase className="w-3 h-3 shrink-0" />
              {user.jobTitle}
            </p>
          )}
        </div>
      </div>

      {/* Location / Education */}
      <div className="space-y-1">
        {(user.city || user.country) && (
          <p className="text-xs text-muted flex items-center gap-1">
            <MapPin className="w-3 h-3 shrink-0" />
            {[user.city, user.country].filter(Boolean).join(", ")}
          </p>
        )}
        {user.university && (
          <p className="text-xs text-muted flex items-center gap-1">
            <GraduationCap className="w-3 h-3 shrink-0" />
            {user.university}
          </p>
        )}
      </div>

      {/* Skills */}
      {skills.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {skills.slice(0, 4).map((skill) => (
            <span key={skill} className="badge badge-info text-[10px]">
              {skill}
            </span>
          ))}
          {skills.length > 4 && (
            <span className="text-[10px] text-muted">+{skills.length - 4} more</span>
          )}
        </div>
      )}
    </div>
  );
};
