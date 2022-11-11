/**
 * @see https://umijs.org/zh-CN/plugins/plugin-access
 * */
export default function access(initialState: any) {
  const { currentUser, fetchUserInfo, routes, type } = initialState ?? {};
  const userInfo = fetchUserInfo();

  return {
    canAdmin: true,//currentUser && currentUser.access === 'admin',
    notWeiChai: type !== 'wc',
    canMark: false,
  };
}
