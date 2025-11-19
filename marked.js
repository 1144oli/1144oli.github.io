const posts = [
    {
        title: "Test",
        date: "2025-11-19",
        file: "posts/test.md",
        slug: "first-post"
    }
];

function displayBlogList() {
    const blogList = document.getElementById('blog-list');
    
    posts.forEach(post => {
        const postCard = document.createElement('a');
        postCard.href = `post.html?slug=${post.slug}`;
        postCard.className = 'project-card';
        postCard.innerHTML = `
            <h3>${post.title}</h3>
            <p>${post.date}</p>
        `;
        blogList.appendChild(postCard);
    });
}

async function displayPost(slug) {
    const post = posts.find(p => p.slug === slug);
    if (!post) return;
    
    const response = await fetch(post.file);
    const markdown = await response.text();
    const html = marked.parse(markdown);
    
    document.getElementById('post-title').textContent = post.title;
    document.getElementById('post-date').textContent = post.date;
    document.getElementById('post-content').innerHTML = html;
}

if (document.getElementById('blog-list')) {
    displayBlogList();
} else if (document.getElementById('post-content')) {
    const urlParams = new URLSearchParams(window.location.search);
    const slug = urlParams.get('slug');
    displayPost(slug);
}
