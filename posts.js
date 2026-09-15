
const postListEl = document.getElementById("post-list");
const searchInput = document.getElementById("post-search");
const searchStatus = document.getElementById("post-search-status");
let posts = [];
const hiddenPosts = new Set(["ORCSphotos"]);

function postSlug(file) {
    return file.toLowerCase().replace(/_/g, "-");
}

loadPosts();

async function loadPosts() {
    const files = await fetch("posts/posts.json").then(r => r.json());
    posts = await Promise.all(files.map(async file => {
        const text = await fetch(`posts/${file}.md`).then(r => r.text());
        const meta = extractMeta(text);

        return {
            file,
            title: meta.title || file,
            date: meta.date || "",
            content: text
        };
    }));

    renderPosts();
}

function renderPosts() {
    const keyword = searchInput.value.trim().slice(0, 100).toLowerCase();
    const matchingPosts = posts.filter(post => {
        if (hiddenPosts.has(post.file)) return false;
        const searchableText = `${post.title} ${post.date} ${post.content}`.toLowerCase();
        return searchableText.includes(keyword);
    });

    postListEl.replaceChildren();
    for (const post of matchingPosts) {
        const item = document.createElement("a");
        item.href = `posts.html?post=${post.file}`;
        item.className = "project-card";

        const title = document.createElement("h3");
        appendHighlightedText(title, post.title, keyword);
        const date = document.createElement("p");
        appendHighlightedText(date, post.date, keyword);
        item.append(title, date);

        const snippet = getSnippet(post.content, keyword);
        if (snippet) {
            const excerpt = document.createElement("p");
            excerpt.className = "post-snippet";
            appendHighlightedText(excerpt, snippet, keyword);
            item.appendChild(excerpt);
        }

        postListEl.appendChild(item);
    }

    const count = matchingPosts.length;
    searchStatus.textContent = `${count} post${count === 1 ? "" : "s"} found`;
}

function appendHighlightedText(element, text, keyword) {
    if (!keyword) {
        element.textContent = text;
        return;
    }

    const lowerText = text.toLowerCase();
    let cursor = 0;
    let matchIndex = lowerText.indexOf(keyword, cursor);
    while (matchIndex !== -1) {
        element.appendChild(document.createTextNode(text.slice(cursor, matchIndex)));
        const highlight = document.createElement("mark");
        highlight.textContent = text.slice(matchIndex, matchIndex + keyword.length);
        element.appendChild(highlight);
        cursor = matchIndex + keyword.length;
        matchIndex = lowerText.indexOf(keyword, cursor);
    }
    element.appendChild(document.createTextNode(text.slice(cursor)));
}

function getSnippet(content, keyword) {
    if (!keyword) return "";

    const plainText = content
        .replace(/^---[\s\S]*?---\s*/m, "")
        .replace(/^#{1,6}\s.*$/gm, ". ")
        .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1")
        .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
        .replace(/[`*_#>~-]/g, "")
        .replace(/\s+/g, " ")
        .trim();
    const matchIndex = plainText.toLowerCase().indexOf(keyword);

    if (matchIndex === -1) return "";

    const previousSentence = Math.max(
        plainText.lastIndexOf(".", matchIndex),
        plainText.lastIndexOf("!", matchIndex),
        plainText.lastIndexOf("?", matchIndex)
    );
    const sentenceStart = previousSentence + 1;
    const start = previousSentence >= 0 && matchIndex - sentenceStart <= 80
        ? sentenceStart
        : matchIndex;
    const end = Math.min(plainText.length, start + 120);
    const prefix = start > 0 ? "..." : "";
    const suffix = end < plainText.length ? "..." : "";
    return `${prefix}${plainText.slice(start, end).trim()}${suffix}`;
}

searchInput.addEventListener("input", renderPosts);

const searchExamples = ["Arch", "Pihole", "Glance","Mint","Linux","LFS","Homelab","ORCS","Battery","University"];
let exampleIndex = 0;
let exampleCharacter = 0;
let deletingExample = false;
let exampleTimer = null;
const staticSearchPlaceholder = "Search for a keyword";

function searchMotionReduced() {
    return document.body.classList.contains("reduced-motion") ||
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function typeSearchExample() {
    if (searchMotionReduced()) {
        window.clearTimeout(exampleTimer);
        searchInput.placeholder = staticSearchPlaceholder;
        return;
    }

    if (searchInput.value || document.activeElement === searchInput) {
        return;
    }

    const example = searchExamples[exampleIndex];
    if (deletingExample) {
        exampleCharacter--;
    } else {
        exampleCharacter++;
    }

    searchInput.placeholder = example.slice(0, exampleCharacter);

    if (!deletingExample && exampleCharacter === example.length) {
        deletingExample = true;
        exampleTimer = window.setTimeout(typeSearchExample, 1200);
        return;
    }

    if (deletingExample && exampleCharacter === 0) {
        deletingExample = false;
        exampleIndex = (exampleIndex + 1) % searchExamples.length;
    }

    exampleTimer = window.setTimeout(typeSearchExample, deletingExample ? 55 : 100);
}

searchInput.addEventListener("focus", () => {
    window.clearTimeout(exampleTimer);
    searchInput.placeholder = searchMotionReduced()
        ? staticSearchPlaceholder
        : "Search by keyword...";
});

searchInput.addEventListener("blur", () => {
    if (searchInput.value) return;
    exampleCharacter = 0;
    deletingExample = false;
    searchInput.placeholder = "";
    typeSearchExample();
});

typeSearchExample();
window.addEventListener("accessibilityMotionChanged", typeSearchExample);

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

