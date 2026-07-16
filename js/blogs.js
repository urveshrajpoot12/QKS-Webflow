console.log("BLOGS JS PRODUCTION V3");

/* ==============================
   CONFIG
============================== */

const API_BASE = "https://backend.qksgroup.com/get-blogs";

let currentPage = 0;
const pageSize = 9;

let currentKeyword = "";
let currentStartDate = "";
let currentEndDate = "";

let allBlogs = [];
let totalPages = 0;


/* ==============================
   LOAD BLOGS
============================== */

async function loadBlogs(
    page = 0,
    keyword = "",
    startDate = "",
    endDate = ""
) {

    const grid = document.getElementById("blogs-grid");

    if (!grid) {

        console.error("blogs-grid not found");

        return;

    }

    showLoader();

    try {

        let url =
`${API_BASE}?page=${page}&size=${pageSize}`;

        if(keyword){

            url += `&keyword=${encodeURIComponent(keyword)}`;

        }

        if(startDate){

            url += `&startDate=${startDate}`;

        }

        if(endDate){

            url += `&endDate=${endDate}`;

        }

        console.log(url);

        const response = await fetch(url);

        const data = await response.json();

        console.log("API Response",data);

        allBlogs = data.body || [];

        totalPages = data.totalPages || 1;

        renderCards(allBlogs);

        renderPagination();

    }

    catch(error){

        console.error(error);

        showError();

    }

}
/* ==============================
   RENDER BLOGS
============================== */

function renderCards(blogs){

    const grid =
    document.getElementById("blogs-grid");

    grid.innerHTML = "";

    if(!blogs.length){

        showNoResult();

        return;

    }

    let html = "";

    blogs.forEach((blog)=>{

        const image =

        blog.cardImageDetailsDto?.thumbnail ||

        blog.cardImageDetailsDto?.medium ||

        blog.cardImageDetailsDto?.small ||

        "";

        const date =

        new Date(blog.postDate);

        const formattedDate =

        date.toLocaleDateString("en-GB");

        const synopsis =

        blog.synopsis ||

        "Click Read More to explore the complete article.";

        const author =

        blog.postAuthor ||

        "QKS Group";

        const slug =

        blog.blogUrl

        ? blog.blogUrl.split("/").pop()

        : "";

        const blogUrl =

        `/blog-details?slug=${slug}`;

        html += `

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

<span class="blog-badge">

Blog

</span>

<span class="blog-date">

${formattedDate}

</span>

</div>

<div class="blog-info">

<h3>

${

blog.blogTitle.length>80

?

blog.blogTitle.substring(0,80)+"..."

:

blog.blogTitle

}

</h3>

<p>

${

synopsis.length>140

?

synopsis.substring(0,140)+"..."

:

synopsis

}

</p>

<div class="blog-bottom">

<span class="author">

${author}

</span>

<a

href="${blogUrl}"

>

Read More →

</a>

</div>

</div>

</div>

</div>

`;

    });

    grid.innerHTML = html;

}
/* ==============================
   LOADER
============================== */

function showLoader(){

const grid=document.getElementById("blogs-grid");

grid.innerHTML=`

<div class="loading-wrapper">

Loading Blogs...

</div>

`;

}

/* ==============================
   NO RESULT
============================== */

function showNoResult(){

const grid=document.getElementById("blogs-grid");

grid.innerHTML=`

<div class="no-blog">

No Blogs Found

</div>

`;

}

/* ==============================
   ERROR
============================== */

function showError(){

const grid=document.getElementById("blogs-grid");

grid.innerHTML=`

<div class="no-blog">

Unable to load blogs.

</div>

`;

}
/* ==========================================
   PAGINATION
========================================== */

function renderPagination() {

    const pagination =
        document.getElementById("pagination");

    if (!pagination) return;

    pagination.innerHTML = "";

    if (totalPages <= 1) return;

    let html = "";

    html += `
        <button
            class="page-btn"
            ${currentPage === 0 ? "disabled" : ""}
            data-page="${currentPage - 1}"
        >
            ← Previous
        </button>
    `;

    for (let i = 0; i < totalPages; i++) {

        html += `
            <button
                class="page-btn ${i === currentPage ? "active" : ""}"
                data-page="${i}"
            >
                ${i + 1}
            </button>
        `;

    }

    html += `
        <button
            class="page-btn"
            ${currentPage === totalPages - 1 ? "disabled" : ""}
            data-page="${currentPage + 1}"
        >
            Next →
        </button>
    `;

    pagination.innerHTML = html;

    pagination
        .querySelectorAll(".page-btn")
        .forEach((button) => {

            button.addEventListener("click", () => {

                if (button.disabled) return;

                currentPage =
                    Number(button.dataset.page);

                loadBlogs(
                    currentPage,
                    currentKeyword,
                    currentStartDate,
                    currentEndDate
                );

                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });

            });

        });

}

/* ==========================================
   SEARCH
========================================== */

function initSearch() {

    const searchInput =
        document.getElementById("search-input");

    const searchButton =
        document.getElementById("search-button");

    if (!searchInput || !searchButton) {

        console.warn("Search elements not found");

        return;

    }

    searchButton.addEventListener("click", () => {

        currentKeyword =
            searchInput.value.trim();

        currentPage = 0;

        loadBlogs(
            currentPage,
            currentKeyword,
            currentStartDate,
            currentEndDate
        );

    });

    searchInput.addEventListener("keypress", (e) => {

        if (e.key !== "Enter") return;

        currentKeyword =
            searchInput.value.trim();

        currentPage = 0;

        loadBlogs(
            currentPage,
            currentKeyword,
            currentStartDate,
            currentEndDate
        );

    });

}

/* ==========================================
   DATE FILTER
========================================== */

function initDateFilter() {

    const start =
        document.getElementById("start-date");

    const end =
        document.getElementById("end-date");

    if (!start || !end) {

        console.warn("Date filter not found");

        return;

    }

    start.addEventListener("change", () => {

        currentStartDate = start.value;

        loadBlogs(
            0,
            currentKeyword,
            currentStartDate,
            currentEndDate
        );

    });

    end.addEventListener("change", () => {

        currentEndDate = end.value;

        loadBlogs(
            0,
            currentKeyword,
            currentStartDate,
            currentEndDate
        );

    });

}

/* ==========================================
   DOM READY
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    console.log("Blogs Page Ready");

    initSearch();

    initDateFilter();

    loadBlogs();

});