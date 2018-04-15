//Successful Status Codes
global.OK_CODE = 200;
global.OK_MESSAGE = 'OKAY.';

global.CREATED_CODE = 201;
global.CREATED_MESSAGE = 'Resource Created.';

global.ACCEPTED_CODE = 202;
global.ACCEPTED_MESSAGE = 'Request not completed.';

global.THIRD_PARTY_CODE = 203;
global.THIRD_PARTY_MESSAGE = 'Third party data.';

global.NO_CONTENT_CODE = 204;
global.NO_CONTENT_MESSAGE = 'No body content.';

global.RESET_CODE = 205;
global.RESET_MESSAGE = 'Reset data.';

global.PARTIAL_CODE = 206;
global.PARTIA_MESSAGE = 'Partial Data returned.';

//Redirection Status Codes
global.LINK_CODE = 300;
global.LINK_MESSAGE = 'Third party resource link.';

global.RESOURCE_MOVED_CODE = 301;
global.RESOURCE_MOVED_MESSAGE = 'Resource is moved permanetly.';

global.RESOURCE_FOUND_CODE = 302;
global.RESOURCE_FOUND_MESSAGE = 'Resource is moved to temporary url.';

global.RESOURCE_FOUND2_CODE = 303;
global.RESOURCE_FOUND2_MESSAGE = 'Resource is found in another url.';

global.PROXY_CODE = 305;
global.PROXY_MESSAGE = 'Resource must be accessed through the proxy.';

global.UNUSED_CODE = 306;
global.UNUSED_MESSAGE = 'The code is no longer available in this new version.';

//Client Error Code
global.BAD_REQUEST_CODE = 400;
global.BAD_REQUEST_MESSAGE = 'The server did not understand the request.';

global.UNAUTHORIZED_CODE = 401;
global.UNAUTHORIZED_MESSAGE = 'Unathorized Access.';

global.PAYMENT_REQUIRED_CODE = 402;
global.PAYMENT_REQUIRED_MESSAGE = 'You need to get paid version.';

global.FORBIDDEN_CODE = 403;
global.FORBIDDEN_MESSAGE = 'The request is forbidden.';

global.NOT_FOUND_CODE = 404;
global.NOT_FOUND_MESSAGE = 'The request is not found.';

global.NOT_ACCEPTABLE_CODE = 406;
global.NOT_ACCEPTABLE_MESSAGE = 'The request can only generate response that is not acceptable by client.';

global.PROXY_AUTHENTICATION_REQUIRED_CODE = 407;
global.PROXY_AUTHENTICATION_REQUIRED_MESSAGE = 'Proxy authntication is required.';

global.REQUEST_TIMEOUT_CODE = 408;
global.REQUEST_TIMEOUT_MESSAGE = 'Request timeout.';

global.RESOURCE_UNAVAILABLE_CODE = 410;
global.RESOURCE_UNAVAILABLE_MESSAGE = 'Resource is unavailable.';

global.RESOURCE_TOO_LARGE_CODE = 413;
global.RESOURCE_TOO_LARGE_MESSAGE = 'Resource is too large.';

//Server Error Code
global.INTERNAL_SERVER_ERROR_CODE = 500;
global.INTERNAL_SERVER_ERROR_MESSAGE = 'Oops! Something unexpected happened. Please try again.';

global.BAD_GATEWAY_CODE = 502;
global.BAD_GATEWAY_MESSAGE = 'Bad gateway. Thire party did not responed well.';

global.SERVICE_UNAVAILABLE_CODE = 503;
global.SERVICE_UNAVAILABLE_MESSAGE = 'Server overloaded.';

global.GATEWAY_TIMEOUT_CODE = 504;
global.GATEWAY_TIMEOUT_MESSAGE = 'The gateway is timed out.';

global.HTTP_UNSUPPORTED_CODE = 505;
global.HTTP_UNSUPPORTED_MESSAGE = 'The server does not support HTTP protocol.';
