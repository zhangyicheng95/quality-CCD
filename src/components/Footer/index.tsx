import { useIntl } from 'umi';
import { GithubOutlined } from '@ant-design/icons';
import { DefaultFooter } from '@ant-design/pro-layout';

const Footer: React.FC = () => {
  const intl = useIntl();
  const defaultMessage = intl.formatMessage({
    id: 'app.copyright.produced',
    defaultMessage: '蚂蚁集团体验技术部出品',
  });

  const currentYear = new Date().getFullYear();

  return (
    <DefaultFooter
      copyright={`UBVision & Dashboard`}
    // links={[
    //   {
    //     key: 'UBVision & Dashboard',
    //     title: 'UBVision',
    //     href: '',
    //     blankTarget: false,
    //   },
    //   {
    //     key: 'Dashboard',
    //     title: 'Dashboard',
    //     href: '',
    //     blankTarget: false,
    //   },
    // ]}
    />
  );
};

export default Footer;
