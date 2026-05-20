import PublicHeader from "@/shared/components/navigation/PublicHeader";
import { SidebarTrigger } from "@/shared/components/ui/sidebar";

/**
 * App shell header: same chrome as `PublicHeader`, with sidebar toggle for `AppLayout`.
 */
const AppHeader = () => {
  return (
    <PublicHeader
      leading={
        <SidebarTrigger className="shrink-0 md:-ml-1" aria-label="Toggle sidebar" />
      }
    />
  );
};

export default AppHeader;
