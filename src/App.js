import React, { useEffect, useState, useRef } from 'react';
import logo from './logo.svg';

import './App.css';
import 'bulma/css/bulma.css'

function App() {

  const defaultImage = "/images/start.jpg";
  const defaultSuccess = "/sounds/applause.mp3";
  const defaultAww = "/sounds/awww.mp3";
  const defaultText = "Click next to load next question";
  const [finished, setFinished] = useState();
  const [currentQuestion, setCurrentQuestion] = useState({});
  const [currentImage, setCurrentImage] = useState(defaultImage)
  const [currentText, setCurrentText] = useState(defaultText)
  const [selectedSound, setSelectedSound] = useState()


  useEffect(() => {







  }, [])

  useEventListener('keydown', (e) => {

    if (currentQuestion.key && !finished) {

      if (currentQuestion.key === e.key) {
        playSound(defaultSuccess)
      } else {
        playSound(defaultAww)
      }

      setFinished(true)

    }

  });

  useEffect(() => {
    if (selectedSound) {
      var audio = new Audio(selectedSound);
      audio.loop = false;
      audio.play();
    }


  }, [selectedSound])


  useEffect(() => {
    console.log(currentQuestion)
    if (currentQuestion) {

      setCurrentImage(currentQuestion.image)
      setCurrentText(currentQuestion.text)
    }



  }, [currentQuestion])

  function playSound(sound) {
    console.log(sound)

  }

  function getNextQuestion() {

    setCurrentQuestion({})
    setFinished(false)

    fetch('/api/nextLetter').then((response) => { return response.json() }).then((data) => {

      setCurrentQuestion(data)




    })
  }

  function playCurrentQuestion() {

    if (!currentQuestion.file) {
      setCurrentText("Question not selected yet. Click next to select a question")
    }
    else {
      playSound(currentQuestion.file)
    }

  }






  return (
    <div className="App">

      <div><button onClick={() => { getNextQuestion() }} className="button is-large">Next</button></div>
      <div id="scoreboard">
        <div></div>
        <div></div>
      </div>

      <div style={{ display: "flex", justifyContent: "center" }}>
        <div className="card" style={{ width: "300px" }}>
          <div className="card-image">
            <figure className="image is-4by3">
              <img src={currentImage || defaultImage} alt="Placeholder image" />
            </figure>
          </div>
          <div className="card-content">
            <p className="title">
              {currentText}
            </p>
            <div><button onClick={() => { playCurrentQuestion() }} className="button is-large">Play</button></div>
          </div>
          <footer className="card-footer" style={{ display: currentQuestion.showFooter ? "flex" : "none" }}>

            <p className="card-footer-item">
              <span>
                <button onClick={() => { setFinished(true); setSelectedSound(defaultAww) }} className="button is-large is-danger">Awwww</button>
              </span>
            </p>
            <p className="card-footer-item" onClick={getNextQuestion}>
              <span>
                <button onClick={() => { setFinished(true); setSelectedSound(defaultSuccess) }} className="button is-large is-success">Success</button>
              </span>
            </p>

          </footer>
        </div>
      </div>
    </div>

  );
}

function useEventListener(eventName, handler, element = window) {
  // Create a ref that stores handler
  const savedHandler = useRef();

  // Update ref.current value if handler changes.
  // This allows our effect below to always get latest handler ...
  // ... without us needing to pass it in effect deps array ...
  // ... and potentially cause effect to re-run every render.
  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  useEffect(
    () => {
      // Make sure element supports addEventListener
      // On 
      const isSupported = element && element.addEventListener;
      if (!isSupported) return;

      // Create event listener that calls handler function stored in ref
      const eventListener = event => savedHandler.current(event);

      // Add event listener
      element.addEventListener(eventName, eventListener);

      // Remove event listener on cleanup
      return () => {
        element.removeEventListener(eventName, eventListener);
      };
    },
    [eventName, element] // Re-run if eventName or element changes
  );
};

export default App;
