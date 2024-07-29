export default [
  {
    key: 'line',
    type: 'f-line',
    svg: '<svg xmlns="http://www.w3.org/2000/svg" stroke="#f00" fill="#f00" viewBox="0 -0.5 33 1"><line x1="0.5" x2="32.5" fill="#f00" stroke="#f00" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" /></svg>',
    options: {
      stroke: "#f00"
    }
  },
  {
    key: 'dash-line',
    type: 'f-line',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" stroke="#f00" fill="#f00" viewBox="0 -0.5 33 1"><line x1="0.5" x2="32.5" stroke-dasharray="3,1" stroke-linecap="butt" fill="none" /></svg>`,
    options: {
      strokeDashArray: [8, 8],
      stroke: "#f00"
    }
  },
  // {
  //   key: 'arrow-line-1',
  //   type: 'f-arrow',
  //   svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 56 40" stroke="#f00" fill="#f00">
  //   <line x1="0" x2="51" y1="20" y2="20" stroke-linecap="butt" fill="none" strokeWidth="4" />
  //   <path d="M 51 20 V 23 L 56 20 L 51 17 Z"></path></svg>`
  // },
  {
    key: 'arrow-line-2',
    type: 'f-tri-arrow',
    svg: '<svg xmlns="http://www.w3.org/2000/svg" stroke="#f00" fill="#f00" viewBox="0 -0.5 33 1"><line x1="0.5" x2="32.25" stroke-linecap="butt" fill="none" /><g transform="translate(33)"><path fill="none" stroke-linecap="round" stroke-linejoin="round" d="M -2.5,-1.5,-0.5,0,-2.5,1.5"></path></g></svg>',
    options: {
      stroke: "#f00"
    }
  },
]