console.log("BLOGS JS VERSION 2");

const API_URL = "https://backend.qksgroup.com/get-blogs?page=0&size=9";

async function loadBlogs() {
    try {

        const response = await fetch(API_URL);
        const data = await response.json();

        console.log("API Response:", data);

        const grid = document.getElementById("blogs-grid");

        if (!grid) {
            console.error("blogs-grid element not found");
            return;
        }

        grid.innerHTML = "";

        data.body.forEach((blog) => {

            console.log(blog.cardImageDetailsDto);

            const image =
                blog.cardImageDetailsDto?.thumbnail ||
                blog.cardImageDetailsDto?.medium ||
                blog.cardImageDetailsDto?.small ||
                "";

            console.log("Image URL:", image);

            const date = new Date(blog.postDate);

            const formattedDate = date.toLocaleDateString("en-GB");

            const synopsis = blog.synopsis
                ? blog.synopsis
                : "Click Read More to explore the complete article.";

            const author = blog.postAuthor || "QKS Group";

            const blogUrl =
    blog.blogUrl
        ? "https://qksgroup.com" + blog.blogUrl
        : "#";

            grid.innerHTML += `
<div class="blog-card">

    <div class="blog-card-image">

        <img
            src="${image}"
            alt="${blog.blogTitle}"
            loading="lazy"
            onerror="this.onerror=null;this.src='https://placehold.co/800x500?text=No+Image';"
        >

        <div class="blog-overlay"></div>

        <div class="blog-top">

            <span class="blog-badge">Blog</span>

            <span class="blog-date">${formattedDate}</span>

        </div>

        <div class="blog-info">

            <h3>
                ${
                    blog.blogTitle.length > 80
                    ? blog.blogTitle.substring(0,80) + "..."
                    : blog.blogTitle
                }
            </h3>

            <p>
                ${
                    synopsis.length > 140
                    ? synopsis.substring(0,140) + "..."
                    : synopsis
                }
            </p>

            <div class="blog-bottom">

                <span class="author">
                    ${author}
                </span>

                <a
                    href="${blogUrl}"
                    target="_blank"
                    rel="noopener"
                >
                    Read More →
                </a>

            </div>

        </div>

    </div>

</div>
`;

        });

    } catch (error) {

        console.error("Blog Loading Error:", error);

    }
}

document.addEventListener("DOMContentLoaded", loadBlogs);