import { Divider } from 'antd';

export default function (props: any) {
  const { children } = props;
  return (
    <Divider>{children}</Divider>
  )
}