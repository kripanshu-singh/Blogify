import React from "react";
import loadingGIF1 from "../images/loader4.gif";
import loadingGIF2 from "../images/loader1_transparent.gif";
import loadingGIF3 from "../images/loader3.gif";

const Loader = () => {
    // const loadingGIFs = [loadingGIF1, loadingGIF2, loadingGIF3];
    // const randomIndex = Math.floor(Math.random() * loadingGIFs.length);
    // const selectedGIF = loadingGIFs[randomIndex];

    return (
        <div className="loader">
            <div className="loader_image">
                <img src={loadingGIF1} alt="Loading" />
            </div>
        </div>
    );
};

export default Loader;
