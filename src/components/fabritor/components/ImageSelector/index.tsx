import LocalImagePanel from './LocalImageSelector';
import RemoteImagePanel from './RemoteImageSelector';

export default function ImageSelector(props: any) {
  const { onChange, ...rest } = props;

  return (
    <div className='flex-box-justify-around' style={{ gap: 8 }}>
      <LocalImagePanel {...rest} onChange={onChange} />
      <RemoteImagePanel {...rest} onChange={onChange} />
    </div>
  )
}