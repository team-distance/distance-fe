import { useState } from "react";
import styled from "styled-components"
import { parseDate } from "../../utils/parseDate";
import axios from "axios";

const ImageView = ({ imgSrc, handleCancel }) => {
    const [showButton, setShowButton] = useState(true);

    const handleDownload = () => {
        try {
            const res = axios.get(imgSrc, { responseType: 'blob' });
            const blob = res.data;

            const blobURL = URL.createObjectURL(blob);
            const aTag = document.createElement("a");

            const date = parseDate(new Date());

            aTag.href = blobURL;
            aTag.download = `Distance/${date}.jpg`;

            aTag.click();
        } catch (e) {
            console.log(e);
        }
    };

    return (
        <>
            {showButton &&
                <WrapButtons>
                    <div className="container" >
                        <img src="/assets/chat/download-button.svg" alt="download" onClick={handleDownload} />
                        <img src="/assets/chat/cancel-button.svg" alt="download" onClick={handleCancel} />
                    </div>
                </WrapButtons>
            }
            <Background onClick={() => setShowButton(prev => !prev)}>
                <WrapImage>
                    <img src={imgSrc} alt="view" />
                </WrapImage>
            </Background>
        </>
    )
}

const Background = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;

  background: black;
  z-index: 999;

`;

const WrapButtons = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    background: rgba(0, 0, 0, 0.5);
    z-index: 1000;

    .container {
        display: flex;
        justify-content: space-between;
        padding: 1.5rem 1rem;
    }
`;

const WrapImage = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;

    img {
        max-width: 100%;
        max-height: 100%;
    }
`;

export default ImageView;
