/**
 * Catch all API route handler
 * @param {Request} request
 * @param {Response} response
 */
export default function handler (request, response) {
    response.send(request.url);
}