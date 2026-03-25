import type { IUser } from '@/types/user/userTypes';

export async function validateSession() {
  //   const { data } = await api.get('/validate-token', {
  //     withCredentials: true,
  //   });

  const user: IUser = {
    id: 'f421s',
    name: 'jorge',
    email: 'jorge@gmail.com',
    image: '',
    role: 'guribom',
  };

  //   return data.user;
  return user;
}
