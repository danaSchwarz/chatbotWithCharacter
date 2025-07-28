import { useState, useEffect } from "react";

function FloatingDetails({ onClose, openChat, character }) {
    const [img, setImg] = useState();

    useEffect(() => {
        setImg("../../img/" + character.key_word + ".jpeg");
        console.log(img);
    }, []);
    return (
        <div className="floating-window">
            <div className="popup-content">
                <img className="w-25" src={img} alt="Card image cap" />
                <h3>{character.name}</h3>
                <p>{character.title}</p>
                <p>{character.description}</p>
                <button onClick={onClose} className="btn btn-danger btn-sm">Close</button>
                <button onClick={openChat} className="btn btn-primary btn-sm">Chat</button>
            </div>
        </div>
    )
}

export default FloatingDetails;