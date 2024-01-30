import React, { Suspense } from 'react';
import NoPage from './assets/No-data.png';

const DefaultSpin = () => <div>loading...</div>;

export default class ErrorBoundary extends React.PureComponent {
  constructor(props: any) {
    super(props);
    this.state = {
      hasError: false,
    };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true };
  }

  componentDidCatch(error: any, info: any) {
    console.error(error);
    if (String(error).includes('Loading chunk')) {
      window.location.reload();
    }
  }

  render() {
    // @ts-ignore
    if (this?.state?.hasError) {
      return (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            fontSize: 16,
            color: '#333',
            fontWeight: 'bold',
          }}
        >
          <img src={NoPage} alt="" style={{ maxWidth: 200, maxHeight: 200 }} />
          <div style={{ display: 'flex' }}>
            哎呀，页面走丢了，请
            <a
              onClick={() => {
                window.location.reload();
              }}
            >
              刷新
            </a>
            重试
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
