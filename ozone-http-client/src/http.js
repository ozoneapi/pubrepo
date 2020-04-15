/* eslint-disable prefer-destructuring */
const request = require('superagent');
const fs = require('fs');
const Validator = require('jsonschema').Validator;
const log = require('loglevel').getLogger('ozone-http-client');
const schema = require('./http-do-schema.json');

class Http {
  static async do(params) {
    // set the loglevel
    log.setLevel(params.logLevel || 'silent');

    log.info('Http.do: started');
    log.debug('Http.do: params');
    log.debug(params);
    log.debug('------------------');

    // validate the request
    log.info('Http.do: validate http.do schema - start');
    const jsonSchemaValidator = new Validator();
    const validationResult = jsonSchemaValidator.validate(params, schema);
    if (validationResult.errors.length > 0) {
      log.error('Http.do: validate http.do schema - failed');
      throw new Error(`Http.do - params failed validation. ${validationResult.errors}`);
    }

    // set the url
    let doRequest;

    // Can also be split in defaults for each verb
    params.timeout = params.timeout || {
      response: 5000, // Wait 5 seconds for the server to start sending,
      deadline: 60000, // but allow 1 minute for the file to finish loading.
    };

    switch (params.verb) {
      case 'get':
        doRequest = request.get(params.url).timeout(params.timeout);
        break;

      case 'post':
        doRequest = request.post(params.url).timeout(params.timeout);
        break;

      case 'delete':
        doRequest = request.delete(params.url).timeout(params.timeout);
        break;

      case 'put':
        doRequest = request.put(params.url).timeout(params.timeout);
        break;

      case 'patch':
        doRequest = request.patch(params.url).timeout(params.timeout);
        break;

      default:
        doRequest = request.get(params.url).timeout(params.timeout);
    }

    // might work to clean up the switch....
    // doRequest.timeout = params.timeout || {
    //   response: 5000, // Wait 5 seconds for the server to start sending,
    //   deadline: 60000, // but allow 1 minute for the file to finish loading.
    // }

    // process certificates
    log.debug('Http.do: add certs - start');
    if (params.certs !== undefined) {
      if (params.certs.ca !== undefined) {
        const caFile = fs.readFileSync(params.certs.ca);
        doRequest.ca(caFile);
      }

      if (params.certs.cert !== undefined) {
        const certFile = fs.readFileSync(params.certs.cert);
        doRequest.cert(certFile);
      }

      if (params.certs.key !== undefined) {
        const keyFile = fs.readFileSync(params.certs.key);
        doRequest.key(keyFile);
      }
    }
    log.debug('Http.do: add certs - done');

    // set the query
    log.debug('Http.do: add query params - start');
    if (params.query !== undefined) {
      doRequest.query(params.query);
    }
    log.debug('Http.do: add query params - done');

    // set the headers
    log.debug('Http.do: add headers - start');
    if (params.headers !== undefined) {
      const headerNames = Object.keys(params.headers);
      for (let i = 0; i < headerNames.length; i += 1) {
        const headerName = headerNames[i];
        const headerValue = params.headers[headerName];
        doRequest.set(headerName, headerValue);
      }
    }
    log.debug('Http.do: add headers - done');

    // set the body
    log.debug('Http.do: add body - start');
    if (params.body !== undefined) {
      doRequest.send(params.body);
    }
    log.debug('Http.do: add body - done');

    // set the fields
    log.debug('Http.do: add fields - start');
    if (params.fields !== undefined) {
      const fieldNames = Object.keys(params.fields);
      for (let i = 0; i < fieldNames.length; i += 1) {
        const fieldName = fieldNames[i];
        const fieldValue = params.fields[fieldName];
        doRequest.send(`${fieldName}=${fieldValue}`);
      }
    }
    log.debug('Http.do: add fields - done');

    // calculate number of redirects to follow
    log.debug('Http.do: set redirects - start');
    let redirects = params.maxRedirects;
    if (redirects === undefined) {
      redirects = 5;
    }
    log.debug('Http.do: set redirects - done');

    // wait for a response
    log.debug('Http.do: call endpoint - start');
    const response = await Http._getResponse(doRequest, redirects);
    log.debug('Http.do: call endpoint - done');

    log.debug('Http.do: parse json - start');
    if (params.parseJson) {
      // lets see if we can get json
      try {
        response.json = JSON.parse(response.body);
      } catch (err) {
        // nothing to do here
        log.error('Http.do: parse json - failed');
        response.jsonError = err;
      }
    }
    log.debug('Http.do: parse json - done');
    log.info('Http.do: returning response');
    log.info(response);
    return response;
  }

  static async _getResponse(doRequest, redirects) {
    try {
      const result = await doRequest.redirects(redirects);
      const toRet = {
        status: result.status,
        headers: result.headers,
        body: result.text
      };

      return toRet;
    } catch (error) {
      if (error.status !== undefined) {
        // this is an http 4xx or 5xx
        return {
          status: error.status,
          headers: error.response.headers,
          body: error.response.text
        };
      }

      // unhandled error
      throw error;
    }
  }
}

module.exports = Http;
