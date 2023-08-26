import * as cheerio from 'cheerio';

/**
 * @param {{ apiKey: string, title: string, artist: string, authHeader: boolean }} options
 */
export const getLyrics = async function (options) {
  try {
    const searchUrl = 'https://api.genius.com/search?q='; // Define the search URL here
    let { apiKey, title, artist } = options;
    const song = `${title} ${artist}`;
    const reqUrl = `${searchUrl}${encodeURIComponent(song)}`;
    const headers = new Headers({
      Authorization: 'Bearer ' + apiKey,
    });

    let searchListResponse = await fetch(reqUrl, { headers });
    let searchListData = await searchListResponse.json();

    if (searchListData.response.hits.length === 0) return null;

    const results = searchListData.response.hits.map((val) => {
      const { full_title, url } = val.result;
      return { full_title, url };
    });

    let htmlBodyResponse = await fetch(results[0].url);
    let htmlBodyText = await htmlBodyResponse.text();
    const $ = cheerio.load(htmlBodyText);

    let lyricsContainer = $('div[class="lyrics"]').text().trim();
    let lyrics = '';

    if (!lyricsContainer) {
      $('div[class^="Lyrics__Container"]').each((i, elem) => {
        if ($(elem).text().length !== 0) {
          let snippet = $(elem)
            .html()
            .replace(/<br>/g, '\n')
            .replace(/<(?!\s*br\s*\/?)[^>]+>/gi, '');
          lyrics += $('<textarea/>').html(snippet).text().trim() + '\n\n';
        }
      });
    }

    if (!lyrics) return null;
    return lyrics.trim();
  } catch (e) {
    throw e;
  }
};
