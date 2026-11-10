/* Portfolio-only sample conversations. No Firebase writes. */
(function () {
  if (new URLSearchParams(location.search).get('portfolio-demo') !== '1') return;
  const channelId = 'portfolio-demo';
  const sample = [
    ['佐藤 美咲','10:24','トップページのファーストビューを更新しました。PC版の画面案を共有します。余白と見出しのバランスを見てもらえますか？'],
    ['田中 悠','10:32','見ました！ 見出しが読みやすいですね。スマホ版はナビゲーションが少し窮屈なので、折り返しを調整すると良さそうです。'],
    ['山本 彩','10:41','スマホ表示を確認しました。修正箇所をまとめたので共有します。'],
    ['鈴木 健','10:49','CSSの修正案です。画面幅が狭いときだけ余白を調整するようにしています。'],
    ['佐藤 美咲','11:05','修正を反映しました！ PC・スマホ両方で確認できたので、更新版を共有します。ありがとうございます。']
  ];
  const sampleArtifacts = {
    0: {kind:'preview',file:'homepage_desktop_v2.png',label:'PC版トップページ案',updated:false},
    2: {kind:'mobile',file:'mobile_check.png',label:'スマートフォン表示の確認',updated:false},
    3: {kind:'code',file:'responsive.css',label:'CSS修正案'},
    4: {kind:'preview',file:'homepage_final.png',label:'修正後のトップページ',updated:true}
  };
  const artifactMarkup = function (artifact) {
    if (artifact.kind === 'code') {
      return '<div class="mt-3 max-w-xl overflow-hidden rounded-lg border border-slate-600 bg-[#111827]">'+
        '<div class="flex items-center justify-between border-b border-slate-700 px-3 py-2 text-xs text-slate-300"><span>〈/〉 responsive.css</span><span>CSS・サンプル</span></div>'+
        '<pre class="overflow-x-auto p-3 text-xs leading-5 text-emerald-300"><code>@media (max-width: 640px) {&#10;  .hero { padding: 56px 20px; }&#10;  .hero h1 { font-size: 2rem; }&#10;  .nav-links { flex-wrap: wrap; }&#10;}</code></pre></div>';
    }
    const mobile=artifact.kind==='mobile';
    const color=artifact.updated?'#e4eee7':'#e5e9f0';
    const preview='<div style="background:'+color+';color:#213c35;padding:18px 22px;min-height:154px;font-family:system-ui,sans-serif">'+
      '<div style="display:flex;justify-content:space-between;font-size:10px;font-weight:700"><span>atelier.</span><span>WORKS　ABOUT　CONTACT</span></div>'+
      '<div style="margin-top:25px;font-family:serif;font-size:'+(mobile?'17':'25')+'px;line-height:1.3">日々の暮らしに、<br>心地よいデザインを。</div>'+
      '<div style="font-size:9px;margin-top:9px;color:#527066">Design for everyday life.</div>'+
      '<div style="margin-top:12px;background:#315e51;color:white;display:inline-block;padding:5px 12px;font-size:9px">View works</div></div>';
    return '<div class="mt-3 max-w-xl rounded-lg border border-slate-600 overflow-hidden bg-slack-card">'+
      '<div class="px-3 py-2 text-xs text-gray-300 flex justify-between"><span>▧ '+artifact.file+'</span><span>画面イメージ・サンプル</span></div>'+
      '<div class="bg-[#dce5e1] p-3"><div style="max-width:'+(mobile?'180':'430')+'px;margin:auto;border:4px solid #303b44;border-radius:'+(mobile?'18':'7')+'px;overflow:hidden">'+preview+'</div></div>'+
      '<div class="px-3 py-2 text-xs text-gray-400">'+artifact.label+'</div></div>';
  };
  const apply = function () {
    if (typeof state === 'undefined' || typeof renderSidebar !== 'function') return;
    DEFAULT_CHANNELS.push({id:channelId,name:'制作相談（サンプル）',icon:'#',code:null});
    state.unlockedChannels.push(channelId);
    state.messages[channelId] = sample.map((row,i)=>({
      id:'portfolio-sample-'+i,user:row[0],timestamp:row[1],text:row[2],avatar:null,code:null
    }));
    const originalSwitch = switchChannel;
    switchChannel = function (id,name,icon,code) {
      if (id !== channelId) return originalSwitch(id,name,icon,code);
      state.currentChannel=id;
      elements.currentChannelTitle.textContent=name;
      elements.currentChannelIcon.textContent=icon;
      renderSidebar();
      if (window.innerWidth < 768 && !elements.sidebar.classList.contains('-translate-x-full')) toggleMobileSidebar();
      renderMessages();
    };
    const originalRender = renderMessages;
    renderMessages = function () {
      originalRender();
      if (state.currentChannel === channelId) {
        const rows=elements.messagesContainer.querySelectorAll('.group.relative.flex.gap-3');
        rows.forEach((row,index)=>{
          const artifact=sampleArtifacts[index];
          if (!artifact) return;
          const content=row.querySelector('.flex-1.min-w-0');
          if (content) content.insertAdjacentHTML('beforeend',artifactMarkup(artifact));
        });
        elements.messagesContainer.querySelectorAll('button[title="メッセージを削除"]').forEach(b=>b.remove());
      }
    };
    const originalSend = sendMessage;
    sendMessage = function () {
      if (state.currentChannel === channelId) return;
      return originalSend();
    };
    const originalDelete = deleteMessage;
    deleteMessage = function (id) {
      if (state.currentChannel === channelId) return;
      return originalDelete(id);
    };
    const form=elements.messageForm;
    form.addEventListener('submit',e=>{if(state.currentChannel===channelId){e.preventDefault();e.stopImmediatePropagation();}},true);
    elements.messageInput.placeholder='サンプル会話（閲覧専用）';
    const note=document.createElement('div');
    note.className='text-xs text-amber-300 px-4 py-2 bg-amber-950/40 border-b border-amber-700/30';
    note.textContent='ポートフォリオ用サンプル会話です。実際の利用者・送受信履歴ではありません。';
    elements.messagesContainer.parentElement.insertBefore(note,elements.messagesContainer);
    switchChannel(channelId,'制作相談（サンプル）','#',null);
  };
  document.addEventListener('DOMContentLoaded',apply);
})();
