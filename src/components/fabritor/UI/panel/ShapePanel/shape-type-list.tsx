import { fabric } from 'fabric';

const degree2Radian = (d: any) => {
  return Math.PI * d / 180;
}

// 中心为 [0,0] 点
const getRightPolygonPoints = (num: any, radius = 100) => {
  const d = 360 / num;
  const points: { x: number, y: number }[] = [];
  for (let i = 0; i < num; i++) {
    const y = radius * Math.cos(degree2Radian(i * d));
    const x = radius * Math.sin(degree2Radian(i * d));
    points.push({ x: -x, y: -y });
  }
  return points;
}

export default [
  {
    key: 'point',
    elem: '<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="24" cy="24" r="3" fill="#f00" stroke="#f00" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    shape: fabric.Circle,
    options: { radius: 2, fill: '#f00' }
  },
  {
    key: 'rect',
    elem: '<svg width="200" height="200" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M42 6H6V42H42V6Z" fill="" stroke="#f00" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" shapeType="rect"/></svg>',
    shape: fabric.Rect,
    options: {}
  },
  // {
  //   key: 'rect-r',
  //   elem: '<svg width="200" height="200" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M39 6H9C7.34315 6 6 7.34315 6 9V39C6 40.6569 7.34315 42 9 42H39C40.6569 42 42 40.6569 42 39V9C42 7.34315 40.6569 6 39 6Z" fill="" stroke="#f00" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  //   shape: fabric.Rect,
  //   options: { width: 200, height: 200, rx: 20, ry: 20, fill: '#555555' }
  // },
  {
    key: 'circle',
    elem: '<svg width="200" height="200" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="24" cy="24" r="20" fill="" stroke="#f00" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    shape: fabric.Circle,
    options: { radius: 10, }
  },
  {
    key: 'sector',
    elem: '<svg t="1722948095872" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7514" width="128" height="128"><path d="M760.9085 800.702l-18.999-7.074c-75.2265-28.008-157.716-42.2055-245.1735-42.2055-75.42 0-147.1635 10.548-213.2415 31.356l-18.324 5.769L64.52 307.556l20.8485-7.4565C229.85 248.4215 364.409 223.298 496.736 223.298c145.4355 0 290.5245 28.845 443.565 88.1865l20.0565 7.776-199.449 481.4415zM496.736 709.37c85.1625 0 166.041 12.798 240.7275 38.061l167.526-404.3745C764.2835 290.7935 630.5165 265.355 496.736 265.355c-121.0455 0-244.3545 21.9465-376.2945 67.032l168.8535 404.766c64.98-18.4455 134.6625-27.783 207.441-27.783z" p-id="7515" fill="#d81e06"></path></svg>',
  },
  {
    key: 'curve',
    elem: '<svg t="1723709936783" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2370" width="48" height="48"><path d="M810.666667 42.666667c-42.666667 0-81.066667 17.066667-110.933334 42.666666-174.933333-81.066667-384-42.666667-520.533333 98.133334C42.666667 320 4.266667 524.8 85.333333 699.733333c-25.6 29.866667-42.666667 68.266667-42.666666 110.933334 0 93.866667 76.8 170.666667 170.666666 170.666666s170.666667-76.8 170.666667-170.666666-76.8-170.666667-170.666667-170.666667c-21.333333 0-38.4 4.266667-59.733333 12.8-55.466667-140.8-25.6-302.933333 85.333333-409.6 110.933333-110.933333 268.8-140.8 409.6-85.333333-4.266667 17.066667-8.533333 34.133333-8.533333 55.466666 0 93.866667 76.8 170.666667 170.666667 170.666667s170.666667-76.8 170.666666-170.666667-76.8-170.666667-170.666666-170.666666zM298.666667 810.666667c0 46.933333-38.4 85.333333-85.333334 85.333333s-85.333333-38.4-85.333333-85.333333 38.4-85.333333 85.333333-85.333334 85.333333 38.4 85.333334 85.333334zM810.666667 298.666667c-46.933333 0-85.333333-38.4-85.333334-85.333334s38.4-85.333333 85.333334-85.333333 85.333333 38.4 85.333333 85.333333-38.4 85.333333-85.333333 85.333334z" p-id="2371" fill="#ff0000"></path></svg>',
  },
  // {
  //   key: 'ellipse',
  //   elem: '<svg width="200" height="200" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><ellipse cx="24" cy="24" rx="14" ry="20" fill="" stroke="#f00" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  //   shape: fabric.Ellipse,
  //   options: { rx: 120, ry: 200, fill: '#555555' }
  // },
  // {
  //   key: 'triangle',
  //   elem: '<svg width="200" height="200" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M22.2692 6.98965C23.0395 5.65908 24.9565 5.65908 25.7309 6.98965L44.262 38.9979C45.0339 40.3313 44.0718 42 42.5311 42H5.4689C3.92823 42 2.96611 40.3313 3.73804 38.9979L22.2692 6.98965Z" fill="" stroke="#f00" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  //   shape: fabric.Triangle,
  //   options: { width: 200, height: 180, fill: '#555555' }
  // },
  // {
  //   key: 'right-angle',
  //   elem: '<svg width="200" height="200" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M8 9.1153C8 7.29468 10.2347 6.42094 11.4696 7.75874L40.9016 39.6434C42.0842 40.9246 41.1755 43 39.432 43H10C8.89543 43 8 42.1046 8 41V9.1153Z" fill="" stroke="#f00" stroke-width="4" stroke-linecap="square" stroke-linejoin="miter"/></svg>',
  //   shape: fabric.Polygon,
  //   options: { points: [{ x: 0, y: 0 }, { x: 0, y: 200 }, { x: 200, y: 200 }], fill: '#555555' }
  // },
  // {
  //   key: 'diamond',
  //   elem: '<svg width="200" height="200" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5.41421 22.5858L22.5858 5.41421C23.3668 4.63317 24.6332 4.63316 25.4142 5.41421L42.5858 22.5858C43.3668 23.3668 43.3668 24.6332 42.5858 25.4142L25.4142 42.5858C24.6332 43.3668 23.3668 43.3668 22.5858 42.5858L5.41421 25.4142C4.63317 24.6332 4.63316 23.3668 5.41421 22.5858Z" fill="" stroke="#f00" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  //   shape: fabric.Polygon,
  //   options: { points: [{ x: 0, y: 100 }, { x: 100, y: 200 }, { x: 200, y: 100 }, { x: 100, y: 0 }], fill: '#555555' }
  // },
  // {
  //   key: 'parallelgram',
  //   elem: '<svg width="200" height="200" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M41.2796 8H15.4704C14.5956 8 13.8223 8.5685 13.5614 9.40345L4.81142 37.4035C4.40897 38.6913 5.3711 40 6.72038 40H32.5296C33.4044 40 34.1777 39.4315 34.4386 38.5965L43.1886 10.5965C43.591 9.30869 42.6289 8 41.2796 8Z" fill="" stroke="#f00" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  //   shape: fabric.Polygon,
  //   options: { points: [{ x: 50, y: 0 }, { x: 0, y: 100 }, { x: 200, y: 100 }, { x: 250, y: 0 }], fill: '#555555' }
  // },
  // {
  //   key: 'pentagon',
  //   elem: '<svg width="200" height="200" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M25.2296 4.95843L42.8601 18.7012C43.5405 19.2316 43.8041 20.1385 43.5141 20.951L36.4739 40.6724C36.1897 41.4685 35.4357 42 34.5903 42H13.4097C12.5643 42 11.8103 41.4685 11.5261 40.6724L4.48593 20.951C4.19588 20.1385 4.45953 19.2315 5.13995 18.7012L22.7704 4.95843C23.4933 4.39496 24.5067 4.39496 25.2296 4.95843Z" fill="" stroke="#f00" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  //   shape: fabric.Polygon,
  //   options: { points: getRightPolygonPoints(5), fill: '#555555' }
  // },
  // {
  //   key: 'hexagon',
  //   elem: '<svg width="200" height="200" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M23.0287 43.4604L7.02871 34.5715C6.39378 34.2188 6 33.5495 6 32.8232V15.1768C6 14.4505 6.39378 13.7812 7.02872 13.4285L23.0287 4.5396C23.6328 4.20402 24.3672 4.20402 24.9713 4.5396L40.9713 13.4285C41.6062 13.7812 42 14.4505 42 15.1768V32.8232C42 33.5495 41.6062 34.2188 40.9713 34.5715L24.9713 43.4604C24.3672 43.796 23.6328 43.796 23.0287 43.4604Z" fill="" stroke="#f00" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  //   shape: fabric.Polygon,
  //   options: { points: getRightPolygonPoints(6), fill: '#555555' }
  // },
  // {
  //   key: 'star',
  //   elem: '<svg width="200" height="200" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M23.9986 5L17.8856 17.4776L4 19.4911L14.0589 29.3251L11.6544 43L23.9986 36.4192L36.3454 43L33.9586 29.3251L44 19.4911L30.1913 17.4776L23.9986 5Z" fill="" stroke="#f00" stroke-width="4" stroke-linejoin="round"/></svg>'
  // },
  // {
  //   key: 'heart',
  //   elem: '<svg width="200" height="200" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15 8C8.92487 8 4 12.9249 4 19C4 30 17 40 24 42.3262C31 40 44 30 44 19C44 12.9249 39.0751 8 33 8C29.2797 8 25.9907 9.8469 24 12.6738C22.0093 9.8469 18.7203 8 15 8Z" fill="" stroke="#f00" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>'
  // }
]