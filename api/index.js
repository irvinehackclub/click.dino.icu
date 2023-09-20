/**
 * Catch all API route handler
 * @param {Request} request
 * @param {Response} response
 */
export default function handler (request, response) {
    const query = request.url.split("?")[0];
    response.send(query);
}