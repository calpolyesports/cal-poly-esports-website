<script>
    export let articles;

    let mainArticle = articles[0];
    let sideArticles = articles.slice(1, 4);
</script>

<div class="news-feed">
    {#if mainArticle}
        <a href="{mainArticle.link}" class="main-article">
            <h2>{mainArticle.title}</h2>
            <p>{mainArticle.summary}</p>
        </a>
    {/if}
    {#if sideArticles}
        <div class="side-articles">
            {#each sideArticles as article}
                <a href="{article.link}" class="side-article">
                    <h3>{article.title}</h3>
                    <p>{article.summary}</p>
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
    
    div.news-feed a.main-article {
        width: 60%;
        height: 100%;
        margin-right: 0.5rem;
        background-color: #aaa;
        text-decoration: none;
        color: #000;
    }
    
    div.news-feed a.main-article h2 {
        margin: 1rem;
        font-size: 2.5rem;
    }
    
    div.news-feed a.main-article p {
        margin: 1rem;
        font-size: 1.5rem;
    }
    
    div.news-feed div.side-articles {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        width: 40%;
        height: 100%;
        margin-left: 0.5rem;
    }
    
    div.news-feed div.side-articles a.side-article {
        width: 100%;
        height: 100%;
        background-color: #aaa;
        margin: 0.5rem 0;
        text-decoration: none;
        color: #000;
    }

    div.news-feed div.side-articles a.side-article:first-child {
        margin-top: 0;
    }

    div.news-feed div.side-articles a.side-article:last-child {
        margin-bottom: 0;
    }
    
    div.news-feed div.side-articles a.side-article h3 {
        margin: 1rem;
        font-size: 2rem;
    }    

    div.news-feed div.side-articles a.side-article p {
        margin: 1rem;
        font-size: 1.2rem;
    }
</style>
