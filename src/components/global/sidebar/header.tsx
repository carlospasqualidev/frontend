'use client';

import { sidebarData } from '@/lib/constants/sidebar';

export function Header() {
  return (
    <div className="flex gap-2 pt-2 pl-2 transition-all group-data-[collapsible=icon]:pt-0 group-data-[collapsible=icon]:pl-0">
      <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
        {sidebarData.header.logo}
      </div>
      <div className="grid flex-1 text-left text-sm leading-tight">
        <span className="truncate font-medium">{sidebarData.header.name}</span>
        <span className="truncate text-xs">
          {sidebarData.header.description}
        </span>
      </div>
    </div>
  );
}
