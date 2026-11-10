/* Portfolio-only sample conversations. No Firebase writes. */
(function () {
  if (new URLSearchParams(location.search).get('portfolio-demo') !== '1') return;
  const channelId = 'portfolio-demo';
  const sample = [
    ['佐藤 美咲','10:24','トップページの余白を少し広げてみました。スマホ表示も確認お願いします！'],
    ['田中 悠','10:38','確認しました！ 見出しが読みやすくなっていますね。スマホでもレイアウト崩れはありませんでした。'],
    ['山本 彩','10:45','全体のバランスも良いと思います。メニューの文字色をもう少し明るくすると、さらに見やすくなりそうです。'],
    ['鈴木 健','10:52','いいですね！ ボタンのホバー時の色も調整すると、操作が伝わりやすくなると思います。'],
    ['佐藤 美咲','11:05','ありがとうございます。メニューとボタンを修正して、午後にもう一度共有します！']
  ];
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
