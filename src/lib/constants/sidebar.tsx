import { Home } from 'lucide-react';

import { env } from '@/lib/env';

function getDefaultLogo(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();
  return (
    parts[0]!.charAt(0) + parts[parts.length - 1]!.charAt(0)
  ).toUpperCase();
}

const projectName = env.VITE_PROJECT_NAME;

export const sidebarData = {
  header: {
    name: projectName,
    description: env.VITE_PROJECT_ENVIRONMENT ?? 'Template base',
    logo: getDefaultLogo(projectName),
  },
  nav: [
    {
      title: 'Início',
      url: '/',
      icon: <Home />,
    },
  ],
};
