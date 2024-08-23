<script>
    export let articles;

    let mainArticle = articles[0];
    let sideArticles = articles.slice(1, 3);
</script>

<div class="news-feed">
    {#if mainArticle}
        <a href="{mainArticle.link}" class="article main-article">
            <img src="{mainArticle.image}" alt="{mainArticle.title}" />
            <div class="bottom-shadow"></div>
            <div class="article-text">
                <h2>{mainArticle.title}</h2>
                <p>{mainArticle.summary}</p>
            </div>
        </a>
    {/if}
    {#if sideArticles}
        <div class="side-articles">
            {#each sideArticles as article}
                <a href="{article.link}" class="article side-article">
                    <img src="{article.image}" alt="{article.title}" />
                    <div class="bottom-shadow"></div>
                    <div class="article-text">
                        <h3>{article.title}</h3>
                        <p>{article.summary}</p>
                    </div>
                </a>
            {/each}
        </div>
    {/if}
</div>

<style>
    div.news-feed {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        height: 30rem;
        width: 100%;
        margin: 0;
    }

    a.article {
        position: relative;
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        text-decoration: none;
        color: var(--neutral-bright);
    }
    
    a.main-article {
        width: 60%;
        height: 100%;
        margin-right: 0.5rem;
    }
    
    a.main-article h2 {
        margin: 0 1rem;
        font-size: 2.5rem;
    }
    
    a.main-article p {
        margin: 0 1rem;
        font-size: 1.5rem;
    }
    
    div.side-articles {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        width: 40%;
        height: 100%;
        margin-left: 0.5rem;
    }
    
    a.side-article {
        width: 100%;
        height: 100%;
        margin: 0.5rem 0;
    }

    a.side-article:first-child {
        margin-top: 0;
    }

    a.side-article:last-child {
        margin-bottom: 0;
    }
    
    a.side-article h3 {
        margin: 0 1rem;
        font-size: 2rem;
    }    

    a.side-article p {
        margin: 0 1rem;
        font-size: 1.2rem;
    }
    
    img {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
        z-index: -1;
    }

    div.bottom-shadow {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(0deg, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0));
        z-index: 0;
    }

    div.article-text {
        position: relative;
        z-index: 1;
        margin-bottom: 1rem;
    }
</style>
