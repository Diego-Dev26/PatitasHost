import React from "react";
import loadGif from './loading.gif';
import './Loading.css';

function Loading() {
    return (
        <React.Fragment>
            <div className="loading">
                <img src={loadGif} alt="Loading..." />
            </div>
        </React.Fragment>
    )
}

export default Loading;