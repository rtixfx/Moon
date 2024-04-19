import { useState, useEffect } from "react";


const loader = ({ State, Component }: { State: boolean, Component: any }) => {
    const [showContent, setShowContent] = useState(false);
    useEffect(() => {
        const loader: any = document.getElementById("loader");
        if (State) {
            loader.style.opacity = "1";
            loader.style.display = "flex";
            setShowContent(false);
        }
        else {
            loader.style.opacity = "0";
            setTimeout(() => {
                loader.style.display = "none";
            }, 500)
            setShowContent(true);
        }
    }, [State])
    return (
        <>
            <div className="loader" id="loader">
                <div className="loader__circle"></div>
                <h2>Loading...</h2>
            </div>
            <style>
                {`
                .loader {
                    position: fixed;
                    z-index: 9999;
                    width: 100%;
                    height: 100%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    background: #232333;
                    color: #fff;
                    flex-direction: column;
                    transition: 0.5s;
                }
                .loader__circle {
                    border: 5px solid #6b6b6b;
                    border-top: 5px solid #fff;
                    border-radius: 50%;
                    width: 75px;
                    height: 75px;
                    animation: spin 1s ease-in-out infinite;
                    margin-bottom: 20px;
                }
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                `}
            </style>
            {showContent && <Component />}
        </>
    )
}

export default loader;