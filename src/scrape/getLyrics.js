import * as cheerio from "cheerio";
import axios from "axios";
const searchUrl = "https://api.genius.com/search?q=";
/**
 * @param {{apiKey: string, title: string, artist: string, authHeader: boolean}} options
 */
export const getLyrics = async function (options) {
  try {
    let { apiKey, title, artist } = options;
    const song = `${title} ${artist}`;
    const reqUrl = `${searchUrl}${encodeURIComponent(song)}`;
    const headers = {
      Authorization: "Bearer " + apiKey,
    };
    let searchList = await axios.get(reqUrl, { headers });
    if (searchList.data.response.hits.length === 0) return null;
    const results = searchList.data.response.hits.map((val) => {
      const { full_title, url } = val.result;
      return { full_title, url };
    });

    let htmlBody = await axios.get(results[0].url);
    const $ = cheerio.load(htmlBody.data);
    let lyricsContainer = $('div[class="lyrics"]').text().trim();
    let lyrics = "";
    if (!lyricsContainer) {
      $('div[class^="Lyrics__Container"]').each((i, elem) => {
        if ($(elem).text().length !== 0) {
          let snippet = $(elem)
            .html()
            .replace(/<br>/g, "\n")
            .replace(/<(?!\s*br\s*\/?)[^>]+>/gi, "");
          lyrics += $("<textarea/>").html(snippet).text().trim() + "\n\n";
        }
      });
    }
    if (!lyrics) return null;
    return lyrics.trim();
  } catch (e) {
    throw e;
  }
};
