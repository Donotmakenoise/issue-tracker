import MarkdownIt from 'markdown-it';

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  breaks: true,
});

// Custom renderer for images to make them responsive
md.renderer.rules.image = function (tokens, idx) {
  const token = tokens[idx];
  const src = token.attrGet('src');
  const alt = token.content;
  const title = token.attrGet('title');
  
  return `<img src="${src}" alt="${alt}" ${title ? `title="${title}"` : ''} class="max-w-full h-auto rounded-lg shadow-md mx-auto my-4" />`;
};

// Custom renderer for links to open external links in new tab
md.renderer.rules.link_open = function (tokens, idx) {
  const token = tokens[idx];
  const href = token.attrGet('href');
  
  if (href && (href.startsWith('http://') || href.startsWith('https://'))) {
    token.attrSet('target', '_blank');
    token.attrSet('rel', 'noopener noreferrer');
  }
  
  return md.renderer.renderToken(tokens, idx);
};

export function renderMarkdown(content: string): string {
  // Process YouTube embeds
  content = content.replace(
    /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/g,
    '<div class="relative w-full h-0 pb-[56.25%] my-6"><iframe class="absolute top-0 left-0 w-full h-full rounded-lg" src="https://www.youtube.com/embed/$1" frameborder="0" allowfullscreen></iframe></div>'
  );
  
  // Process video file embeds
  content = content.replace(
    /!\[([^\]]*)\]\(([^)]*\.(mp4|webm|ogg))\)/g,
    '<video controls class="max-w-full h-auto rounded-lg shadow-md mx-auto my-4"><source src="$2" type="video/$3">Your browser does not support the video tag.</video>'
  );
  
  return md.render(content);
}
