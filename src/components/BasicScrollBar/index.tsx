import React, { useEffect, useRef } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';

const defaultStyle = {
  height: '100%',
  width: '100%',
  overflowX: 'hidden',
};

interface Props {
  data?: any;
  style?: any;
  children: any;
  onScroll?: any;
}

const BasicScrollBar: React.FC<Props> = (props: any) => {
  const { children, style, onScroll, data, ...rest } = props;
  const scrollRef = useRef<any>({});

  const newStyle = { ...defaultStyle, ...style };

  const onScrollStop = () => {
    onScroll &&
      onScroll(
        scrollRef.current.getScrollTop(),
        scrollRef.current.getClientHeight()
      );
  };
  useEffect(() => {
    // if (scrollRef.current.getClientHeight() === scrollRef.current.getScrollTop()) {
    scrollRef.current.scrollToBottom();
    // }
  }, [data]);
  return (
    // @ts-ignore
    <Scrollbars
      autoHide
      autoHideTimeout={1000}
      autoHideDuration={200}
      style={newStyle}
      thumbMinSize={0}
      ref={scrollRef}
      onScrollStop={onScrollStop}
      renderTrackHorizontal={({ ...props }) => {
        const finalStyle = {
          ...style,
          right: 2,
          bottom: 2,
          left: 2,
          borderRadius: 3,
        };

        return newStyle.overflowX === 'hidden' ? (
          <div />
        ) : (
          <div style={finalStyle} {...props} />
        );
      }}
      {...rest}
    >
      {children}
    </Scrollbars>
  );
};

export default BasicScrollBar;
