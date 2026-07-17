console.log("BLOG DETAILS PRODUCTION V2");

const API_BASE = "https://backend.qksgroup.com";

// Get slug from URL
const params = new URLSearchParams(window.location.search);

const blogId = params.get("id");

console.log("Blog ID :", blogId);

// ===========================================
// URL PARAMETERS
// ===========================================

const params = new URLSearchParams(window.location.search);

const slug = params.get("slug");

console.log("Slug :", slug);

let currentBlog = null;

// ===========================================
// DOM ELEMENTS
// ===========================================

const titleEl = document.getElementById("blog-title");

const dateEl = document.getElementById("blog-date");

const authorEl = document.getElementById("blog-author");

const categoryEl = document.getElementById("blog-category");

const heroImageEl = document.getElementById("hero-image");

const htmlEl = document.getElementById("blog-html");

const breadcrumbEl = document.getElementById("blog-breadcrumb");

// Related Blogs

const relatedGrid = document.getElementById("related-blogs");

// ===========================================
// VALIDATE URL
// ===========================================

if (!slug) {

    console.error("Slug Not Found");

    if (titleEl) {

        titleEl.innerHTML = "Blog Not Found";

    }

    throw new Error("Slug Missing");

}

// ===========================================
// HELPERS
// ===========================================

function formatDate(dateString){

    if(!dateString) return "";

    const date = new Date(dateString);

    return date.toLocaleDateString("en-GB",{

        day:"2-digit",

        month:"long",

        year:"numeric"

    });

}

function getImage(blog){

    return (

        blog.cardImageDetailsDto?.large ||

        blog.cardImageDetailsDto?.medium ||

        blog.cardImageDetailsDto?.thumbnail ||

        "https://placehold.co/1200x700?text=No+Image"

    );

}

function escapeHTML(str){

    if(!str) return "";

    return str

        .replace(/&/g,"&amp;")

        .replace(/</g,"&lt;")

        .replace(/>/g,"&gt;")

        .replace(/"/g,"&quot;")

        .replace(/'/g,"&#039;");

}

// ===========================================
// SEO
// ===========================================

function updateSEO(blog){

    document.title = `${blog.blogTitle} | QKS Group`;

    let meta = document.querySelector('meta[name="description"]');

    if(!meta){

        meta = document.createElement("meta");

        meta.name = "description";

        document.head.appendChild(meta);

    }

    meta.content =

        blog.synopsis ||

        "Latest Insights from QKS Group.";

}

// ===========================================
// LOADING
// ===========================================

function showLoading(){

    if(titleEl){

        titleEl.innerHTML = "Loading Blog...";

    }

}

function hideLoading(){

    // Reserved for future loader animation

}

// ===========================================
// ERROR
// ===========================================

function showError(message){

    console.error(message);

    if(titleEl){

        titleEl.innerHTML = message;

    }

}

// ===========================================
// START
// ===========================================

showLoading();
// ===========================================
// LOAD BLOG
// ===========================================

async function loadBlog() {

    try {

        console.log("Fetching Blog...");

        const response = await fetch(
`${API_BASE}/get-single-blog?id=${blogId}`
);

        if (!response.ok) {

            throw new Error("API Error");

        }
const data = await response.json();

console.log("FULL BLOG DATA");
console.log(data);

console.log("BODY");
console.log(data.body);

console.log("FIRST BLOG");
console.log(JSON.stringify(data.body, null, 2));
        // const data = await response.json();

        // console.log("Single Blog API:", data);

        // if (!data.body) {

        //     showError("Blog Not Found");

        //     return;

        // }

        currentBlog = data.body;

        renderBlog(currentBlog);

        updateSEO(currentBlog);

        hideLoading();

        // Load Related Blogs
        loadRelatedBlogs(currentBlog.blogCategory);

    } catch (error) {

        console.error(error);

        showError("Unable to load blog.");

    }

}

// ===========================================
// RENDER BLOG
// ===========================================

function renderBlog(blog) {

    const image = getImage(blog);

    const formattedDate = formatDate(blog.postDate);

    // ---------------------------------------

    // Title

    // ---------------------------------------

    if (titleEl) {

        titleEl.innerHTML = blog.blogTitle;

    }

    // ---------------------------------------

    // Date

    // ---------------------------------------

    if (dateEl) {

        dateEl.innerHTML = formattedDate;

    }

    // ---------------------------------------

    // Author

    // ---------------------------------------

    if (authorEl) {

        authorEl.innerHTML =

            blog.postAuthor || "QKS Group";

    }

    // ---------------------------------------

    // Category

    // ---------------------------------------

    if (categoryEl) {

        categoryEl.innerHTML =

            blog.blogCategory || "Blog";

    }

    // ---------------------------------------

    // Hero Image

    // ---------------------------------------

    if (heroImageEl) {

        heroImageEl.src = image;

        heroImageEl.alt = blog.blogTitle;

    }

    // ---------------------------------------

    // Blog HTML

    // ---------------------------------------

    if (htmlEl) {

        htmlEl.innerHTML =

            blog.blogDescription || "";

    }

    // ---------------------------------------

    // Breadcrumb

    // ---------------------------------------

    if (breadcrumbEl) {

        breadcrumbEl.innerHTML = `

            <a href="/">Home</a>

            <span>/</span>

            <a href="/blogs">Blogs</a>

            <span>/</span>

            <span>${escapeHTML(blog.blogTitle)}</span>

        `;

    }

    // ---------------------------------------

    // Scroll Top

    // ---------------------------------------

    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

}
// ===========================================
// LOAD RELATED BLOGS
// ===========================================

async function loadRelatedBlogs(category) {

    if (!relatedGrid) {

        console.log("Related Blog Container Not Found");

        return;

    }

    try {

        relatedGrid.innerHTML = "<p>Loading Related Blogs...</p>";

        const response = await fetch(

            `${API_BASE}/get-blogs?page=0&size=6`

        );

        const data = await response.json();

        if (!data.body || !data.body.length) {

            relatedGrid.innerHTML = "";

            return;

        }

        let related = data.body.filter((blog) => {

            // Skip Current Blog

            if (blog.blogTitle === currentBlog.blogTitle) {

                return false;

            }

            // Same Category

            if (

                blog.blogCategory &&

                currentBlog.blogCategory &&

                blog.blogCategory === currentBlog.blogCategory

            ) {

                return true;

            }

            return false;

        });

        // If category has less than 3 blogs

        if (related.length < 3) {

            related = data.body.filter((blog) =>

                blog.blogTitle !== currentBlog.blogTitle

            );

        }

        related = related.slice(0, 3);

        renderRelatedBlogs(related);

    }

    catch (error) {

        console.error("Related Blogs Error :", error);

        relatedGrid.innerHTML = "";

    }

}

// ===========================================
// RENDER RELATED BLOGS
// ===========================================

function renderRelatedBlogs(blogs) {

    if (!relatedGrid) return;

    relatedGrid.innerHTML = "";

    blogs.forEach((blog) => {

        const image = getImage(blog);

        const date = formatDate(blog.postDate);

        const synopsis =

            blog.synopsis ||

            "Click Read More to explore the complete article.";

        const slug =

            blog.blogUrl ?

            blog.blogUrl.split("/").pop()

            : "";

        relatedGrid.innerHTML += `

<div class="related-card">

    <div class="related-image">

        <img

            src="${image}"

            alt="${escapeHTML(blog.blogTitle)}"

            loading="lazy"

            onerror="this.onerror=null;this.src='https://placehold.co/800x500?text=No+Image';"

        >

    </div>

    <div class="related-content">

        <div class="related-date">

            ${date}

        </div>

        <h3>

            ${

                blog.blogTitle.length > 70

                ?

                blog.blogTitle.substring(0,70) + "..."

                :

                blog.blogTitle

            }

        </h3>

        <p>

            ${

                synopsis.length > 120

                ?

                synopsis.substring(0,120) + "..."

                :

                synopsis

            }

        </p>

        <a href="/blog-details?slug=${slug}">

            Read More →

        </a>

    </div>

</div>

`;

    });

}
// ===========================================
// READING TIME
// ===========================================

function calculateReadingTime() {

    if (!htmlEl) return;

    const text = htmlEl.innerText || htmlEl.textContent || "";

    const words = text.trim().split(/\s+/).length;

    const minutes = Math.max(1, Math.ceil(words / 200));

    console.log("Reading Time:", minutes + " min");

}

// ===========================================
// COPY LINK
// ===========================================

function copyBlogLink() {

    navigator.clipboard.writeText(window.location.href);

    alert("Blog link copied successfully.");

}

// ===========================================
// SHARE
// ===========================================

function shareOnLinkedIn() {

    window.open(

        `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`,

        "_blank"

    );

}

function shareOnTwitter() {

    window.open(

        `https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}`,

        "_blank"

    );

}

function shareOnFacebook() {

    window.open(

        `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`,

        "_blank"

    );

}

// ===========================================
// SCROLL TOP
// ===========================================

function scrollTopPage(){

    window.scrollTo({

        top:0,

        behavior:"smooth"

    });

}

// ===========================================
// EVENTS
// ===========================================

document.addEventListener("DOMContentLoaded",()=>{

    console.log("Blog Details Ready");

    loadBlog();

});

// ===========================================
// OPTIONAL GLOBAL FUNCTIONS
// ===========================================

window.copyBlogLink = copyBlogLink;

window.shareOnLinkedIn = shareOnLinkedIn;

window.shareOnTwitter = shareOnTwitter;

window.shareOnFacebook = shareOnFacebook;

window.scrollTopPage = scrollTopPage;

// ===========================================
// AFTER BLOG LOAD
// ===========================================

const originalRenderBlog = renderBlog;

renderBlog = function(blog){

    originalRenderBlog(blog);

    calculateReadingTime();

};