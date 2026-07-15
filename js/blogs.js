// ======================================
// QKS Blog Listing
// Version 1.0
// ======================================

const BlogModule = {

    apiUrl: "https://backend.qksgroup.com/get-blogs?page=0&size=9",

    async init() {
        await this.loadBlogs();
    },

    async loadBlogs() {

        try {

            const response = await fetch(this.apiUrl);
            const result = await response.json();

            this.renderBlogs(result.body);

        } catch (error) {

            console.error("Blog API Error :", error);

        }

    },

    renderBlogs(blogs) {

        const grid = document.getElementById("blogs-grid");

        if (!grid) return;

        grid.innerHTML = "";

        blogs.forEach(blog => {

            grid.insertAdjacentHTML(
                "beforeend",
                this.createCard(blog)
            );

        });

    },

    createCard(blog) {

        return `
        
        <div class="blog-card">

            <div class="blog-card-image">

                <img
                    src="${blog.cardImageDetailsDto.thumbnail}"
                    alt="${blog.blogTitle}"
                >

                <div class="blog-overlay"></div>

                <div class="blog-top">

                    <span class="blog-badge">
                        ${blog.postType}
                    </span>

                    <span class="blog-date">
                        ${this.formatDate(blog.postDate)}
                    </span>

                </div>

            </div>

            <div class="blog-content">

                <h3 class="blog-title">

                    ${blog.blogTitle}

                </h3>

                <p class="blog-description">

                    ${blog.synopsis ?? ""}

                </p>

                <div class="blog-footer">

                    <span class="blog-author">

                        ${blog.postAuthor}

                    </span>

                    <span class="blog-read">

                        Read More →

                    </span>

                </div>

            </div>

        </div>

        `;

    },

    formatDate(date) {

        return new Date(date).toLocaleDateString(
            "en-GB",
            {
                day: "2-digit",
                month: "short",
                year: "numeric"
            }
        );

    }

};

document.addEventListener(
    "DOMContentLoaded",
    () => BlogModule.init()
);