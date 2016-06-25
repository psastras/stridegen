import api from "swagger.json";

let swagger = api;

// Returns the basePath + path
swagger.getFullPath = (path) => {
  return path ? api.basePath + path : null;
}

swagger.getPaths = () => Object.keys(api.paths || {});
swagger.getPath = (path) =>  {
  let definition = path && api.paths && api.paths[path] || {};
  return {
    path: definition,
    getMethods: () => Object.keys(definition),
    getMethod: (method) =>  {
      return {
        method: method,
        getSummary: () => definition[method].summary || "",
        getDescription: () => definition[method].description || ""
      }
    }
  };
};
swagger.getTitle = () => api.info && api.info.title || "API";
swagger.getDescription = () => api.info && api.info.description || "";
swagger.getVersion = () => api.info && api.info.version || "";

export default api;