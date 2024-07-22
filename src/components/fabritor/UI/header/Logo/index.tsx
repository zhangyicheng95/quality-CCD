import { LOGO_ICON } from '@/common/constants/globalConstants';
import { CenterV } from '@/components/fabritor/components/Center';

export default function Logo() {
  return (
    <CenterV gap={5} style={{
      // width: PANEL_WIDTH,
      padding: '0 16px'
    }}>
      {/* <img src={LOGO_ICON} style={{ width: 28 }} /> */}
      <span style={{ fontWeight: 'bold', fontSize: 14 }}>

      </span>
    </CenterV>
  )
}