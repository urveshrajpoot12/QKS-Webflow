const API_URL = "https://backend.qksgroup.com/get-blogs?page=0&size=9";

async function loadBlogs() {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();

    const grid = document.getElementById("blogs-grid");

    if (!grid) {
      console.error("blogs-grid element not found");
      return;
    }

    grid.innerHTML = "";

    data.body.forEach((blog) => {

      const image =
        blog.cardImageDetailsDto?.large ||
        blog.cardImageDetailsDto?.medium ||
        blog.cardImageDetailsDto?.thumbnail ||
        "";

      const date = new Date(blog.postDate);

      const formattedDate = date.toLocaleDateString("en-GB");

      grid.innerHTML += `
        <div class="blog-card">

          <div class="blog-card-image">

            <img src="${image}" alt="${blog.blogTitle}" loading="lazy">

            <div class="blog-overlay"></div>

            <div class="blog-top">

              <span class="blog-badge">Blog</span>

              <span class="blog-date">${formattedDate}</span>

            </div>

          </div>

          <div class="blog-content">

            <h3 class="blog-title">
              ${blog.blogTitle}
            </h3>

            <p class="blog-description">
              ${blog.synopsis || ""}
            </p>

            <div class="blog-footer">

              <div class="author">
                ${blog.postAuthor || ""}
              </div>

              <a class="read-more" href="#">
                Read More →
              </a>

            </div>

          </div>

        </div>
      `;
    });

  } catch (err) {
    console.error(err);
  }
}

document.addEventListener("DOMContentLoaded", loadBlogs);