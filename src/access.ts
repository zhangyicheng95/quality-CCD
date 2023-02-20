/**
 * @see https://umijs.org/zh-CN/plugins/plugin-access
 * */
export default function access(initialState: any) {
  const { currentUser, fetchUserInfo, routes, type } = initialState ?? {};

  return {
    canAdmin: true,//currentUser && currentUser.access === 'admin',
    canMark: false,
    canHistory: type !== 'vision',
    canControl: type !== 'vision',
  };
}
