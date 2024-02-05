import { useEffect, useState } from "react";
import Pusher from "pusher-js";
import './App.css';

function App() {
    const [username, setUsername] = useState('username');
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');

    useEffect(() => {
        Pusher.logToConsole = true;

        var pusher = new Pusher('b77b12ffe19b346b44f1', {
            cluster: 'mt1'
        });

        const channel = pusher.subscribe('chat');
        channel.bind('message', function (data) {
            // Update the state immutably by creating a new array
            setMessages(prevMessages => [...prevMessages, data]);
        });

        // Clean up the subscription
        return () => {
            channel.unbind('message');
            pusher.unsubscribe('chat');
        };
    }, []);

    const submit = async e => {
        e.preventDefault();

        await fetch('http://localhost:8000/api/messages', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                username,
                message
            })
        });

        setMessage('');
    }

    return (
        <div className="App">
            <header class="fixed-top" id="header">
                    <div class="container-fluid p-3">
                        <div class="row">
                            <div class="col-1" id="imageContainer">
                            <img id="userImage" src="https://mdbcdn.b-cdn.net/img/new/avatars/2.webp" class="rounded-circle " alt="Image"/>
                                
                            </div>
                            <div class="col">

                            <div class="form__group">
                                <input type="input" class="form__field" value={username} onChange = {(e) => setUsername(e.target.value)} required />
                                <label class="form__label">Username</label>
                            </div>

                            </div>
                        </div>
                    </div>
            </header>
                
            <main class="container-fluid pb-2 pt-4">

                <div className="chat-container">
                <div className="list-group list-group-flush border-botto">
                {messages.map((message, index) => (
                <div key={index} className="chat-message">
                <div className="message-content">
                <strong className="username">{message.username}</strong>
                <div className="message-text">{message.message}</div>
                </div>
                </div>
                ))}
                </div>
                </div>

                <div class=" " id="bottom">
                    <div class="row">
                        <div class="col-2"></div>
                        <div class="col-8">
                            <form id="footer" class="d-flex" onSubmit={(e) => submit(e)}>
                                <input id="textBox" className="form-control rounded-5"
                                placeholder="Write your message here"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                />
                                <button type="submit" className="btn m-2">Send</button>
                            </form>
                        </div>
                    </div>
                        <div class="col-2"></div>
                </div>
                
            </main>
        </div>
      );
}

export default App;
