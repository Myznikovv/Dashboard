import React from "react";
import video from "../tutorial.mp4";

export default function Video() {
    return (
        <div>
            {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
            <video src={video} width="100%"  controls="controls" autoPlay={false} style={{maxWidth: '360px',padding: 40, margin: { xs: 'auto', md: 'inherit' }}}/>
        </div>
    );
}