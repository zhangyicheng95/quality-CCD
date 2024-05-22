import { useEffect } from 'react';
import { Button } from 'antd';

const ChooseFileButton = (props: any) => {
  const { children = null, name, onClick = null, onOk = null, className = '', ...rest } = props;
  useEffect(() => {
    const messageFun = (e: any) => {
      if (e.data.from === 'choose' && e.data.name === name) {
        onOk(e.data.payload);
      }
    };
    window.addEventListener('message', messageFun);

    return () => {
      window.removeEventListener('message', messageFun);
    };
  }, []);
  return (
    <Button className={`${className}`} {...rest} onClick={onClick} style={{ fontSize: 'inherit' }}>
      {children}
    </Button>
  );
};

export default ChooseFileButton;
