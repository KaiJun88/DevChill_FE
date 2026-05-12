import api from "./apiClient.js";

const cleanParams = (params = {}) => {
  const newParams = {};

  Object.keys(params).forEach((key) => {
    if (
      params[key] !== undefined &&
      params[key] !== null &&
      params[key] !== ""
    ) {
      newParams[key] = params[key];
    }
  });

  return newParams;
};

export const buildMovieQuery = (filters = {}) => {
  return cleanParams({
    page: filters.page || 1,
    limit: filters.limit || 10,
    keyword: filters.keyword,
    type: filters.type,
    year: filters.year,
    category: filters.category,
    country: filters.country,
    status: filters.status,
    lifecycle_status: filters.lifecycle_status,
    is_premium: filters.is_premium,
  });
};

export const getPublicMovies = async (filters = {}) => {
  const params = buildMovieQuery(filters);

  const res = await api.get("/movies", { params });
  return res.data;
};

export const getPublicMovieBySlug = async (id) => {
  if (!id) throw new Error("Movie ID is required");
  const res = await api.get(`/movies/${id}`, {
    params: { is_public: true },
  });

  return res.data;
};

export const searchMovies = async (filters = {}) => {
  const params = buildMovieQuery({
    ...filters,
    page: filters.page || 1,
    limit: filters.limit || 10,
  });

  const res = await api.get("/movies", { params });
  return res.data;
};

export const getCategories = async () => {
  const res = await api.get("/movies/category");
  return res.data;
};

export const getCountries = async () => {
  const res = await api.get("/movies/country");
  return res.data;
};

export const getYears = async () => {
  const res = await api.get("/movies/year");
  return res.data;
};

export const watchMovie = async (slug, params = {}) => {
  if (!slug) throw new Error("Movie slug is required");

  const res = await api.get(`/movies/watch/${slug}`, {
    params: {
      ep: params.ep,
      server: params.server,
      is_public: true,
    },
  });

  return res.data;
};
