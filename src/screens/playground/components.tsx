import { Link } from '@tanstack/react-router';

import { Card } from '@/components/global/card/card';
import { Button } from '@/components/ui/button';

interface PlaygroundLinkCardProps {
  title: string;
  description: string;
  to: string;
}

/** Reexport como `PlaygroundHeader` para preservar o vocabulário do playground. */
export { PageHeader as PlaygroundHeader } from '@/components/global/pageHeader/pageHeader';

export function PlaygroundLinkCard({
  title,
  description,
  to,
}: PlaygroundLinkCardProps) {
  return (
    <Card title={title} description={description}>
      <Button asChild>
        <Link to={to}>Abrir página</Link>
      </Button>
    </Card>
  );
}
