import * as React from 'react';
import { Loader2 } from 'lucide-react';

import { Button as ButtonPrimitive } from '@/components/ui/button';

interface IButton extends React.ComponentProps<typeof ButtonPrimitive> {
  loading?: boolean;
}

export function Button({ loading, disabled, children, ...props }: IButton) {
  return (
    <ButtonPrimitive disabled={loading || disabled} {...props}>
      {loading ? <Loader2 className="animate-spin" /> : null}
      {children}
    </ButtonPrimitive>
  );
}
