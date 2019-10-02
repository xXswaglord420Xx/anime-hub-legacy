// @flow
import axios from "axios";
import Conf from "../constants/public";

const api = axios.create({baseURL: Conf.servers.nyaa.url});

export type Opts = {
  +trusted: boolean,
  +english: boolean,
  +page: number
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

export type EpisodeDatum = {
  +magnetURL: string,
  +title: string,
  +filename: string,
  +episode: number,
  +date: number
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

async function searchFor(term: string, opts?: Opts = {trusted: true, english: true, page: 1}): Promise<string> {
  const f = opts.trusted ? '2' : '0';
  const c = opts.english ? '1_2' : '0_0';

  const {data} = await api.get("", {
    params: {
      f,
      c,
      q: term,
      p: opts.page?? 1
    },
    headers: {
      accepts: 'text/html'
    }
  });
  return data;
}

function rowToTorrent(row: HTMLElement): Torrent {
  const trusted = row.className === 'success';
  const english = row.querySelector('td a').getAttribute('href') === '1_2';
  const title = row
    .querySelectorAll('td')
    .item(1)
    .querySelector('a:not(.comments)').innerText;
  const rowLinks = row
    .querySelectorAll('td')
    .item(2)
    .querySelectorAll('a');
  const magnetURL = (rowLinks.item(1)?? rowLinks.item(0))
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


function parseNyaa(nyaa: string): {torrents: Torrent[], size: number} {
  const parser = new DOMParser();
  const doc = parser.parseFromString(nyaa, 'text/html');

  const torrents = [...doc.querySelectorAll('table.torrent-list tbody tr')] // node list does not have a map method, i learnt it the hard way
    .map(rowToTorrent);
  const sizeText = doc.querySelector(".pagination-page-info")?.childNodes[0]?.nodeValue;
  const regex = /Displaying results (\d+)-(\d+) out of (\d+) results\./;
  const result = regex.exec(sizeText);
  const size = result?.[3]?? -1;
  return {
    torrents,
    size
  }
}


export async function search(
  term,
  opts?: Opts = {english: true, trusted: true, page: 1, perPage: 16}
  ): Promise<{torrents: Torrent[], pageCount: number, count: number}> {

  const {pageCount} = Conf.servers.nyaa;
  const {page = 1, perPage = 16} = opts;
  const si = ((page - 1) * perPage) + 1; // absolute number of the first ep of the page
  const concretePage = Math.floor(si / pageCount) + 1;
  const pageIndex = si % pageCount || pageCount;
  const firstPageLength = Math.min(pageCount - pageIndex + 1, perPage);
  const secondPageLength = perPage - firstPageLength;

  const {torrents: pageOne, size} = parseNyaa(await searchFor(term, {...opts, page: concretePage}));
  const {torrents: pageTwo} = parseNyaa(await searchFor(term, {...opts, page: concretePage + 1}));

  console.log(`Result set size for term "${term}" is ${size}`);
  const p1 = pageOne.slice(pageIndex - 1, pageIndex - 1 + firstPageLength);
  const p2 = pageTwo.slice(0, secondPageLength);
  const torrents = [...p1, ...p2];
  const pCount = Math.floor(size / pageCount) + 1;
  return {torrents, pageCount: pCount, count: size};
}


export async function getEpisodes(anime, page = 1, perPage = 16): Promise<{episodes: [EpisodeDatum], pageCount: number}> {
  const term = `${anime} horriblesubs 1080p`;
  const searchResult = await search(term, {page, perPage, english: true, trusted: true});
  const episodes = searchResult.torrents.map(torrentToEpisode);

  return {
    episodes,
    pageCount: Math.floor(searchResult.count / perPage) + 1
  };
}

const torrentRegex = /\[HorribleSubs](.+) - (\d+)/;

function torrentToEpisode(torrent: Torrent): EpisodeDatum {
  const matches = torrentRegex.exec(torrent.title);
  const title = matches[1];
  const episode = matches[2];
  return {
    title,
    episode,
    filename: torrent.title,
    date: torrent.date,
    magnetURL: torrent.magnetURL
  }
}
