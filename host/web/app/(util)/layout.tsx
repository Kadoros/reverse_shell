import ToggleSidebar from "@/components/component/toggleSidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function UtilLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ToggleSidebar>{children}</ToggleSidebar>
      </body>
    </html>
  );
}
