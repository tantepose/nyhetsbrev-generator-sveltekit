import axios from 'axios'; // hente HTML, bør byttes med fetch
import * as cheerio from 'cheerio'; // navigere HTML
import { json } from '@sveltejs/kit';

export async function GET({ url }) {
  const target = url.searchParams.get('url') 
  const mode = url.searchParams.get('mode')

  const response = await axios.get(target)
  const $ = cheerio.load(response.data)

  console.log("💭 API: skraping starta av " + target + ", med modus: " + mode)

  const item = {}
  
  item.url = target
  item.title = $('h1').first().text()

  if (mode == "artikkel") {
    item.info = $('.standfirst').text()
  } else if (mode == "annonse") {
    item.info = $('.firstname').text()
  }

  console.log("💭 API: returnerer", item)
  return json(item)
}