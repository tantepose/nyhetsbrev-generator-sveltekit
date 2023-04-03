<script>
    import axios from 'axios'; // hente HTML
    import * as cheerio from 'cheerio'; // navigere HTML

    let textInput // tekst fra bruker
    let items = [] // lista med ting liste ut
    let currentMode // "ad" eller "article", settes fra knapp trykka på

    // start skraping
    function scrape (mode) {
        currentMode = mode

        scrapeURLs(textInput.split("\n"), mode) 
            .then(newItems => items = newItems)
    }

    // faktisk skraping
    async function scrapeURLs(urls, mode) {
        const newItems = []
        
        for (const url of urls) {
            console.log("🔍📰 skraper ", url)

            const respons = await axios.get(url)
            const $ = cheerio.load(respons.data)

            const item = {} // artikkel eller annonse å legge til i items-lista
            item.url = url

        if (currentMode == "article") {                 // skrape artikkel
                item.title = $('h1').first().text()     // tittel er første h1
                item.info = $('.standfirst').text()     // ingress har klassen standfirst
            } else if (currentMode == "ad") {           // skrape annonse
                item.title = $('.firstname').text()     // selskapet har klassen firstname
                item.info = $('h1').first().text()      // tittel er første h1
            }
            
            newItems.push(item) // legg til i lista
        }
    
        return newItems // ny liste klar
    }

</script>

<h1>✍ nyhetsbrev-generator</h1>

<p>#1: lim inn lenker til artikler eller annonser:</p>
<textarea bind:value={textInput} />

<p>#2: trykk på riktig knapp for riktig liste:</p>
<button on:click={ () => scrape("article")}>📰 lag artikkel-liste</button>
<button on:click={ () => scrape("ad")}>💰 lag annonse-liste</button>

<p>#3: liste:</p>

{#if currentMode == "article"}
    {#each items as item}
        <a href = {item.url}>{item.title}</a>
        <p>{item.info}</p>
        <br><br/>
    {/each}
{/if}

{#if currentMode == "ad"}
    <ul>
        {#each items as item}
            <li>{item.info}: <a href = {item.url}>{item.title}</a></li>
        {/each}
    </ul>
{/if}

<style>
    :global(body) {
        background-color: steelblue;
        color: white;
    }

    textarea {
        white-space: pre;
        overflow-wrap: normal;
        overflow-x: scroll;
    }
</style>