import swagger from "./swagger.json";

// Returns the basePath + path
swagger.getFullPath = (path) => {
  return path ? swagger.basePath + path : null;
}

swagger.getPaths = () => Object.keys(swagger.paths || {});
swagger.getPath = (path) =>  {
  let definition = path && swagger.paths && swagger.paths[path] || {};
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
swagger.getTitle = () => swagger.info && swagger.info.title || "API";
swagger.getDescription = () => swagger.info && swagger.info.description || "";
swagger.getVersion = () => swagger.info && swagger.info.version || "";

export default swagger;