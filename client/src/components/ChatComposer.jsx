// components/ChatComposer.jsx
import React, { useMemo, useRef, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import VirtualKeyboard from './VirtualKeyboard';

const allowed = ['image/png','image/jpeg','image/webp','application/pdf'];
const maxMB = 10;

export default function ChatComposer({ onSendMessage, showDesktopKeyboard = true }) {
  const [draft,setDraft]=useState('');
  const [files,setFiles]=useState([]); // [{file, id, previewUrl, error}]
  const [sending,setSending]=useState(false);
  const [showKbd,setShowKbd]=useState(false);
  const fileInputRef = useRef(null);
  const isMobile = useMemo(()=> /Mobi|Android/i.test(navigator.userAgent), []);

  const pickFiles = ()=> fileInputRef.current?.click();

  const add = (fls) => {
    const list=[...fls].slice(0,5);
    const next = list.map(f=>{
      let error=null;
      if(!allowed.includes(f.type)) error=`Unsupported: ${f.type||'unknown'}`;
      if(f.size > maxMB*1024*1024) error=`Too large (> ${maxMB}MB)`;
      return {
        id: crypto.randomUUID(),
        file:f,
        previewUrl: f.type.startsWith('image/')? URL.createObjectURL(f): null,
        error
      };
    });
    setFiles(prev=>[...prev,...next].slice(0,5));
  };

  const onDrop = (e)=>{ e.preventDefault(); add(e.dataTransfer?.files||[]); };
  const onPaste = (e)=> {
    const items = e.clipboardData?.items||[];
    const pasted=[];
    for(const it of items){ const f=it.getAsFile?.(); if(f) pasted.push(f); }
    if(pasted.length) add(pasted);
  };

  const removeFile = (id)=> setFiles(prev=>prev.filter(f=>f.id!==id));

  const uploadOne = async (file)=>{
    const ext = file.name?.split('.').pop() || 'bin';
    const key = `u-${Date.now()}-${crypto.randomUUID()}.${ext}`;
    const { data, error } = await supabase.storage.from('attachments').upload(key, file, { upsert:false });
    if (error) throw error;
    const { data:pub } = supabase.storage.from('attachments').getPublicUrl(data.path);
    return { url: pub.publicUrl, name: file.name, type: file.type, size: file.size };
  };

  const send = async ()=>{
    if (!draft.trim() && files.length===0) return;
    if (files.some(f=>f.error)) return;
    setSending(true);
    try{
      const uploaded = [];
      for (const f of files) {
        if (!f.error) uploaded.push(await uploadOne(f.file));
      }
      await onSendMessage?.({ text: draft.trim(), attachments: uploaded });
      setDraft(''); setFiles([]);
    }catch(err){
      console.error(err); alert('Failed to send. Try again.');
    }finally{ setSending(false); }
  };

  return (
    <div className="space-y-2">
      {/* composer bar */}
      <div
        className="relative rounded-full bg-white shadow-lg border px-3 py-2 flex items-end gap-2"
        onDrop={onDrop} onDragOver={(e)=>e.preventDefault()}
      >
        {/* left icons */}
        <button
          onClick={pickFiles}
          className="h-10 w-10 grid place-items-center rounded-full hover:bg-gray-100"
          title="Attach"
        >📎</button>

        <button
          onClick={()=>{/* plug mic later */}}
          className="h-10 w-10 grid place-items-center rounded-full hover:bg-gray-100"
          title="Voice"
        >🎤</button>

        {/* input */}
        <div className="flex-1">
          <textarea
            value={draft}
            onChange={(e)=>setDraft(e.target.value)}
            onKeyDown={(e)=>{ if(e.key==='Enter' && !e.shiftKey){ e.preventDefault(); send(); } }}
            onFocus={()=> setShowKbd(showDesktopKeyboard && !isMobile)}
            onBlur={()=> {/* keep keyboard open; close with toggle if you prefer */}}
            onPaste={onPaste}
            placeholder="Message OCBC AI"
            rows={1}
            className="w-full resize-none border-0 focus:ring-0 outline-none px-2 py-2 rounded-xl"
          />
          {/* preview row */}
          {!!files.length && (
            <div className="mt-2 flex flex-wrap gap-2">
              {files.map(({id,file,previewUrl,error})=>(
                <div key={id} className={`flex items-center gap-2 rounded-2xl border px-2 py-1 text-sm shadow-sm ${error?'border-red-400 bg-red-50':'border-gray-200 bg-white'}`}>
                  {previewUrl
                    ? <img src={previewUrl} alt={file.name} className="h-8 w-8 rounded object-cover"/>
                    : <div className="h-8 w-8 rounded bg-gray-100 grid place-items-center text-xs">FILE</div>}
                  <div className="max-w-40 truncate">
                    <div className="truncate">{file.name}</div>
                    <div className={`text-xs ${error?'text-red-600':'text-gray-500'}`}>
                      {error || `${(file.size/1024/1024).toFixed(2)} MB`}
                    </div>
                  </div>
                  <button onClick={()=>removeFile(id)} className="rounded-full px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200">✕</button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* send */}
        <button
          onClick={send}
          disabled={sending || (!draft.trim() && files.length===0)}
          className="h-10 w-10 grid place-items-center rounded-full bg-rose-300 hover:bg-rose-400 text-white disabled:opacity-50"
          title="Send"
        >➤</button>

        {/* hidden input */}
        <input
          ref={fileInputRef}
          type="file"
          hidden multiple
          accept="image/png,image/jpeg,image/webp,application/pdf"
          onChange={(e)=>add(e.target.files||[])}
        />
      </div>

      {/* on-screen keyboard (desktop/tablet only) */}
      {showKbd && (
        <VirtualKeyboard
          onInsert={(t)=>setDraft(d=>d+t)}
          onBackspace={()=>setDraft(d=>d.slice(0,-1))}
          onEnter={send}
          className="mt-1"
        />
      )}

      <p className="text-xs text-gray-500 px-2">
        Shift+Enter = newline • Paste or drag & drop files
      </p>
    </div>
  );
}
