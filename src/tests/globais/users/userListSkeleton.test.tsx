import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import UsersListSkeleton from '@/screens/users/userListSkeleton';

describe('UsersListSkeleton', () => {
  it('renders the expected number of skeleton rows', () => {
    const { container } = render(<UsersListSkeleton />);
    const rows = container.querySelectorAll('.bg-card');
    expect(rows.length).toBe(5);
  });
});
