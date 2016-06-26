import swagger from "swagger.json";

// Returns the basePath + path
swagger.getFullPath = (path) => { return path ? swagger.basePath + path : null; }
swagger.getFullUrl = (path) => {
  let fullPath = path ? swagger.basePath + path : "";
  let host = swagger.host || "";
  let scheme = swagger.schemes && swagger.schemes.length > 0 && swagger.schemes[0] || "http";
  return scheme + "://" + host + fullPath;
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
        definition: definition[method],
        getSummary: () => definition[method].summary || "",
        getDescription: () => definition[method].description || "",
        getParameters: () => {
          return (definition[method].parameters || []).map(parameter => {
            return {
              parameter: parameter,
              getDescription: () => parameter.description || ""
            };
          });
        },
        getResponses: () => Object.keys(definition[method].responses || {}),
        getResponse: (code) => {
          return {
            code: code,
            _: { 
              _: definition[method].responses[code],
              getDescription: () => definition[method].responses[code].description || ""
            }
          }
        }
      }
    }
  };
};
swagger.getTitle = () => swagger.info && swagger.info.title || "API";
swagger.getDescription = () => swagger.info && swagger.info.description || "";
swagger.getVersion = () => swagger.info && swagger.info.version || "";

export default swagger;