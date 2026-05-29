import {
  Avatar as AvatarPrimitive,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { getInitials } from '@/lib/getInitials';

type AvatarSize = 'sm' | 'default' | 'lg';

interface IUserAvatar {
  name: string;
  imageUrl?: string | null;
  size?: AvatarSize;
  className?: string;
  fallbackClassName?: string;
}

export function UserAvatar({
  name,
  imageUrl,
  size = 'default',
  className,
  fallbackClassName,
}: IUserAvatar) {
  return (
    <AvatarPrimitive size={size} className={className}>
      {imageUrl ? <AvatarImage src={imageUrl} alt={name} /> : null}
      <AvatarFallback className={cn(fallbackClassName)}>
        {getInitials(name)}
      </AvatarFallback>
    </AvatarPrimitive>
  );
}
