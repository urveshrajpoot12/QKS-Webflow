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

            <h3>${blog.blogTitle}</h3>

            <p>${synopsis}</p>

            <div class="blog-bottom">

                <span class="author">${author}</span>

                <a href="${blogUrl}" target="_blank">
                    Read More →
                </a>

            </div>

        </div>

    </div>

</div>
`;