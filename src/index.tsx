import React from "react";
import WavesurferPlayer from "@wavesurfer/react";
import WaveSurfer from "wavesurfer.js";

import { createRoot } from "react-dom/client";

const App = (): React.ReactNode => {
    const [wavesurfer, setWavesurfer] = React.useState<WaveSurfer | null>(null);
    const onDecode = React.useCallback((w: WaveSurfer) => setWavesurfer(w), []);
    const onClickDebug = React.useCallback(() => {
        if (wavesurfer) {
            testWaveSurfer(wavesurfer).catch(e => console.error(e));
        }
    }, [wavesurfer]);
    const onClickStop = React.useCallback(() => {
        if (wavesurfer) {
            wavesurfer.stop();
        }
    }, [wavesurfer]);
    return (
        <>
            <WavesurferPlayer
                url="/data/record.wav"
                onDecode={onDecode} />
            <button
                disabled={!wavesurfer}
                onClick={onClickDebug}>
                click to debug
            </button>
            <button
                disabled={!wavesurfer}
                style={{ marginLeft: "10px" }}
                onClick={onClickStop}>
                stop
            </button>
        </>
    );
};

async function testWaveSurfer(wavesurfer: WaveSurfer) {
    const wrongTime = 300.0;
    const expectTime = 150.0;

    await sleep(100);

    // this step is Ok
    wavesurfer.setTime(100);
    wavesurfer.play();
    await sleep(2500);

    // this step is Ok.
    // but this timestamp will cause the next step to be wrong.
    wavesurfer.setTime(wrongTime);
    await sleep(1500);

    // this step isn't Ok.
    // if you comment out the previous step, this step will work fine.
    wavesurfer.setTime(expectTime);

    await sleep(0);
    const currentTime = wavesurfer.getCurrentTime();

    console.log("expectTime:", expectTime); // 150.0
    console.log("currentTime:", currentTime); // 0.0
    console.log("debug is done. please click stop button to stop the audio.");
}

function sleep(duration: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, duration));
}

createRoot(document.getElementById("root")!).render(<App />);