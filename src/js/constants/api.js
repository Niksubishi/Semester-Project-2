export const API_BASE = "https://v2.api.noroff.dev";
export const API_AUCTION = `${API_BASE}/auction`;

export const API_AUTH = `${API_BASE}/auth`;
export const API_AUTH_LOGIN = `${API_AUTH}/login`;
export const API_AUTH_REGISTER = `${API_AUTH}/register`;

export const API_LISTINGS = {
  BASE: `${API_AUCTION}/listings`,
  SINGLE: (id) => `${API_AUCTION}/listings/${id}`,
  BIDS: (id) => `${API_AUCTION}/listings/${id}/bids`,
  SEARCH: `${API_AUCTION}/listings/search`,
};

export const API_PROFILES = {
  BASE: `${API_AUCTION}/profiles`,
  SINGLE: (name) => `${API_AUCTION}/profiles/${name}`,
  LISTINGS: (name) => `${API_AUCTION}/profiles/${name}/listings`,
  BIDS: (name) => `${API_AUCTION}/profiles/${name}/bids`,
  WINS: (name) => `${API_AUCTION}/profiles/${name}/wins`,
  SEARCH: `${API_AUCTION}/profiles/search`,
};

export const API_FLAGS = {
  SELLER: "_seller=true",
  BIDS: "_bids=true",
  ACTIVE: "_active=true",
  TAG: (tag) => `_tag=${tag}`,
  LISTINGS: "_listings=true",
  WINS: "_wins=true",
};
