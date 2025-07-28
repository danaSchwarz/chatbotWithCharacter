import { useEffect, useState } from 'react'
import './App.css'
import CharactersDisplay from './components/CharactersDisplay'
import ChatWindow from './components/ChatWindow'

function App() {
    const [characterDetails, setCharacterDetails] = useState(null);

    return (
        <>
            {characterDetails == null && (
                <CharactersDisplay openChatWindow={setCharacterDetails} />
            )}
            {characterDetails && (
                <ChatWindow details={characterDetails} onClose={() => setCharacterDetails(null)} />
            )}
        </>
    )
}

export default App
