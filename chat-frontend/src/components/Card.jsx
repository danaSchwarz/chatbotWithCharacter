import { useState, useEffect } from 'react';

function Card({ onOpenDetails, character, onOpenPopup }) {
    const [img, setImg] = useState();
    const handleDetailsOpen = () => {
        onOpenDetails(character);
        onOpenPopup(true);
    };

    useEffect(() => {
        setImg("../../img/" + character.key_word + ".jpeg");
        console.log(img);
    }, []);

    return (
        <div className="card col-3" key={character.key_word} onClick={handleDetailsOpen} style={{ cursor: "pointer" }}>
            <img className="card-img-top" src={img} alt="Card image cap" />
            <div className="card-body">
                <h3 className="card-title">{character.name}</h3>
                <p className="card-text">{character.title}</p>
            </div>
        </div>
    );
}

export default Card;