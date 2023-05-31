// const ytdlc = require('ytdl-core');
// const fs = require('fs');
// const { exec } = require('child_process');
// //const readline = require('readline');
// // const ffmpeg = require('ffmpeg-static');
// //const ffmpeg = require('fluent-ffmpeg');
// const async = require('async');

// async function downloadMaxRes(videoId) {
//   // const videoId = 'RENc3Od0yCc';
//   const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;

//   const outputFilePath = `./public/videos/video_${videoId}_maxres.mp4`;



//   return new Promise((resolve, reject) => {
//     async.waterfall([
//       function downloadVideo(callback) {
//         const video = ytdlc(videoUrl, { quality: 'highestvideo' });
//         const videoFilePath = `./_app/_downloads/video/p_video_${videoId}.mp4`;
//         video.pipe(fs.createWriteStream(videoFilePath))
//           .on('finish', () => {
//             callback(null, videoFilePath);
//           })
//           .on('error', (err) => {
//             callback(err);
//           });
//       },
//       function downloadAudio(videoFilePath, callback) {
//         const audio = ytdlc(videoUrl, { quality: 'highestaudio', filter: 'audioonly' });
//         const audioFilePath = `./_app/_downloads/audio/audio_${videoId}.mp3`;
//         audio.pipe(fs.createWriteStream(audioFilePath))
//           .on('finish', () => {
//             callback(null, videoFilePath, audioFilePath);
//           })
//           .on('error', (err) => {
//             callback(err);
//           });
//       },
//       //ffmpeg -i input_video.mp4 -i input_audio.mp4 -c:v copy -c:a aac -strict -2 output.mp4
//       function mergeFiles(videoFilePath, audioFilePath, callback) {
//         exec(`ffmpeg -i "${videoFilePath}" -i "${audioFilePath}" -c:v copy -c:a aac -strict -2 -preset ultrafast "${outputFilePath}"`, (err, stdout, stderr) => {
//           if (err) {
//             callback(err);
//           } else {
//             fs.unlink(videoFilePath, (err) => {
//               if (err) {
//                 console.error('An error occurred while deleting the video file: ' + err.message);
//               } else {
//                 console.log('Video file deleted');
//               }
//             });
//             callback(null);
//           }
//         });
//       }
//     ], function (err) {
//       if (err) {
//         console.error('An error occurred: ' + err.message);
//         reject({ Error: "Something went wrong!" })
//       } else {
//         console.log('Merging completed!');
//         resolve({ Success: 'Download completed!' })
//       }
//     });
//   });
// }

// async function download(url) {
//   try {
//     const video = await ytdlc.getInfo(url);
//     let title = video.videoDetails.title;
//     title = title.replace(/[|\\?*<":>+\[\]/]/g, ''); // remove os caracteres indesejados
//     const writeStream = fs.createWriteStream(`./public/videos/video_${video.videoDetails.videoId}.mp3`);
//     const readStream = ytdlc(url, {
//       filter: 'videoandaudio',
//       quality: 'highestvideo'
//       //filter: 'audioonly',
//       //quality: 'highestaudio'
//     });

//     readStream.on('progress', (chunk, downloaded, total) => {
//       const percent = downloaded / total;
//       process.stdout.cursorTo(0);
//       process.stdout.clearLine(1);
//       process.stdout.write(`Downloading ${title}: ${(percent * 100).toFixed(2)}%\n`);
//     });
//     readStream.pipe(writeStream);

//     await new Promise((resolve, reject) => {
//       writeStream.on("finish", resolve);
//       writeStream.on("error", reject);
//       readStream.on("error", reject);
//     });
//     return { message: `Download of "${title}" finished successfully.` };
//   } catch (error) {
//     return { error: `Error downloading video: ${error.message}` };
//   }
// }

// module.exports = {
//   download,
//   downloadMaxRes
// };
