import { forwardRef } from "react";
import { cn } from "../../lib/cn";

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export function Drawer({ open, onClose, children }: DrawerProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col">
      <DrawerOverlay onClick={onClose} />
      <div className="fixed inset-x-0 bottom-0 z-50 mt-auto">
        <DrawerContent>{children}</DrawerContent>
      </div>
    </div>
  );
}

interface DrawerContentProps extends React.HTMLAttributes<HTMLDivElement> {}

const DrawerContent = forwardRef<HTMLDivElement, DrawerContentProps>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("fixed bottom-0 left-0 right-0 mt-auto max-h-[95vh] rounded-t-[10px] bg-background", className)}
    {...props}
  />
));
DrawerContent.displayName = "DrawerContent";

interface DrawerOverlayProps extends React.HTMLAttributes<HTMLDivElement> {}

const DrawerOverlay = forwardRef<HTMLDivElement, DrawerOverlayProps>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("fixed inset-0 z-50 bg-black/40 backdrop-blur-sm", className)} {...props} />
));
DrawerOverlay.displayName = "DrawerOverlay";

interface DrawerTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {}

const DrawerTitle = forwardRef<HTMLHeadingElement, DrawerTitleProps>(({ className, ...props }, ref) => (
  <h2 ref={ref} className={cn("text-lg font-semibold leading-none tracking-tight", className)} {...props} />
));
DrawerTitle.displayName = "DrawerTitle";

export { DrawerContent, DrawerOverlay, DrawerTitle };
