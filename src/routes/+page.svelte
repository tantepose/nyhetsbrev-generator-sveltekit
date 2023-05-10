<script>
    let textInput // all tekst i textarea
    let items = [] // lista av objekter med ferdig data å faktisk liste ut
    let mode // "ad" eller "article" for riktig skraping og utlisting
    let loading = false // spinner, yo
    let renderedList // div-en som tegnes ut, referanse for kopiering

    // klikk på lag liste-knapp
    function start () {
        loading = true

        scrapeURLs(textInput.split("\n")) // skrap URL-er fra hver linje i textarea
        .then((newItems) => { // skraping ferdig, bruk data
            items = newItems
            loading = false
        })
    }

    // faktisk skraping
    async function scrapeURLs(urls) {
        getMode()

        const newItems = []
        
        for (const url of urls) {
            const response = await fetch(`/api/?url=${(url)}&mode=${(mode)}`)
            const data = await response.json();
            newItems.push(data)
        }
    
        return newItems
    }

    // automatisk riktig mode ut fra første URL i lista
    function getMode() {
        const check = textInput.split("\n")[0].search("/jobb/") // søk etter "/jobb/" i første input-linje

        if (check > -1) { // fant "/jobb/"
            mode = "ad"
            return "ad"
        } else {
            mode = "article"
            return "article"
        }
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

<h2>👇 lim inn annonse- eller artikkel-lenker:</h2>
<textarea bind:value={textInput} rows="15" cols="90"/>

<h2>👇 lag og kopier liste:</h2>
<button on:click={ start }>📰 lag liste</button>
<button on:click={ copyList }>💘 kopier liste</button>

{#if loading}
    <p>⏳ laster... (eller feil, si)</p>
{/if}

<div bind:this={renderedList}>
    {#if !loading && mode == "article"}
        {#each items as item}
            <b><a href = {item.url}>{item.title}</a></b>
            <p>{item.info}</p>
            <br>
        {/each}
    {/if}

    {#if !loading && mode == "ad"}
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