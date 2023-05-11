<script>
    let textInput // all tekst i textarea
    let items = [] // lista av objekter med ferdig data å faktisk liste ut
    let mode // annonse eller artikkel for riktig skraping og utlisting
    let loading = false // spinner, yo
    let renderedList // div-en som tegnes ut, referanse for kopiering

    // klikk på start-knapp
    function start () {
        loading = true
        mode = getMode()
        items = []

        getItems(textInput.split("\n")) // skrap URL-er fra hver linje i textarea
        .then(() => {
            console.log("👍", mode, items)
            loading = false
        })
    }

    // start skraping gjennom API
    async function getItems(urls) {
        for (const url of urls) {
            const response = await fetch(`/api/?url=${(url)}&mode=${(mode)}`)
            const data = await response.json();
            items = [...items, data] // kan ikke bruke push om vil ha reaktivitet
        }
    }

    // automatisk riktig mode ut fra ord i første URL i lista
    function getMode() {
        if (textInput.split("\n")[0].search("/jobb/") > -1) {
            return "annonse"
        } else if (textInput.split("\n")[0].search("/artikkel/") > -1) { 
            return "artikkel"
        } else {
            return undefined
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
<textarea bind:value={textInput} rows="15" cols="120"/>

<h2>👇 lag og kopier liste:</h2>
<button on:click={ start }>📰 lag liste</button>
<button on:click={ copyList }>💘 kopier liste</button>

{#if textInput }
    <p>💡 antall linjer: {textInput.split("\n").length}</p>
{/if}

{#if loading && mode != undefined}
    <p>⏳ laster {mode} {items.length} / {textInput.split("\n").length} ... (eller feil, si)</p>
{/if}

<div bind:this={renderedList}> <!--- for kopiering -->  
    {#if mode == "artikkel"}
        {#each items as item}
            <b><a href = {item.url}>{item.title}</a></b>
            <p>{item.info}</p>
            <br>
        {/each}
    {/if}

    {#if mode == "annonse"}
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
        padding: 10px;
    }

    button {
        padding: 10px;
    }
</style>