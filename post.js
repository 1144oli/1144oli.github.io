// post.js

const postTitleEl = document.getElementById("post-title");
const postDateEl = document.getElementById("post-date");
const postContentEl = document.getElementById("post-content");

const post = new URLSearchParams(window.location.search).get("post");

if (post) {
    loadPost(post);
}

async function loadPost(post) {
    const url = `posts/${post}.md`;
    const text = await fetch(url).then(r => r.text());

    const meta = extractMeta(text);
    const content = extractContent(text);

    const title = meta.title || post;
    const date = meta.date || "";

    postTitleEl.textContent = title;
    postDateEl.textContent = date;
    document.title = title + " | Oli";
    // Allow simple image size syntax in markdown:  ![alt](path =400) or ![alt](path =400x300) or percentage ![alt](path =50%)
    // Also support optional rotation: ![alt](path =400 rotate=90)
        const processed = processImageSizeSyntax(content);
    postContentEl.innerHTML = marked.parse(processed);

    window.dispatchEvent(new Event('postLoaded'));
}

function processImageSizeSyntax(md) {
    // Matches ![alt](url [=WIDTH] [rotate=90] [hi=URL] [align=left|center|right])
    //  replace <img src="url" alt="alt" width/height/style/data-hires as requested>
    return md.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (m, alt, inner) => {
        const parts = inner.trim().split(/\s+/);
        const url = parts[0];
        let size = null, rotate = null, hi = null, align = null;
        for (let i = 1; i < parts.length; i++) {
            const p = parts[i];
            if (p.startsWith('=')) {
                size = p.substring(1);
            } else if (p.startsWith('rotate=')) {
                rotate = p.split('=')[1];
            } else if (p.startsWith('hi=')) {
                hi = p.split('=')[1];
            } else if (p.startsWith('align=')) {
                align = p.split('=')[1];
            }
        }

        let attrs = '';
        let styleParts = [];
        if (size) {
            if (size.endsWith('%')) {
                styleParts.push(`width:${size};`, `height:auto;`);
            } else if (size.includes('x')) {
                const [w, h] = size.split('x');
                attrs += ` width="${w}" height="${h}"`;
            } else {
                attrs += ` width="${size}"`;
                styleParts.push(`height:auto;`);
            }
        }
        if (rotate) {
            styleParts.push(`transform: rotate(${rotate}deg);`);
        }
        if (align) {
            if (align === 'center') {
                styleParts.push('display:block;', 'margin:0 auto;');
            } else if (align === 'left') {
                styleParts.push('float:left;', 'margin:0 1em 1em 0;');
            } else if (align === 'right') {
                styleParts.push('float:right;', 'margin:0 0 1em 1em;');
            }
        }
        if (styleParts.length) {
            attrs += ` style="${styleParts.join(' ')}"`;
        }
        if (hi) {
            attrs += ` data-hires="${hi}"`;
        }
        return `<img src="${url}" alt="${alt.replace(/"/g, '&quot;')}" ${attrs}>`;
    });
}

function extractMeta(md) {
    const lines = md.split("\n");
    let meta = {};

    if (lines[0].trim() === "---") {
        let i = 1;
        for (; i < lines.length; i++) {
            if (lines[i].trim() === "---") break;
            const [key, ...rest] = lines[i].split(":");
            meta[key.trim()] = rest.join(":").trim();
        }
    }
    return meta;
}

function extractContent(md) {
    const lines = md.split("\n");
    if (lines[0].trim() === "---") {
        let i = 1;
        for (; i < lines.length; i++) {
            if (lines[i].trim() === "---") {
                return lines.slice(i + 1).join("\n");
            }
        }
    }
    return md;
}
