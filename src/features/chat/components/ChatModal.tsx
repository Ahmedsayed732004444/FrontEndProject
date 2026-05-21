import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/shared/components/ui/dialog";
import { ChatWindow } from "./ChatWindow";
import { X } from "lucide-react";
import { Button } from "@/shared/components/ui/button";

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  otherUserId: string;
  otherUserName?: string;
}

export function ChatModal({ isOpen, onClose, otherUserId, otherUserName }: ChatModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl w-[95vw] h-[85vh] sm:h-[650px] p-0 flex flex-col gap-0 overflow-hidden shadow-2xl border-border-subtle bg-surface-0">
        <DialogHeader className="sr-only">
          <DialogTitle>Chat with {otherUserName || "User"}</DialogTitle>
          <DialogDescription>Private conversation window</DialogDescription>
        </DialogHeader>
        
        {/* Close Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="absolute right-3 top-3 h-8 w-8 rounded-full z-10 text-muted-foreground hover:text-foreground hover:bg-surface-2 transition-colors"
        >
          <X className="h-4 w-4" />
        </Button>

        <div className="flex-1 overflow-hidden flex flex-col w-full">
          <ChatWindow otherUserId={otherUserId} otherUserName={otherUserName} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
