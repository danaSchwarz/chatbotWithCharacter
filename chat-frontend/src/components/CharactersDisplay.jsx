import { useEffect, useState } from 'react';
import Card from './Card';
import { collection, getDocs } from "firebase/firestore";
import db from '../api/firebase.js';
import FloatingDetails from './FloatingDetails.jsx';

function CharactersDisplay({ openChatWindow }) {
    const [characters, setCharacters] = useState([]);
    const [details, setDetails] = useState();
    const [showPopup, setShowPopup] = useState(false);


    useEffect(() => {
        async function fetchCharacters() {
            try {
                const querySnapshot = await getDocs(collection(db, "Characters"));
                const characters = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setCharacters(characters);
            } catch (error) {
                console.error("Error fetching characters: ", error);
            }
        }
        fetchCharacters();

    }, []);

    return (
        <div className="container ">
            {showPopup && (
                <FloatingDetails
                    character={details}
                    onClose={() => setShowPopup(false)}
                    openChat={() => openChatWindow(details)}
                />
            )}
            <h2>Characters</h2>
            <div className="row gap-2" style={{ display: "flex", alignContent: "center", justifyContent: "center" }}>
                {characters.map(character => (
                    <Card key={character.key_word} onOpenDetails={setDetails} character={character} onOpenPopup={setShowPopup} />
                ))}
            </div>
        </div>
    );
}

export default CharactersDisplay;