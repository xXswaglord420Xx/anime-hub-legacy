const url = "https://graphql.anilist.co";

// language=GraphQL
export const Q_TEST = `
 query ($id: Int) {
  Media (id: $id, type: ANIME) {
    id,
    title {
      romaji,
      english,
      native
    }
  }
 }
`;

export const request = (query, variables = {}) => {
  return fetch(url, {
    method: "post",
    body: JSON.stringify({query, variables}),
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  }).then(r => {
    if (!r.ok) {
      throw new Error("Cannot receive response");
    }
    return r.json();
  });
};

export const test = () => {
  return request(Q_TEST, {id: 15125})
};

// language=GraphQL
export const Q_AIRING_ANIME = `
  query AiringAnime($page: Int) {
    Page(page: $page perPage: 50) {
      pageInfo{
        currentPage,
        hasNextPage
      }
      media (type: ANIME status: RELEASING sort: [TRENDING_DESC, POPULARITY_DESC]){
        id,
        title{
          romaji,
          english,
          native
        },
        coverImage {
          extraLarge
        },
        nextAiringEpisode {
          episode,
          timeUntilAiring
        }
      }
    }
  }
`;

// language=GraphQL
const Q_FETCH_ANIME = `
  query AnimeDeets($id: Int) {
    Media(id: $id) {
      id,
      bannerImage,
      title {
        romaji,
        english
      },
      episodes,
      nextAiringEpisode {
        episode,
        airingAt
      },
      coverImage {
        large
      },
      description(asHtml: false),
      characters {
        nodes {
          name {
            full
          },
          id
        }
      }
    }
  }
`;

export const fetchAiringAnime = (page: number = 1) => {
  return request(Q_AIRING_ANIME, {page}).then(r => r.data.Page);
};

export const fetchAnime = (id: number) => {
  return request(Q_FETCH_ANIME, {id});
};
