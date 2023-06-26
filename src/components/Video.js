import React from "react";

export default function Video() {
    return (
        <div>
            {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
            <video src="/static/media/tutorial.mp4" width="100%"  controls="controls" autoPlay={false} style={{maxWidth: '360px',padding: 40, margin: { xs: 'auto', md: 'inherit' }}}/>
        </div>
    );
}