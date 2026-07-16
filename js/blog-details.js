console.log("BLOG DETAILS VERSION 1");

const API_BASE = "https://backend.qksgroup.com";

const slug = window.location.pathname.split("/").pop();

console.log("Slug:", slug);

let currentBlog = null;

async function loadBlog() {

    try {

        const response = await fetch(
            `${API_BASE}/get-single-blog?blogUrl=/blogs/${slug}`
        );

        const data = await response.json();

        console.log(data);

        currentBlog = data.body;

        renderBlog(currentBlog);

        loadRelatedBlogs(currentBlog.blogCategory);

    } catch (error) {

        console.error(error);

        document.getElementById("blog-title").innerHTML =
            "Blog not found.";

    }

}

function renderBlog(blog) {

    const image =
        blog.cardImageDetailsDto?.large ||
        blog.cardImageDetailsDto?.medium ||
        blog.cardImageDetailsDto?.thumbnail ||
        "";

    const date = new Date(blog.postDate);

    const formattedDate =
        date.toLocaleDateString("en-GB");

    document.title = blog.blogTitle;

    document.getElementById("blog-title").innerHTML =
        blog.blogTitle;

    document.getElementById("blog-date").innerHTML =
        formattedDate;

    document.getElementById("blog-author").innerHTML =
        blog.postAuthor || "QKS Group";

    document.getElementById("blog-category").innerHTML =
        blog.blogCategory || "Blog";

    document.getElementById("hero-image").src =
        image;

    document.getElementById("hero-image").alt =
        blog.blogTitle;

    document.getElementById("blog-html").innerHTML =
        blog.blogDescription;

    document.getElementById("blog-breadcrumb").innerHTML =
        `
        <a href="/">Home</a>

        <span>/</span>

        <a href="/blogs">Blogs</a>

        <span>/</span>

        <span>${blog.blogTitle}</span>
    `;

}