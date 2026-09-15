// post.js

const postTitleEl = document.getElementById("post-title");
const postDateEl = document.getElementById("post-date");
const postContentEl = document.getElementById("post-content");
const postBreadcrumbTitleEl = document.getElementById("post-breadcrumb-title");

const requestedPost = new URLSearchParams(window.location.search).get("post");

loadAllowedPost(requestedPost);

async function loadAllowedPost(post) {
    if (!post || !/^[A-Za-z0-9_-]+$/.test(post)) {
        showPostError();
        return;
    }

    try {
        const response = await fetch("posts/posts.json");
        if (!response.ok) throw new Error("Could not load post index");
        const allowedPosts = await response.json();
        const file = allowedPosts.find(candidate => candidate === post || postSlug(candidate) === post.toLowerCase());
        if (!file) {
            showPostError();
            return;
        }
        await loadPost(file);
    } catch (error) {
        showPostError();
    }
}

async function loadPost(post) {
    const url = `posts/${encodeURIComponent(post)}.md`;
    const response = await fetch(url);
    if (!response.ok) throw new Error("Could not load post");
    const text = await response.text();

    const meta = extractMeta(text);
    const content = extractContent(text);

    const title = meta.title || post;
    const date = meta.date || "";

    postTitleEl.textContent = title;
    postDateEl.textContent = date;
    if (postBreadcrumbTitleEl) postBreadcrumbTitleEl.textContent = title;
    document.title = title + " | Oli";
    const description = `Oli's blog post: ${title}`;
    const descriptionMeta = document.querySelector('meta[name="description"]');
    if (descriptionMeta) descriptionMeta.content = description;
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.content = `${title} | Oli`;
    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) ogDescription.content = description;
    const canonicalUrl = `https://cyberoli.uk/posts.html?post=${encodeURIComponent(post)}`;
    const canonicalLink = document.querySelector('link[rel="canonical"]');
    if (canonicalLink) canonicalLink.href = canonicalUrl;
    const structuredData = document.getElementById("structured-data");
    if (structuredData) {
        structuredData.textContent = JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: title,
            description,
            datePublished: parsePostDate(date),
            url: canonicalUrl,
            author: {
                "@type": "Person",
                name: "Oli",
                url: "https://cyberoli.uk/"
            },
            image: "https://cyberoli.uk/og.png"
        });
    }
    // Allow simple image size syntax in markdown:  ![alt](path =400) or ![alt](path =400x300) or percentage ![alt](path =50%)
    // Also support optional rotation: ![alt](path =400 rotate=90)
    const processed = processImageSizeSyntax(content);
    const rendered = marked.parse(processed);
    const sanitized = sanitizeRenderedHtml(rendered);
    sanitized.querySelectorAll("h1").forEach(heading => {
        const replacement = document.createElement("h2");
        replacement.replaceChildren(...heading.childNodes);
        heading.replaceWith(replacement);
    });
    postContentEl.replaceChildren(...sanitized.childNodes);

    window.dispatchEvent(new Event('postLoaded'));
}

function postSlug(file) {
    return file.toLowerCase().replace(/_/g, "-");
}

function parsePostDate(value) {
    const match = /^(\d{2})\/(\d{2})\/(\d{4})/.exec(value);
    return match ? `${match[3]}-${match[2]}-${match[1]}` : undefined;
}

function showPostError() {
    postTitleEl.textContent = "Post Not Found";
    if (postBreadcrumbTitleEl) postBreadcrumbTitleEl.textContent = "Not found";
    postDateEl.textContent = "";
    postContentEl.textContent = "That post does not exist.";
}

function sanitizeRenderedHtml(html) {
    const parsed = new DOMParser().parseFromString(html, "text/html");
    const blockedTags = new Set([
        "base", "embed", "form", "iframe", "link", "meta", "object", "script", "style", "svg"
    ]);
    const urlAttributes = new Set(["data-hires", "href", "src"]);

    parsed.body.querySelectorAll("*").forEach(element => {
        if (blockedTags.has(element.tagName.toLowerCase())) {
            element.remove();
            return;
        }

        [...element.attributes].forEach(attribute => {
            const name = attribute.name.toLowerCase();
            const value = attribute.value.trim();
            if (name.startsWith("on") || name === "srcdoc" || name === "style" || name === "srcset") {
                element.removeAttribute(attribute.name);
            } else if (urlAttributes.has(name) && !isSafeUrl(value)) {
                element.removeAttribute(attribute.name);
            }
        });
    });

    return parsed.body;
}

function isSafeUrl(value) {
    if (!value || value.startsWith("#")) return true;
    try {
        const url = new URL(value, window.location.href);
        return url.protocol === "http:" || url.protocol === "https:";
    } catch (error) {
        return false;
    }
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
