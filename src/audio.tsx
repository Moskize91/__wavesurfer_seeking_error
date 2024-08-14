import React from "react";

import { createRoot } from "react-dom/client";

const App = (): React.ReactNode => {
    const [canPlayThrough, setCanPlayThrough] = React.useState<boolean>(false);
    const audioRef = React.useRef<HTMLAudioElement>(null);
    const onCanPlayThrough = React.useCallback(() => setCanPlayThrough(true), []);
    const onClickDebug = React.useCallback(() => {
        if (canPlayThrough && audioRef.current) {
            testAudioPlayer(audioRef.current).catch(e => console.error(e));
        }
    }, [canPlayThrough, audioRef.current]);

    const onClickStop = React.useCallback(() => {
        if (canPlayThrough) {
            audioRef.current?.pause();
        }
    }, [canPlayThrough, audioRef.current]);

    return (
        <>
            <audio
                controls
                ref={audioRef}
                src="/data/record.wav"
                onCanPlayThrough={onCanPlayThrough} />
            <button
                disabled={!canPlayThrough}
                onClick={onClickDebug}>
                click to debug
            </button>
            <button
                disabled={!canPlayThrough}
                style={{ marginLeft: "10px" }}
                onClick={onClickStop}>
                stop
            </button>
        </>
    );
};

async function testAudioPlayer(audio: HTMLAudioElement): Promise<void> {
    const wrongTime = 300.0;
    const expectTime = 150.0;

    await sleep(100);

    // this step is Ok
    audio.currentTime = 100;
    audio.play();
    await sleep(2500);

    // this step is Ok.
    // but this timestamp will cause the next step to be wrong.
    audio.currentTime = wrongTime;
    await sleep(1500);

    // this step isn't Ok.
    // if you comment out the previous step, this step will work fine.
    audio.currentTime = expectTime;

    await sleep(0);
    const currentTime = audio.currentTime;

    console.log("expectTime:", expectTime); // 150.0
    console.log("currentTime:", currentTime); // 0.0
    console.log("debug is done. please click stop button to stop the audio.");
}

function sleep(duration: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, duration));
}

createRoot(document.getElementById("root")!).render(<App />);