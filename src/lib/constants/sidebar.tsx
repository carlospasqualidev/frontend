import { RollerCoaster, Home } from 'lucide-react';

export const sidebarData = {
  header: {
    name: 'Ada Lovelace',
    description: 'Software sob medida.',
    logo: 'AL',
  },
  nav: [
    {
      title: 'Home',
      url: '/',
      icon: <Home />,
    },
    {
      title: 'Playground',
      url: '/playground',
      icon: <RollerCoaster />,
    },
  ],
};
