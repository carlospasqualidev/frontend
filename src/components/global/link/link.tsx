import * as React from 'react';
import { useNavigate } from '@tanstack/react-router';

import { cn } from '@/lib/utils';

type LinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  replace?: boolean;
};

const defaultStyles =
  'text-primary underline underline-offset-4 transition-colors hover:text-primary/80';

function isExternalLink(href: string) {
  if (href.startsWith('mailto:') || href.startsWith('tel:')) {
    return true;
  }

  if (typeof window === 'undefined') {
    return false;
  }

  try {
    const url = new URL(href, window.location.href);
    return url.origin !== window.location.origin;
  } catch {
    return false;
  }
}

export function Link({
  href,
  target,
  rel,
  className,
  replace,
  onClick,
  download,
  ...props
}: LinkProps) {
  const navigate = useNavigate();
  const external =
    isExternalLink(href) || target === '_blank' || href.startsWith('#');
  const resolvedRel =
    target === '_blank' ? (rel ?? 'noreferrer noopener') : rel;

  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);

    if (
      event.defaultPrevented ||
      external ||
      download ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }

    event.preventDefault();
    navigate({ to: href, replace: Boolean(replace) });
  };

  return (
    <a
      href={href}
      target={target}
      rel={resolvedRel}
      className={cn(defaultStyles, className)}
      onClick={handleClick}
      download={download}
      {...props}
    />
  );
}
