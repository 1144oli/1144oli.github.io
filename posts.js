
const postListEl = document.getElementById("post-list");

loadPosts();

async function loadPosts() {
    try {
        const files = await fetch("posts/posts.json").then(r => r.json());
        buildList(files);
    } catch (e) {
        console.log("posts.json failed, attempting directory index");

        const html = await fetch("posts/").then(r => r.text());
        const files = [...html.matchAll(/href="([^"]+\.md)"/g)]
            .map(m => m[1])
            .map(fn => fn.split('/').pop().replace(".md", ""));

        if (files.length === 0) {
            console.log("No posts found");
            return;
        }

        buildList(files);
    }
}

async function buildList(files) {
    for (const file of files) {
        const url = `/posts/${file}.md`;
        const text = await fetch(url).then(r => r.text());

        const meta = extractMeta(text);

        const title = meta.title || file;
        const date = meta.date || "";

        const item = document.createElement("a");
        item.href = `posts.html?post=${file}`;
        item.className = "project-card";

        item.innerHTML = `
            <h3>${title}</h3>
            <p>${date}</p>
        `;

        postListEl.appendChild(item);
    }
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

