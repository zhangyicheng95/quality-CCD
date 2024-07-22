import { Popover, Button } from 'antd';
import { FileImageOutlined } from '@ant-design/icons';
import ImageSelector from '@/components/fabritor/components/ImageSelector';

export default function ReplaceSetter(props: any) {
  const { onChange } = props;

  return (
    <Popover
      content={
        <ImageSelector size="middle" type="default" onChange={onChange} />
      }
      placement="top"
      trigger="click"
    >
      <Button type="primary" block icon={<FileImageOutlined />}>替换图片</Button>
    </Popover>
  );
}