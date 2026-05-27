import { RollerCoaster, Home } from 'lucide-react';

export const sidebarData = {
  header: {
    name: 'Meu Projeto',
    description: 'Template base',
    logo: 'MP',
  },
  nav: [
    {
      title: 'Início',
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
