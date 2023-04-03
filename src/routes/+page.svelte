<script>
    import axios from 'axios'; // hente HTML, bør byttes med fetch
    import * as cheerio from 'cheerio'; // navigere HTML

    let textInput // tekst textarea
    let items = [] // lista med ferdig data å faktisk liste ut
    let currentMode // "ad" eller "article", settes fra knapp trykka på
    let loading = false // spinner, yo
    let renderedList // div-en som tegnes ut, for kopiering

    // klikk fra bruker
    function start (mode) {
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

            const item = {}
            item.url = url

            if (currentMode == "article") {
                item.title = $('h1').first().text()
                item.info = $('.standfirst').text()
            } else if (currentMode == "ad") {
                item.info = $('.firstname').text()
                item.title = $('h1').first().text()
            }
            
            newItems.push(item)
        }
    
        return newItems
    }

    // kopifunksjon stjælt fra https://stackoverflow.com/questions/36639681/how-to-copy-text-from-a-div-to-clipboard
    function copyList () {
        var range = document.createRange();
        range.selectNode(renderedList);
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
<button on:click={ () => start("article")}>📰 lag artikkel-liste</button>
<button on:click={ () => start("ad")}>💰 lag annonse-liste</button>
<button on:click={ copyList }>💘 kopier liste</button>

{#if loading}
    <p>⏳ laster...</p>
{/if}

<div bind:this={renderedList}>
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