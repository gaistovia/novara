/* =========================================================
   NOVARA — Product Catalog
   Prices in Tanzanian Shillings (TZS)
   Devices rendered as original stylised SVG silhouettes
   (no third-party product photography — avoids IP exposure
   on a concept/demo project, per GA Istovia build standard)
   ========================================================= */

const ACCENTS = {
  apple: '#D8D8D8', samsung: '#8FB8FF', google: '#F2C879', nothing: '#EAEAEA',
  oneplus: '#EF5350', xiaomi: '#F7941E', honor: '#6FE3B0', sony: '#7FA8E8'
};

function phoneSVG(brandKey, colorHex){
  const accent = colorHex || ACCENTS[brandKey] || '#34C68F';
  const dots = brandKey === 'nothing';
  return `
  <svg viewBox="0 0 220 440" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <defs>
      <linearGradient id="body-${brandKey}" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#171f1c"/>
        <stop offset="100%" stop-color="#060b09"/>
      </linearGradient>
      <linearGradient id="screen-${brandKey}" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="${accent}" stop-opacity="0.35"/>
        <stop offset="70%" stop-color="${accent}" stop-opacity="0.03"/>
      </linearGradient>
    </defs>
    <rect x="10" y="6" width="200" height="428" rx="38" fill="url(#body-${brandKey})" stroke="rgba(255,255,255,0.14)" stroke-width="1.5"/>
    <rect x="18" y="16" width="184" height="408" rx="30" fill="url(#screen-${brandKey})"/>
    <rect x="78" y="26" width="64" height="16" rx="8" fill="#04100c"/>
    ${dots ? `
    <circle cx="34" cy="80" r="3" fill="${accent}" opacity="0.8"/>
    <circle cx="34" cy="100" r="3" fill="${accent}" opacity="0.6"/>
    <circle cx="186" cy="80" r="3" fill="${accent}" opacity="0.8"/>
    <circle cx="186" cy="360" r="3" fill="${accent}" opacity="0.6"/>
    ` : ''}
    <g transform="translate(30,40)">
      <rect x="0" y="0" width="62" height="62" rx="18" fill="rgba(0,0,0,0.45)" stroke="rgba(255,255,255,0.12)"/>
      <circle cx="19" cy="19" r="12" fill="#0b1512" stroke="${accent}" stroke-width="1.5"/>
      <circle cx="43" cy="19" r="12" fill="#0b1512" stroke="${accent}" stroke-width="1.5"/>
      <circle cx="19" cy="43" r="12" fill="#0b1512" stroke="${accent}" stroke-width="1.5"/>
      <circle cx="43" cy="43" r="7" fill="${accent}" opacity="0.5"/>
      <circle cx="19" cy="19" r="4" fill="${accent}"/>
      <circle cx="43" cy="19" r="4" fill="${accent}"/>
    </g>
    <rect x="80" y="404" width="60" height="4" rx="2" fill="rgba(255,255,255,0.25)"/>
  </svg>`;
}

const PRODUCTS = [
  {
    id:'p01', brand:'Apple', brandKey:'apple', name:'iPhone 16 Pro Max',
    tagline:'Titanium. Forged for performance.',
    storage:'256GB', ram:'8GB', display:'6.9" Super Retina XDR ProMotion',
    camera:'48MP Triple + 5x Tele', battery:'4685mAh', processor:'A18 Pro Bionic',
    colors:['#3d3d3d','#8a8f8a','#d8d2c2','#1c1f24'],
    price:4250000, oldPrice:4650000, rating:4.9, reviews:312,
    stockPercent:38, stockLeft:14, status:['best','new'], category:'flagship',
    fiveG:true, dualSim:true, warranty:'12-Month Official Warranty', delivery:'Same-Day in Dar es Salaam'
  },
  {
    id:'p02', brand:'Samsung', brandKey:'samsung', name:'Galaxy S25 Ultra',
    tagline:'AI-powered. Galaxy defined.',
    storage:'512GB', ram:'12GB', display:'6.8" Dynamic AMOLED 2X 120Hz',
    camera:'200MP Quad + S Pen', battery:'5000mAh', processor:'Snapdragon 8 Elite',
    colors:['#1a1a2e','#5c5c5c','#c9a876','#2f4f4f'],
    price:3980000, oldPrice:4400000, rating:4.8, reviews:276,
    stockPercent:52, stockLeft:22, status:['best'], category:'flagship',
    fiveG:true, dualSim:true, warranty:'12-Month Official Warranty', delivery:'Nationwide 24–48h'
  },
  {
    id:'p03', brand:'Google', brandKey:'google', name:'Pixel 9 Pro',
    tagline:'Pure Android. Pure intelligence.',
    storage:'256GB', ram:'16GB', display:'6.3" LTPO OLED 120Hz',
    camera:'50MP Triple + Tensor ISP', battery:'4700mAh', processor:'Google Tensor G4',
    colors:['#e8e3d8','#2c2c2c','#5c7a8a'],
    price:2850000, oldPrice:3150000, rating:4.7, reviews:184,
    stockPercent:64, stockLeft:31, status:['popular'], category:'photography',
    fiveG:true, dualSim:false, warranty:'12-Month Official Warranty', delivery:'Nationwide 24–48h'
  },
  {
    id:'p04', brand:'Nothing', brandKey:'nothing', name:'Phone (3)',
    tagline:'Transparent by design.',
    storage:'256GB', ram:'12GB', display:'6.7" LTPO AMOLED 120Hz',
    camera:'50MP Triple Glyph', battery:'5150mAh', processor:'Snapdragon 8s Gen 4',
    colors:['#e8e8e8','#1a1a1a'],
    price:2150000, oldPrice:null, rating:4.6, reviews:97,
    stockPercent:81, stockLeft:44, status:['new'], category:'design',
    fiveG:true, dualSim:true, warranty:'12-Month Official Warranty', delivery:'Nationwide 24–48h'
  },
  {
    id:'p05', brand:'OnePlus', brandKey:'oneplus', name:'OnePlus 13',
    tagline:'Never Settle. Ever.',
    storage:'256GB', ram:'16GB', display:'6.82" LTPO AMOLED 120Hz',
    camera:'50MP Hasselblad Triple', battery:'6000mAh', processor:'Snapdragon 8 Elite',
    colors:['#0d0d0d','#0b3d2e'],
    price:2450000, oldPrice:2750000, rating:4.8, reviews:158,
    stockPercent:29, stockLeft:9, status:['limited'], category:'flagship',
    fiveG:true, dualSim:true, warranty:'12-Month Official Warranty', delivery:'Nationwide 24–48h'
  },
  {
    id:'p06', brand:'Xiaomi', brandKey:'xiaomi', name:'15 Ultra',
    tagline:'Leica optics. Uncompromised.',
    storage:'512GB', ram:'16GB', display:'6.73" LTPO AMOLED 120Hz',
    camera:'50MP Leica Quad', battery:'6000mAh', processor:'Snapdragon 8 Elite',
    colors:['#1c1c1c','#5c3a21'],
    price:2980000, oldPrice:3300000, rating:4.7, reviews:141,
    stockPercent:46, stockLeft:19, status:['deal'], category:'photography',
    fiveG:true, dualSim:true, warranty:'12-Month Official Warranty', delivery:'Nationwide 24–48h'
  },
  {
    id:'p07', brand:'Honor', brandKey:'honor', name:'Magic 7 Pro',
    tagline:'AI vision. Effortless capture.',
    storage:'512GB', ram:'12GB', display:'6.8" LTPO OLED 120Hz',
    camera:'50MP Triple + AI Detect', battery:'5850mAh', processor:'Snapdragon 8 Elite',
    colors:['#0a0a0a','#e5dfd2'],
    price:2050000, oldPrice:null, rating:4.5, reviews:63,
    stockPercent:70, stockLeft:38, status:[], category:'budget',
    fiveG:true, dualSim:true, warranty:'12-Month Official Warranty', delivery:'Nationwide 24–48h'
  },
  {
    id:'p08', brand:'Sony', brandKey:'sony', name:'Xperia 1 VII',
    tagline:'Cinema in your pocket.',
    storage:'256GB', ram:'12GB', display:'6.5" 4K OLED 120Hz',
    camera:'48MP Zeiss Triple', battery:'5000mAh', processor:'Snapdragon 8 Elite',
    colors:['#101820','#2b2b2b'],
    price:3150000, oldPrice:3450000, rating:4.6, reviews:52,
    stockPercent:18, stockLeft:6, status:['limited'], category:'photography',
    fiveG:true, dualSim:false, warranty:'12-Month Official Warranty', delivery:'Nationwide 3–5 days'
  },
];

function formatTZS(n){
  if(n == null) return '';
  return 'TZS ' + n.toLocaleString('en-US');
}

function discountPct(price, oldPrice){
  if(!oldPrice) return null;
  return Math.round((1 - price/oldPrice) * 100);
}
