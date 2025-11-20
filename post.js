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
    postContentEl.innerHTML = marked.parse(content);
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
