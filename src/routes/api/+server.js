import axios from 'axios'; // hente HTML, bør byttes med fetch
import * as cheerio from 'cheerio'; // navigere HTML
import { json } from '@sveltejs/kit';

export async function GET({ url }) {
  const target = url.searchParams.get('url') 
  const mode = url.searchParams.get('mode')

  const response = await axios.get(target)
  const $ = cheerio.load(response.data)

  console.log("💭 skraping starta av " + target + ", med modus: " + mode)

  const item = {}
  
  item.url = target

  if (mode == "artikkel") { // fra kode24.no
    item.info = $('.subtitle').text()
    item.title = $('h1').first().text()
  } else if (mode == "annonse") { // fra kodejobb.no
    item.title = $("title").text()
  }

  console.log("💭 returnerer: ", item)
  return json(item)
}
