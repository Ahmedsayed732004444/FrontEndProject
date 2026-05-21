import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, Briefcase, ShieldAlert, FileText, CheckCircle2, Trash2, MailOpen } from "lucide-react";
import { useNotifications } from "../context/NotificationsContext";
import type { Notification } from "../types/notifications";
import { NotificationType } from "../types/notifications";
import { cn, formatRelativeTime } from "@/lib/utils";

interface NotificationItemProps {
  notification: Notification;
}

export function NotificationItem({ notification }: NotificationItemProps) {
  const navigate = useNavigate();
  const { markAsRead, deleteNotification } = useNotifications();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleMarkAsRead = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!notification.isRead) {
      await markAsRead(notification.id);
    }
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDeleting(true);
    await deleteNotification(notification.id);
    // Note: No need to set isDeleting(false) since the component will unmount
  };

  // Select appropriate icon based on notification type
  const getIcon = () => {
    switch (notification.type) {
      case NotificationType.NewMessage:
        return <MailOpen className="h-5 w-5 text-blue-500" />;
      case NotificationType.JobApplicationStatusChanged:
        return <Briefcase className="h-5 w-5 text-green-500" />;
      case NotificationType.SecurityAlert:
        return <ShieldAlert className="h-5 w-5 text-red-500" />;
      case NotificationType.NewJobPosted:
        return <FileText className="h-5 w-5 text-purple-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  const getInitials = (name?: string) => {
    if (!name) return null;
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const handleNotificationClick = async () => {
    if (!notification.isRead) {
      await markAsRead(notification.id);
    }
    
    // Determine where to navigate based on entityType
    switch (notification.entityType) {
      case "JobApplication":
        navigate("/job-tracker");
        break;
      case "Job":
        navigate(`/jobs/${notification.entityId}`);
        break;
      case "Post":
        navigate("/posts");
        break;
      case "User":
      case "Follow":
        navigate(`/profile/${notification.actorId}`);
        break;
      default:
        // Default to actor's profile if applicable
        if (notification.actorId) {
          navigate(`/profile/${notification.actorId}`);
        }
        break;
    }
  };

  const handleActorClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // prevent clicking the container
    if (notification.actorId) {
      navigate(`/profile/${notification.actorId}`);
    }
  };

  return (
    <div
      onClick={handleNotificationClick}
      className={cn(
        "group relative flex gap-4 p-4 rounded-xl border transition-all duration-200 cursor-pointer hover:shadow-sm",
        notification.isRead
          ? "bg-surface-0 border-border-subtle hover:border-border-muted"
          : "bg-primary/5 border-primary/20 hover:border-primary/30",
        isDeleting ? "opacity-50 pointer-events-none" : ""
      )}
    >
      {/* Unread dot indicator */}
      {!notification.isRead && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-primary rounded-r-full" />
      )}

      {/* Avatar / Icon */}
      <div 
        className="shrink-0 pt-1" 
        onClick={handleActorClick}
        title={notification.actorName ? `Go to ${notification.actorName}'s profile` : ""}
      >
        {notification.actorPhotoUrl ? (
          <img
            src={notification.actorPhotoUrl}
            alt={notification.actorName}
            className="h-10 w-10 rounded-full object-cover border border-border-subtle hover:ring-2 ring-primary/20 transition-all"
          />
        ) : notification.actorName ? (
          <div className="h-10 w-10 rounded-full bg-primary/10 text-primary font-semibold flex items-center justify-center border border-primary/20 hover:ring-2 ring-primary/30 transition-all">
            {getInitials(notification.actorName)}
          </div>
        ) : (
          <div className="h-10 w-10 rounded-full bg-surface-1 flex items-center justify-center">
            {getIcon()}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start gap-2">
          <h4
            className={cn(
              "text-sm font-semibold truncate",
              notification.isRead ? "text-foreground/80" : "text-foreground"
            )}
          >
            {notification.title}
          </h4>
          <span className="text-xs text-muted-foreground whitespace-nowrap shrink-0">
            {formatRelativeTime(notification.createdAt)}
          </span>
        </div>
        
        <p
          className={cn(
            "text-sm mt-1 line-clamp-2",
            notification.isRead ? "text-muted-foreground" : "text-foreground/90 font-medium"
          )}
        >
          {notification.message}
        </p>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-2 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
        {!notification.isRead && (
          <button
            onClick={handleMarkAsRead}
            className="p-1.5 rounded-md text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
            title="Mark as read"
          >
            <CheckCircle2 className="h-4 w-4" />
          </button>
        )}
        <button
          onClick={handleDelete}
          className="p-1.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
          title="Delete notification"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
