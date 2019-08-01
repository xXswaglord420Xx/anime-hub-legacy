// @flow


export type Opts = {
  +trusted: boolean,
  +english: boolean
};

export type Torrent = {
  +magnetURL: string,
  +fileURL: string,
  +nyaaURL: string,
  +title: string,
  +date: Date,
  +trusted: boolean,
  +size: number,
  +seeds: number,
  +leeches: number
};

/**
 *
 * @type {string}
 */
const nyaaURL = 'https://nyaa.si';

const sizes = {
  Bytes: 1,
  KiB: 1024,
  MiB: 1024 * 1024,
  GiB: 1024 * 1024 * 1024,
  TiB: 1024 * 1024 * 1024 * 1024
};

async function search(term: string, opts?: Opts = {trusted: true, english: true}): Promise<string> {
  const f = opts.trusted ? '2' : '0';
  const c = opts.english ? '1_2' : '0_0';
  const url = new URL(nyaaURL);
  url.searchParams.append('f', f);
  url.searchParams.append('c', c);
  url.searchParams.append('q', term);

  const content = await fetch(url.toString());
  return content.text();
}

function rowToTorrent(row: HTMLElement): Torrent {
  const trusted = row.className === 'success';
  const english = row.querySelector('td a').getAttribute('href') === '1_2';
  const title = row
    .querySelectorAll('td')
    .item(1)
    .querySelector('a:not(.comments)').innerText;
  const magnetURL = row
    .querySelectorAll('td')
    .item(2)
    .querySelectorAll('a')
    .item(1)
    .getAttribute('href');
  const seeds = parseInt(row.querySelectorAll('td').item(5).innerText, 10);
  const leeches = parseInt(row.querySelectorAll('td').item(6).innerText, 10);

  const torrentPath = row
    .querySelectorAll('td')
    .item(2)
    .querySelectorAll('a')
    .item(0)
    .getAttribute('href');
  const sizeString = row.querySelectorAll('td').item(3).innerText;
  const { timestamp } = row.querySelectorAll('td').item(4).dataset;
  const nyaaPath = row
    .querySelectorAll('td')
    .item(1)
    .querySelector('a')
    .getAttribute('href');

  const fileURL = new URL(torrentPath, nyaaURL).toString();
  const nyaa = new URL(nyaaPath, nyaaURL).toString();
  const [sizeStr, sizeUnit] = sizeString.split(' ');
  const size = parseFloat(sizeStr) * sizes[sizeUnit];
  const date = new Date(parseInt(timestamp, 10) * 1000);
  return {
    trusted,
    english,
    title,
    magnetURL,
    seeds,
    leeches,
    fileURL,
    size,
    date,
    nyaaURL: nyaa
  };
}


function parseNyaa(nyaa: string): Torrent[] {
  const parser = new DOMParser();
  const doc = parser.parseFromString(nyaa, 'text/html');

  const torrents: Element[] = [];

  doc
    .querySelectorAll('table.torrent-list tbody tr')
    .forEach(t => torrents.push(t));

  return torrents.map(rowToTorrent);
}


export default async function(term, opts?: Opts): Promise<Torrent> {
  const content = await search(term, opts);
  return parseNyaa(content);
}
