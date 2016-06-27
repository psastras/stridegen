import { assert } from 'chai';
import Swagger2 from '../src/swagger2';
import SwaggerJson from '../src/petstore.json';

describe('Swagger2', () => {
  let swagger = new Swagger2(SwaggerJson);
  
  describe('parsing', () => {
    it('should read a single path item from the petstore', () => {
      let paths = swagger.paths;
      assert.equal(1, paths.numPathItems);
    });

    it('should read a pathItem under /pets', () => {
      let pathItem = swagger.paths.pathItems[0];
      assert.equal("/pets", pathItem.name);
    });

    it('should read a single operation under /pets', () => {
      let pathItem = swagger.paths.pathItems[0];
      assert.equal(1, pathItem.numOperations);
    });

    it('should read an operation under GET /pets', () => {
      let operation = swagger.paths.pathItems[0].operations[0];
      assert.equal("get", operation.operationType);
    });

    // TODO: more functions here
  });

  describe('Path Item', () => {
    let pathItem = swagger.paths.pathItems[0];

    it('should be able to get the path', () => {
      let path = pathItem.getPath();
      assert.equal("/api/pets", path);
    });

    it('should be able to get the full path', () => {
      let fullPath = pathItem.getFullPath();
      assert.equal("petstore.swagger.io/api/pets", fullPath);
    });

    it('should be able to get the full url', () => {
      let fullUrl = pathItem.getFullUrl();
      assert.equal("http://petstore.swagger.io/api/pets", fullUrl);
    });
  });

  describe('Operation', () => {
    let operation = swagger.paths.pathItems[0].operations[0];

    it('should be able to get the request line', () => {
      let requestLine = operation.getRequestLine();
      assert.equal("GET http://petstore.swagger.io/api/pets", requestLine);
    });
  });
});