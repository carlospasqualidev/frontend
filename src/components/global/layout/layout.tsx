import { AppSidebar } from '@/components/global/sidebar/app-sidebar';
import { Breadcrumb } from '@/components/global/layout/breadcrumb';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="h-svh overflow-hidden">
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex h-[50%] items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1 cursor-pointer" />
            <Separator orientation="vertical" className="mr-2 self-stretch" />
            <Breadcrumb />
          </div>
        </header>
        <ScrollArea className="min-h-0 flex-1">
          <div className="flex min-h-full flex-col gap-4 p-4 pt-0">
            <div className="flex-1 rounded-xl bg-muted/50 p-4">{children}</div>
          </div>
        </ScrollArea>
      </SidebarInset>
    </SidebarProvider>
  );
}
