// components/VirtualKeyboard.jsx
import React, { useMemo, useState } from 'react';

const BASE = [
  ['`','1','2','3','4','5','6','7','8','9','0','-','='],
  ['q','w','e','r','t','y','u','i','o','p','[',']','\\'],
  ['a','s','d','f','g','h','j','k','l',';','\''],
  ['z','x','c','v','b','n','m',',','.','/'],
];
const SHIFT = {'`':'~','1':'!','2':'@','3':'#','4':'$','5':'%','6':'^','7':'&','8':'*','9':'(','0':')','-':'_','=':'+','[':'{',']':'}','\\':'|',';':':','\'':'"','/':'?','.':'>',',':'<'};

export default function VirtualKeyboard({ onInsert, onBackspace, onEnter, className='' }) {
  const [caps,setCaps]=useState(false);
  const [shift,setShift]=useState(false);
  const rows = useMemo(()=>BASE.map(r=>r.map(k=>{
    let v = shift && SHIFT[k] ? SHIFT[k] : k;
    if (/^[a-z]$/.test(k) && (caps ^ shift)) v = k.toUpperCase();
    return v;
  })),[caps,shift]);

  const key = 'rounded-lg border border-gray-200 bg-white shadow-sm hover:bg-gray-50 px-4 py-3 active:scale-95';
  const wide = `${key} px-7`;

  const tap = k => { onInsert?.(k); if (shift) setShift(false); };

  return (
    <div className={`rounded-2xl border p-2 bg-gray-50 ${className}`}>
      <div className="flex gap-2 justify-center mb-2">
        {rows[0].map(k=><button key={k} className={key} onClick={()=>tap(k)}>{k}</button>)}
        <button className={wide} onClick={onBackspace}>⌫</button>
      </div>
      <div className="flex gap-2 justify-center mb-2">
        <button className={`${wide} ${caps?'bg-blue-600 text-white':''}`} onClick={()=>setCaps(v=>!v)}>Caps</button>
        {rows[1].map(k=><button key={k} className={key} onClick={()=>tap(k)}>{k}</button>)}
      </div>
      <div className="flex gap-2 justify-center mb-2">
        {rows[2].map(k=><button key={k} className={key} onClick={()=>tap(k)}>{k}</button>)}
        <button className={wide} onClick={onEnter}>Enter ⏎</button>
      </div>
      <div className="flex gap-2 justify-center">
        <button className={`${wide} ${shift?'bg-blue-600 text-white':''}`} onClick={()=>setShift(v=>!v)}>Shift</button>
        {rows[3].map(k=><button key={k} className={key} onClick={()=>tap(k)}>{k}</button>)}
        <button className={key} onClick={()=>tap(' ')}>Space</button>
      </div>
    </div>
  );
}
