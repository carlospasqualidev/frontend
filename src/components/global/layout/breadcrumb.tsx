import { Link, useMatches } from '@tanstack/react-router';

import {
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
  Breadcrumb as BaseBreadCrumb,
} from '@/components/ui/breadcrumb';

function normalizeRoutePath(pathname: string) {
  if (!pathname || pathname === '/') {
    return '/';
  }

  return pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;
}

export function Breadcrumb() {
  const matches = useMatches();

  const items = matches.reduce<
    Array<{ routeId: string; pathname: string; title: string }>
  >((acc, match) => {
    const routeId = String(match.routeId);
    const pathname = normalizeRoutePath(match.pathname);
    const title =
      typeof match.staticData?.breadcrumb === 'string'
        ? match.staticData.breadcrumb
        : undefined;

    if (routeId === '__root__' || routeId === 'protected-layout') {
      return acc;
    }

    if (!title) {
      return acc;
    }

    const lastItem = acc.at(-1);
    if (lastItem?.pathname === pathname) {
      acc[acc.length - 1] = { routeId, pathname, title };
      return acc;
    }

    acc.push({ routeId, pathname, title });
    return acc;
  }, []);

  const visibleItems =
    items.length > 1 && items[0]?.pathname === '/' ? items.slice(1) : items;

  if (!visibleItems.length) {
    return null;
  }

  return (
    <BaseBreadCrumb>
      <BreadcrumbList>
        {visibleItems.map((item, index) => {
          const isLast = index === visibleItems.length - 1;

          return (
            <BreadcrumbItem key={`${item.routeId}:${item.pathname}`}>
              {isLast ? (
                <BreadcrumbPage>{item.title}</BreadcrumbPage>
              ) : (
                <>
                  <BreadcrumbLink asChild>
                    <Link to={item.pathname}>{item.title}</Link>
                  </BreadcrumbLink>
                  <BreadcrumbSeparator />
                </>
              )}
            </BreadcrumbItem>
          );
        })}
      </BreadcrumbList>
    </BaseBreadCrumb>
  );
}
