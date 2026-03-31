import { sidebarData } from '@/lib/constants/sidebar';

const routeTitlesByPath = new Map(
  [
    ...sidebarData.nav.map((item) => [item.url, item.title] as const),
    ['/playground/form', 'Form Playground'] as const,
    ['/playground/navigation', 'Navigation Tests'] as const,
    ['/playground/navigation/details', 'Details'] as const,
    ['/playground/navigation/details/history', 'History'] as const,
    ['/login', 'Login'] as const,
    ['/signup', 'Criar conta'] as const,
  ]
);

function startCase(segment: string) {
  return segment
    .split('-')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

export function getRouteTitle(pathname: string) {
  return (
    routeTitlesByPath.get(pathname) ??
    (pathname === '/'
      ? 'Home'
      : startCase(pathname.split('/').filter(Boolean).at(-1) ?? ''))
  );
}
