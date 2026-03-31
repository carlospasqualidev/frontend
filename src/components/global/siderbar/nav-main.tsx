import { useNavigate } from '@tanstack/react-router';

import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { sidebarData } from '@/lib/constants/sidebar';

export function NavMain() {
  const navigate = useNavigate();
  return (
    <SidebarGroup>
      <SidebarMenu>
        {sidebarData.nav.map((item) => (
          <SidebarMenuItem key={item.url}>
            <SidebarMenuButton
              tooltip={item.title}
              onClick={() => {
                navigate({ to: item.url });
              }}
            >
              {item.icon}
              <span>{item.title}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
