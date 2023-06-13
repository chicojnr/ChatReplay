const ytcm = require("@freetube/yt-comment-scraper");

async function getComments(pVideoId) {
    const payload = {
        videoId: pVideoId, // Required
        sortByNewest: true,
        continuation: true,
        //mustSetCookie: true,
        // httpsAgent: agent
    }
    const response = await ytcm.getComments(payload);
    //console.log(response)
    return response;
}
module.exports = {
    getComments
};