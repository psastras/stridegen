/**
 * This is the root document object for the API specification. It combines what previously was the 
 * Resource Listing and API Declaration (version 1.2 and earlier) together into one document.
 */
class Swagger2 {
  constructor(json) {
    this.host = json.host || "";
    this.basePath = json.basePath || "";
    this.schemes = (json.schemes && json.schemes.length > 0) ? json.schemes : [ "http" ];
    this.consumes = json.consumes || [];
    this.produces = json.produces || [];

    this.info = new Info(this, json.info || {});
    this.paths = new Paths(this, json.paths || {});
  }

  /**
   * @return {string} The first scheme which has been defined. 
   */
  getDefaultScheme() {
    return this.schemes[0];
  }

  /**
   * @return {Paths} A Paths object containing a list of all paths.
   */
  getPaths() {
    return this.paths;
  }
}

/**
 * The object provides metadata about the API. The metadata can be used by the clients if needed, 
 * and can be presented in the Swagger-UI for convenience.
 */
class Info {
  constructor(swagger, json) {
    this.title = json.title || "";
    this.description = json.description || "";
    this.termsOfService = json.termsOfService || "";
    this.version = json.version || "";
  }
}

/**
 * Holds the relative paths to the individual endpoints. The path is appended to the basePath in order to construct the full URL.
 * The Paths may be empty, due to ACL constraints.
 */
class Paths {
  constructor(swagger, json) {
    this.swagger = swagger;
    this.pathItems = Object.keys(json).map(pathName => new PathItem(this, pathName, json[pathName] || {}));
    this.numPathItems = this.pathItems.length;
  }

  /** 
   * @return {PathItem[]} Returns a list of path items, each of which describes operations available on a single path.
   */
  getPathItems() {
    return this.pathItems;
  }
}

/**
 * Describes the operations available on a single path. A Path Item may be empty, due to ACL constraints. 
 * The path itself is still exposed to the documentation viewer but they will not know which operations and parameters are available.
 */
class PathItem {
  constructor(paths, pathName, json) {
    this.paths = paths;
    this.name = pathName;
    this.parameters = (json.parameters || []).map(parameter => new Parameter(parameter));
    
    this.operations = Object.keys(json).map(operationType => new Operation(this, operationType, json[operationType] || {}));
    this.numOperations = this.operations.length;
  }

  /**
   * @return {Parameter[]} A list of available parameters to this path (query, header, request, etc.).
   */
  getParameters() {
    return this.parameters;
  }

  /**
   * @return {string} The path of the url, ie. basePath + this.path. 
   */
  getPath() {
    return `${this.paths.swagger.basePath}${this.name}`;
  }

  /**
   * Returns the full path, ie host + basePath + this.path.  Note that this does not include the scheme.
   * See getFullUrl() which includes the scheme.
   * 
   * @return {string} the full path, ie host + basePath + this.path.
   */
  getFullPath() {
    return `${this.paths.swagger.host}${this.paths.swagger.basePath}${this.name}`;
  }

  /**
   * Returns the full url path, ie scheme://host + basePath + this.path.
   * See getFullPath() which excludes the scheme.
   */
  getFullUrl() {
    return `${this.paths.swagger.getDefaultScheme()}://${this.paths.swagger.host}${this.paths.swagger.basePath}${this.name}`;
  }
}

/**
 * Describes a single API operation on a path.
 */
class Operation {
  constructor(pathItem, operationType, json) {
    this.pathItem = pathItem;
    this.operationType = operationType;

    this.tags = json.tags || [];
    this.summary = json.summary || "";
    this.description = json.description || "";
    this.operationId = json.operationId || "";
    this.consumes = json.consumes || pathItem.paths.swagger.consumes || [];
    this.produces = json.produces || pathItem.paths.swagger.produces || [];
    this.parameters = json.parameters || pathItem.parameters || [];
    this.responses = new Responses(json.responses);
    this.schemes = json.schemes || pathItem.paths.swagger.schemes;
    this.deprecated = json.deprecated || false;
    this.security = new SecurityRequirement(json.security || {});
  }

  /**
   * Returns the list of possible responses
   */
  getResponses() {
    return this.responses.responses;
  }

  /**
   * Returns the first defined scheme.
   */
  getDefaultScheme() {
    return this.schemes[0];
  }

  /**
   * Returns the request line, ie. METHOD scheme://basePath + path.
   */
  getRequestLine() {
    return `${this.operationType.toUpperCase()} ${this.getDefaultScheme()}://${this.pathItem.getFullPath()}`; 
  }
}

/**
 * Describes a single operation parameter.
 * A unique parameter is defined by a combination of a name and location.
 */
class Parameter {
  constructor(json) {
    this.name = json.name || "";
    this._in = json['in'] || "";
    this.description = json.description || "";
    this.required = json.required || false;

    this.schema = (this._in === "body") ? 
      (json.schema || {}) :
      {
        type      : json.type || "",
        format    : json.format || "",
        allowEmptyValue : json.allowEmptyValue || false,
        items     : (json.items || []).map(item => new Item(item)),
        collectionFormat : json.type === "array" ? (json.collectionFormat || "csv") : "",
        _default   : json.default,
        maximum    : json.maximum,
        exclusiveMaximum : json.exclusiveMaximum,
        minimum    : json.minimum,
        exclusiveMinimum : json.exclusiveMinimum,
        maxLength  : json.maxLength,
        minLength  : json.minLength,
        pattern    : json.pattern,
        maxItems   : json.maxItems,
        minItems   : json.minItems,
        uniqueItems : json.uniqueItems || false,
        _enum      : json.enum,
        multipleOf : json.multipleOf
      };
  }

  /**
   * True if the parameter type is a body schema (ex. for a request body).  Otherwise the
   * parameter schema follows a simplfied version of the JSON schema.
   */
  isBody() {
    return this.schema === "body";
  }
}

/**
 * A limited subset of JSON-Schema's items object. It is used by parameter definitions that are not located in "body".
 */
class Item {
  constructor(json) {

  }
}

class Responses {
  constructor(json) {
    this.responses = Object.keys(json).map(status => new Response(status, json[status]));
  }
}

class Response {
  constructor(status, json) {
    this.status = status;
    this.description = json.description || "";
    this.schema = json.schema;
    this.headers = new Headers(json.headers || {});
    this.examples = new Examples(json.examples || {});
  }

  /**
   * Returns the list of acceptable headers.
   */
  getHeaders() {
    return this.headers.headers;
  }

  /**
   * Returns a list of example responses.
   */
  getExamples() {
    return this.examples.examples;
  }
}

class Headers {
  constructor(json) {
    this.headers = Object.keys(json).map(headerName => new Header(headerName, json[headerName]));
    this.numHeaders = this.headers.length;
  }
}

class Header {
  constructor(headerName, json) {
    this.name = headerName;
    this.description = json.description || "";
    this.type = json.type || "";
    this.format = json.format || "";
    this.items = (json.items || []).map(item => new Item(item));
    this.collectionFormat = (this.items && this.items.length > 0) ? (json.collectionFormat || "csv") : "";
    this.default = "";
    this.maximum = json.maximum;
    this.exclusiveMaximum = json.exclusiveMaximum;
    this.minimum = json.minimum;
    this.exclusiveMinimum = json.exclusiveMinimum;
    this.maxLength = json.maxLength;
    this.minLength = json.minLength;
    this.pattern = json.pattern || "";
    this.maxItems = json.maxItems;
    this.minItems = json.minItems;
    this.uniqueItems = json.uniqueItems;
    this.enum = json.enum || [];
    this.multipleOf = json.multipleOf;
  }
}

class Examples {
  constructor(json) {
    this.examples = Object.keys(json).map(mimeType => new Example(mimeType, json[mimeType]));
    this.numExamples = this.examples.length;
  }
}

class Example {
  constructor(mimeType, json) {
    this.mimeType = mimeType;
    this.json = json;
  }
}

class SecurityRequirement {
  constructor(json) {

  }
}

export default Swagger2;