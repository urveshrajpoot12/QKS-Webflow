console.log("BLOG DETAILS PRODUCTION V3");

//======================================================
// CONFIG
//======================================================

const API_BASE = "https://backend.qksgroup.com";

const params = new URLSearchParams(window.location.search);

const blogId = params.get("id");

console.log("Blog ID :", blogId);

let currentBlog = null;


//======================================================
// DOM
//======================================================

const titleEl = document.getElementById("blog-title");

const dateEl = document.getElementById("blog-date");

const authorEl = document.getElementById("blog-author");

const categoryEl = document.getElementById("blog-category");

const heroImageEl = document.getElementById("hero-image");

const htmlEl = document.getElementById("blog-html");

const breadcrumbEl = document.getElementById("blog-breadcrumb");

const relatedGrid = document.getElementById("related-blogs");


//======================================================
// VALIDATION
//======================================================

if (!blogId) {

    console.error("Blog ID Missing");

    if (titleEl) {

        titleEl.innerHTML = "Blog Not Found";

    }

    throw new Error("Blog ID Missing");

}


//======================================================
// HELPERS
//======================================================

function formatDate(date) {

    if (!date) return "";

    return new Date(date).toLocaleDateString("en-GB", {

        day: "2-digit",

        month: "long",

        year: "numeric"

    });

}


function getImage(blog) {

    return (

        blog.cardImageDetailsDto?.large ||

        blog.cardImageDetailsDto?.medium ||

        blog.cardImageDetailsDto?.thumbnail ||

        blog.cardImageDetailsDto?.small ||

        "https://placehold.co/1200x700?text=No+Image"

    );

}


function escapeHTML(str) {

    if (!str) return "";

    return str

        .replace(/&/g, "&amp;")

        .replace(/</g, "&lt;")

        .replace(/>/g, "&gt;")

        .replace(/"/g, "&quot;")

        .replace(/'/g, "&#039;");

}


//======================================================
// LOADING
//======================================================

function showLoading() {

    if (titleEl) {

        titleEl.innerHTML = "Loading Blog...";

    }

}


function showError(message) {

    console.error(message);

    if (titleEl) {

        titleEl.innerHTML = message;

    }

}


//======================================================
// SEO
//======================================================

function updateSEO(blog) {

    document.title = `${blog.blogTitle} | QKS Group`;

    let meta = document.querySelector('meta[name="description"]');

    if (!meta) {

        meta = document.createElement("meta");

        meta.name = "description";

        document.head.appendChild(meta);

    }

    meta.content =

        blog.synopsis ||

        "Latest insights from QKS Group.";

}


//======================================================
// LOAD BLOG
//======================================================

async function loadBlog() {

    try {

        showLoading();

        console.log("Fetching Blog ID :", blogId);

        const response = await fetch(

            `${API_BASE}/get-single-blog?id=${blogId}`

        );

        if (!response.ok) {

            throw new Error("Unable to fetch blog");

        }

        const data = await response.json();

        console.log("Single Blog API :", data);

        if (!data.body) {

            showError("Blog Not Found");

            return;

        }

        currentBlog = data.body;

        renderBlog(currentBlog);

        updateSEO(currentBlog);

        loadRelatedBlogs(currentBlog.blogCategory);

    }

    catch (error) {

        console.error(error);

        showError("Unable to load blog.");

    }

}


//======================================================
// RENDER BLOG
//======================================================

function renderBlog(blog) {

    const image = getImage(blog);

    const formattedDate = formatDate(blog.postDate);

    if (titleEl) {

        titleEl.innerHTML = blog.blogTitle;

    }

    if (dateEl) {

        dateEl.innerHTML = formattedDate;

    }

    if (authorEl) {

        authorEl.innerHTML =

            blog.postAuthor ||

            "QKS Group";

    }

    if (categoryEl) {

        categoryEl.innerHTML =

            blog.blogCategory ||

            "Blog";

    }

    if (heroImageEl) {

        heroImageEl.src = image;

        heroImageEl.alt = blog.blogTitle;

    }

    if (htmlEl) {

        htmlEl.innerHTML =

            blog.blogDescription ||

            "";

    }

    if (breadcrumbEl) {

        breadcrumbEl.innerHTML = `

<a href="/">Home</a>

<span> / </span>

<a href="/blogs">Blogs</a>

<span> / </span>

<span>${escapeHTML(blog.blogTitle)}</span>

`;

    }

    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

}
//======================================================
// LOAD RELATED BLOGS
//======================================================

async function loadRelatedBlogs(category) {

    if (!relatedGrid) {

        console.log("Related Blog Container Not Found");

        return;

    }

    try {

        relatedGrid.innerHTML = "<p>Loading Related Blogs...</p>";

        const response = await fetch(

            `${API_BASE}/get-blogs?page=0&size=20`

        );

        const data = await response.json();

        if (!data.body || !data.body.length) {

            relatedGrid.innerHTML = "";

            return;

        }

        //------------------------------------------------
        // Same Category Blogs
        //------------------------------------------------

        let related = data.body.filter((blog) => {

            if (blog.id === currentBlog.id) {

                return false;

            }

            return (

                blog.blogCategory &&

                currentBlog.blogCategory &&

                blog.blogCategory === currentBlog.blogCategory

            );

        });

        //------------------------------------------------
        // Fallback Latest Blogs
        //------------------------------------------------

        if (related.length < 3) {

            related = data.body.filter((blog) => {

                return blog.id !== currentBlog.id;

            });

        }

        related = related.slice(0,3);

        renderRelatedBlogs(related);

    }

    catch(error){

        console.error("Related Blogs Error :",error);

        relatedGrid.innerHTML = "";

    }

}



//======================================================
// RENDER RELATED BLOGS
//======================================================

function renderRelatedBlogs(blogs){

    if(!relatedGrid) return;

    let html = "";

    blogs.forEach((blog)=>{

        const image = getImage(blog);

        const date = formatDate(blog.postDate);

        const synopsis =

            blog.synopsis ||

            "Click Read More to explore the complete article.";

        html += `

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

                blog.blogTitle.substring(0,70)+"..."

                :

                blog.blogTitle

            }

        </h3>

        <p>

            ${

                synopsis.length > 120

                ?

                synopsis.substring(0,120)+"..."

                :

                synopsis

            }

        </p>

        <a href="/blog-details?id=${blog.id}">

            Read More →

        </a>

    </div>

</div>

`;

    });

    relatedGrid.innerHTML = html;

}
//======================================================
// READING TIME
//======================================================

function calculateReadingTime() {

    if (!htmlEl) return;

    const text = htmlEl.innerText || htmlEl.textContent || "";

    const words = text.trim().split(/\s+/).filter(Boolean).length;

    const minutes = Math.max(1, Math.ceil(words / 200));

    const readingTimeEl = document.getElementById("reading-time");

    if (readingTimeEl) {

        readingTimeEl.innerHTML = `${minutes} min read`;

    }

    console.log("Reading Time :", minutes + " min");

}



//======================================================
// COPY LINK
//======================================================

function copyBlogLink() {

    navigator.clipboard.writeText(window.location.href);

    alert("Blog link copied successfully.");

}



//======================================================
// SHARE
//======================================================

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



//======================================================
// SCROLL TO TOP
//======================================================

function scrollTopPage() {

    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

}



//======================================================
// PREVIOUS / NEXT BLOG
//======================================================

async function loadPrevNextBlogs() {

    try {

        const response = await fetch(

            `${API_BASE}/get-blogs?page=0&size=100`

        );

        const data = await response.json();

        if (!data.body || !data.body.length) return;

        const blogs = data.body;

        const index = blogs.findIndex(

            b => b.id == currentBlog.id

        );

        //------------------------------------------------

        // Previous

        //------------------------------------------------

        const prevBtn = document.getElementById("prev-blog");

        if (prevBtn && index > 0) {

            prevBtn.href = `/blog-details?id=${blogs[index - 1].id}`;

            prevBtn.style.display = "inline-flex";

        }

        //------------------------------------------------

        // Next

        //------------------------------------------------

        const nextBtn = document.getElementById("next-blog");

        if (nextBtn && index < blogs.length - 1) {

            nextBtn.href = `/blog-details?id=${blogs[index + 1].id}`;

            nextBtn.style.display = "inline-flex";

        }

    }

    catch (error) {

        console.error("Prev / Next Error :", error);

    }

}



//======================================================
// AFTER BLOG RENDER
//======================================================

const originalRenderBlog = renderBlog;

renderBlog = function(blog) {

    originalRenderBlog(blog);

    calculateReadingTime();

    loadPrevNextBlogs();

};



//======================================================
// PAGE READY
//======================================================

document.addEventListener("DOMContentLoaded", () => {

    console.log("BLOG DETAILS READY");

    loadBlog();

});



//======================================================
// GLOBAL FUNCTIONS
//======================================================

window.copyBlogLink = copyBlogLink;

window.shareOnLinkedIn = shareOnLinkedIn;

window.shareOnTwitter = shareOnTwitter;

window.shareOnFacebook = shareOnFacebook;

window.scrollTopPage = scrollTopPage;
//======================================================
// CANONICAL URL
//======================================================

function updateCanonical() {

    let canonical = document.querySelector("link[rel='canonical']");

    if (!canonical) {

        canonical = document.createElement("link");

        canonical.rel = "canonical";

        document.head.appendChild(canonical);

    }

    canonical.href = window.location.href;

}



//======================================================
// OPEN GRAPH META
//======================================================

function updateOpenGraph(blog) {

    const image = getImage(blog);

    const description =

        blog.synopsis ||

        "Latest insights from QKS Group.";

    const metas = [

        {

            property: "og:title",

            content: blog.blogTitle

        },

        {

            property: "og:description",

            content: description

        },

        {

            property: "og:image",

            content: image

        },

        {

            property: "og:url",

            content: window.location.href

        },

        {

            property: "og:type",

            content: "article"

        }

    ];

    metas.forEach(item=>{

        let tag = document.querySelector(

            `meta[property="${item.property}"]`

        );

        if(!tag){

            tag = document.createElement("meta");

            tag.setAttribute("property",item.property);

            document.head.appendChild(tag);

        }

        tag.content = item.content;

    });

}



//======================================================
// TWITTER META
//======================================================

function updateTwitter(blog){

    const image = getImage(blog);

    const metas = [

        {

            name:"twitter:card",

            content:"summary_large_image"

        },

        {

            name:"twitter:title",

            content:blog.blogTitle

        },

        {

            name:"twitter:description",

            content:blog.synopsis ||

            ""

        },

        {

            name:"twitter:image",

            content:image

        }

    ];

    metas.forEach(item=>{

        let tag = document.querySelector(

            `meta[name="${item.name}"]`

        );

        if(!tag){

            tag = document.createElement("meta");

            tag.name=item.name;

            document.head.appendChild(tag);

        }

        tag.content=item.content;

    });

}



//======================================================
// JSON-LD
//======================================================

function addStructuredData(blog){

    const old=document.getElementById("blog-jsonld");

    if(old){

        old.remove();

    }

    const script=document.createElement("script");

    script.type="application/ld+json";

    script.id="blog-jsonld";

    script.innerHTML=JSON.stringify({

        "@context":"https://schema.org",

        "@type":"BlogPosting",

        headline:blog.blogTitle,

        image:getImage(blog),

        author:{

            "@type":"Person",

            name:blog.postAuthor ||

            "QKS Group"

        },

        datePublished:new Date(

            blog.postDate

        ).toISOString(),

        publisher:{

            "@type":"Organization",

            name:"QKS Group"

        },

        description:

        blog.synopsis ||

        ""

    });

    document.head.appendChild(script);

}



//======================================================
// IMAGE OPTIMIZATION
//======================================================

function optimizeImages(){

    document

    .querySelectorAll("img")

    .forEach(img=>{

        img.loading="lazy";

        img.decoding="async";

    });

}



//======================================================
// FADE ANIMATION
//======================================================

function animatePage(){

    document.body.classList.add(

        "blog-loaded"

    );

}



//======================================================
// AFTER BLOG RENDER
//======================================================

const previousRender = renderBlog;

renderBlog=function(blog){

    previousRender(blog);

    updateCanonical();

    updateOpenGraph(blog);

    updateTwitter(blog);

    addStructuredData(blog);

    optimizeImages();

    animatePage();

};



//======================================================
// FINAL LOG
//======================================================

console.log(

"BLOG DETAILS PRODUCTION V3 LOADED"

);