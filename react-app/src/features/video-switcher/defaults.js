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
      emptyText: 'チャンネル1の動画URLを入れてください。'
    },
    {
      label: '応用編',
      youtubeUrl: 'https://www.youtube.com/watch?v=ysz5S6PUM-U',
      emptyText: 'チャンネル2の動画URLを入れてください。'
    },
    {
      label: '早見表',
      youtubeUrl: '',
      emptyText: 'この枠は動画の代わりに案内テキストとしても使えます。'
    }
  ]
};
