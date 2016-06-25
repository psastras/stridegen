import api from "swagger.json";

let swagger = api;

// Returns the basePath + path
swagger.getFullPath = (path) => {
  return path ? api.basePath + path : null;
}

swagger.getPaths = () => Object.keys(api.paths || {});
swagger.getPath = (path) => path && api.paths && api.paths[path] || {};
swagger.getTitle = () => api.info && api.info.title || "API";
swagger.getDescription = () => api.info && api.info.description || "";
swagger.getVersion = () => api.info && api.info.version || "";

export default api;