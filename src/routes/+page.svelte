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
            console.log("✍ ", mode, items)
            loading = false
        })
    }

    // skraping gjennom API
    async function getItems(urls) {
        for (const url of urls) {
            const response = await fetch(`/api/?url=${(url)}&mode=${(mode)}`)
            const data = await response.json();
            items = [...items, data] // kan ikke bruke push om vil ha reaktivitet
        }
    }

    // automatisk riktig mode ut fra ord i første URL i lista
    function getMode() {
        if (textInput.split("\n")[0].search("kodejobb.no/") > -1) {
            return "annonse"
        } else if (textInput.split("\n")[0].search("kode24.no/") > -1) { 
            return "artikkel"
        } else {
            return undefined
        }
    }

    // stjælt fra https://stackoverflow.com/questions/36639681/how-to-copy-text-from-a-div-to-clipboard
    function copyList () {
        var range = document.createRange();
        range.selectNode(renderedList);
        window.getSelection().removeAllRanges();
        window.getSelection().addRange(range);
        document.execCommand("copy"); // bør byttes med navigator.clipboard.writeText()
        window.getSelection().removeAllRanges();
    }

    function getEmoji () { 
        // basert på https://erikmartinjordan.com/get-random-emoji-javascript
        let emojis = [
        '🍇','🍈','🍉','🍊','🍋','🍌','🍍','🥭','🍎','🍏','🍐','🍑','🍒','🍓','🥝','🍅',
        '🍦','🍧','🍨','🍩','🍪','🎂','🍰','🧁','🥧','🍫','🍬','🍭','🍮','🍯',
        '🐵','🐒','🦍','🦧','🐶','🐕','🐕‍🦺','🐩','🐺','🦊','🦝','🐱','🐈','🦁','🐯','🐅','🐆','🐴','🐎','🦄',
        '⚽','⚾','🥎','🏀','🏐','🏈','🏉','🎾','🥏','🎳','🏏','🏑','🏒','🥍','🏓','🏸','🥊','🥋','🥅','⛳','⛸','🎣','🤿','🎽','🎿','🛷','🥌',
        '📔','📕','📖','📗','📘','📙','📚','📓','📒','📃','📜','📄','📰','🗞','📑','🔖',
        '👓','🕶','🥽','🥼','🦺','👔','👕','👖','🧣','🧤','🧥','🧦','👗','👘','🥻','🩱','🩳','👙','👚','👛','👜','👝','🛍','🎒','👞','👟','🥾','🥿','👠','👡','🩰','👢','👑','👒','🎩','🎓','🧢','📿','💄','💍','💎',
        '🍼','🥛','☕','🍵','🍶','🍾','🍷','🍸','🍹','🍺','🍻','🥂','🥃','🥤','🧃','🧉','🧊',
        '🥑','🍆','🥔','🥕','🌽','🌶','🥒','🥬','🥦','🧄','🧅','🍄','🥜','🌰',
        '💐','🌸','💮','🌹','🥀','🌺','🌻','🌼','🌷',
        '🦃','🐔','🐓','🐣','🐤','🐥','🐦','🐧','🕊','🦅','🦆','🦢','🦉','🦩','🦚','🦜',
        '👶','🧒','👦','👧','🧑','👱','👨','🧔'
        ]

        return emojis[Math.floor(Math.random()*emojis.length)];
    }

</script>

<h1>✍ nyhetsbrev-generator</h1>

<h2>lim inn artikler <i>eller</i> annonser:</h2>
<textarea bind:value={textInput} rows="15" cols="120" placeholder="(hver URL på ny linje)"/>

<div>
    <button on:click={ start }>💪 lag liste</button>
    <button on:click={ copyList }>✍ kopier liste</button>
</div>

{#if textInput }
    <p><i>💡 antall lenker: {textInput.split("\n").length}</i></p>
{/if}

{#if loading && mode != undefined}
    <p>⏳ laster {mode} {items.length + 1} / {textInput.split("\n").length} ... (eller feil, si)</p>
{/if}

<div bind:this={renderedList}> <!--- for kopiering -->  
    {#if mode == "artikkel"}
        {#each items as item}
            <b>{getEmoji()} <a href = {item.url}>{item.title}</a></b>
            <p>{item.info}</p>
            <br>
        {/each}
    {/if}

    {#if mode == "annonse"}
        <ul>
            {#each items as item}
                <li><a href = {item.url}>{item.title}</a></li>
            {/each}
        </ul>
    {/if}
</div>

<style>
    :global(body) {
        background-color: #1f2430;
        color: #fff4c8;
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
        color: #ff9c48;
    }

    textarea {
        background-color: #404755;
        color: #fff4c8;
        border: none;
        resize: none;
        white-space: pre;
        overflow-wrap: normal;
        overflow-x: scroll;
        padding: 10px;
        overflow: hidden;

    }

    button {
        padding: 10px;
        margin: 10px;
        background-color: #404755;
        color: #ff9c48;
        font-family: 'Courier New', Courier, monospace;
        font-size: 1em;
        display: inline;
        width: 200px;
    }
</style>