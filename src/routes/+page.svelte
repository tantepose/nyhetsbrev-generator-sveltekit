<script>
    import axios from 'axios'; // hente HTML
    import * as cheerio from 'cheerio'; // navigere HTML

    let textInput // tekst fra bruker
    let items = [] // lista med ting liste ut
    let currentMode // "ad" eller "article", settes fra knapp trykka på
    let loading = false
    let listHTML

    // start skraping
    function scrape (mode) {
        currentMode = mode
        loading = true

        scrapeURLs(textInput.split("\n"), mode) 
        .then((newItems) => {
            items = newItems
            loading = false
        })
    }

    // faktisk skraping
    async function scrapeURLs(urls) {
        const newItems = []
        
        for (const url of urls) {
            console.log("🔍 skraper ", url)

            const response = await axios.get(url)
            const $ = cheerio.load(response.data)

            const item = {} // artikkel eller annonse å legge til i items-lista
            item.url = url

            if (currentMode == "article") {                 // skrape artikkel
                item.title = $('h1').first().text()     // tittel er første h1
                item.info = $('.standfirst').text()     // ingress har klassen standfirst
            } else if (currentMode == "ad") {           // skrape annonse
                item.info = $('.firstname').text()     // selskapet har klassen firstname
                item.title = $('h1').first().text()      // tittel er første h1
            }
            
            newItems.push(item) // legg til i lista
        }
    
        return newItems // ny liste klar
    }

    // kopifunksjon stjælt fra https://stackoverflow.com/questions/36639681/how-to-copy-text-from-a-div-to-clipboard
    function copyList () {
        var range = document.createRange();
        range.selectNode(listHTML);
        window.getSelection().removeAllRanges();
        window.getSelection().addRange(range);
        document.execCommand("copy"); // bør byttes med navigator.clipboard.writeText()
        window.getSelection().removeAllRanges();
    }

</script>

<h1>✍ nyhetsbrev-generator</h1>

<h2>👇 lim inn lenker til artikler eller annonser:</h2>
<textarea bind:value={textInput} rows="15" cols="90"/>

<h2>👇 trykk på riktig knapp for riktig liste:</h2>
<button on:click={ () => scrape("article")}>📰 lag artikkel-liste</button>
<button on:click={ () => scrape("ad")}>💰 lag annonse-liste</button>
<button on:click={ copyList }>💘 kopier liste</button>

{#if loading}
    <p>⏳ laster...</p>
{/if}

<div bind:this={listHTML}>
    {#if !loading && currentMode == "article"}
        {#each items as item}
            <b><a href = {item.url}>{item.title}</a></b>
            <p>{item.info}</p>
            <br>
        {/each}
    {/if}

    {#if !loading && currentMode == "ad"}
        <ul>
            {#each items as item}
                <li>{item.info}: <a href = {item.url}>{item.title}</a></li>
            {/each}
        </ul>
    {/if}
</div>

<style>
    :global(body) {
        background-color: steelblue;
        color: white;
        font-family: 'Courier New', Courier, monospace;
        padding: 1.5em;
    }

    h1 {
        font-size: 3em;
    }

    h2 {
        font-size: 1.5em;
        font-weight: normal;
    }

    a {
        color: white;
    }

    textarea {
        white-space: pre;
        overflow-wrap: normal;
        overflow-x: scroll;
    }
</style>