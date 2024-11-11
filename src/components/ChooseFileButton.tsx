import { useEffect } from 'react';
import { Button } from 'antd';

const ChooseFileButton = (props: any) => {
  const { children = null, name, onClick = null, onOk = null, className = '', style, ...rest } = props;
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
    <Button className={`${className}`} {...rest} onClick={onClick} style={Object.assign({ fontSize: 'inherit' }, !!style ? style : {})}>
      {children}
    </Button>
  );
};

export default ChooseFileButton;
