const speech = require('@google-cloud/speech');
const ffmpeg = require('ffmpeg');

const client = new speech.SpeechClient({ keyFilename: "./application_default_credentials.json" });

const input = 'example.mp4';

const convertToAudio = async (videoPath) => {
    try {
        var process = new ffmpeg(videoPath);
        const video = await process

        video.fnExtractSoundToMP3('./result.mp3', function (error, file) {
            console.log(error)
            if (!error)
                console.log('Audio file: ' + file);
        });

    } catch (e) {
        console.log(e.code);
        console.log(e.msg);
    }
}

const uploadFile = async (filePath) => {
    try {
        const { Storage } = require('@google-cloud/storage');

        const storage = new Storage({ keyFilename: "./application_default_credentials.json" });

        await storage.bucket('videos').upload(filePath, {
            destination: filePath,
        });

        console.log(`${filePath} uploaded to ${bucketName}`);
    } catch (error) {
        console.log(error)
    }
}

const analyzeVideoTranscript = async () => {

    const gcsUri = 'gs://my-bucket/audio.raw';
    const encoding = 'Encoding of the audio file, e.g. LINEAR16';
    const sampleRateHertz = 16000;
    const languageCode = 'BCP-47 language code, e.g. en-US';

    const config = {
        encoding: encoding,
        sampleRateHertz: sampleRateHertz,
        languageCode: languageCode,
    };

    const audio = {
        uri: gcsUri,
    };

    const request = {
        config: config,
        audio: audio,
    };

    const [operation] = await client.longRunningRecognize(request);
    const [response] = await operation.promise();
    const transcription = response.results
        .map(result => result.alternatives[0].transcript)
        .join('\n');
    console.log(`Transcription: ${transcription}`);

}

// analyzeVideoTranscript();
//convertToAudio(input);
uploadFile(input)