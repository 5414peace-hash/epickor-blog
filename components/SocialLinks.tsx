type SocialLinksProps = {
  placement: 'header' | 'footer';
};

const channels = [
  {
    name: 'Instagram',
    href: 'https://www.instagram.com/epickorsnippets/',
    hoverClass: 'hover:border-pink-300 hover:bg-pink-50 hover:text-pink-600',
    icon: 'instagram',
  },
  {
    name: 'YouTube',
    href: 'https://www.youtube.com/@epickor',
    hoverClass: 'hover:border-red-300 hover:bg-red-50 hover:text-red-600',
    icon: 'youtube',
  },
] as const;

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" aria-hidden="true">
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="17.5" cy="6.8" r="1.1" fill="currentColor" />
    </svg>
  );
}

function YouTubeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[19px] w-[19px]" fill="none" aria-hidden="true">
      <path
        d="M21 8.1a3 3 0 0 0-2.1-2.15C17.05 5.45 12 5.45 12 5.45s-5.05 0-6.9.5A3 3 0 0 0 3 8.1 31 31 0 0 0 2.55 12 31 31 0 0 0 3 15.9a3 3 0 0 0 2.1 2.15c1.85.5 6.9.5 6.9.5s5.05 0 6.9-.5A3 3 0 0 0 21 15.9a31 31 0 0 0 .45-3.9A31 31 0 0 0 21 8.1Z"
        fill="currentColor"
      />
      <path d="m10 15.2 5.2-3.2L10 8.8v6.4Z" fill="white" />
    </svg>
  );
}

export default function SocialLinks({ placement }: SocialLinksProps) {
  const isHeader = placement === 'header';

  return (
    <div className={`flex items-center ${isHeader ? 'shrink-0 gap-1' : 'flex-wrap gap-2'}`}>
      {channels.map((channel) => (
        <a
          key={channel.name}
          href={channel.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Open EpicKor on ${channel.name} in a new tab`}
          title={`EpicKor on ${channel.name}`}
          data-analytics-event="social_channel_click"
          data-analytics-platform={channel.name.toLowerCase()}
          data-analytics-location={placement}
          className={`inline-flex items-center justify-center border border-gray-200 bg-white text-gray-700 transition ${channel.hoverClass} ${
            isHeader ? 'h-8 w-8 rounded-full' : 'gap-2 rounded-md px-3 py-2 text-xs font-black'
          }`}
        >
          {channel.icon === 'instagram' ? <InstagramIcon /> : <YouTubeIcon />}
          {!isHeader && <span>{channel.name}</span>}
        </a>
      ))}
    </div>
  );
}
