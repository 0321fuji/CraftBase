export const VIDEO_SWITCHER_DEFAULTS = {
  width: '100%',
  screenHeight: '220px',
  screenRadius: '12px',
  screenBgColor: '#f8fafc',
  buttonBgColor: '#f8fafc',
  buttonTextColor: '#475569',
  activeButtonBgColor: '#4a90e2',
  activeButtonTextColor: '#ffffff',
  buttonRadius: '10px',
  channels: [
    {
      label: '概要を見る',
      youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      title: '新機能の使い方を動画で解説',
      body: '短いチュートリアル動画を用意しました。再生ボタンを押して、全体の流れを確認してみましょう。',
      actionButtonText: '詳細を見る',
      actionUrl: 'https://example.com'
    },
    {
      label: '応用編',
      youtubeUrl: 'https://www.youtube.com/watch?v=ysz5S6PUM-U',
      title: '応用編を動画で確認',
      body: '少し慣れてきた方向けに、応用操作の流れをまとめています。必要な場面だけ確認したいときにも便利です。',
      actionButtonText: '詳細を見る',
      actionUrl: 'https://example.com'
    }
  ]
};
