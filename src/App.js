import React, { useEffect, useState } from 'react';
import logo from './logo.svg';

import './App.css';
import 'bulma/css/bulma.css'

function App() {

  const defaultImage = "/images/start.jpg";
  const defaultSuccess = "/sounds/applause.mp3";
  const defaultAww= "/sounds/awww.mp3";
  const defaultText = "Click next to load next question";
  const [selectedLetter, setSelectedLetter] = useState();
  const [currentQuestion, setCurrentQuestion] = useState({});
  const [currentImage, setCurrentImage] = useState(defaultImage)
  const [currentText, setCurrentText] = useState(defaultText)


  useEffect(() => {



    document.addEventListener('keydown', (e)=>{

      if(currentQuestion.key )
      {
        if(currentQuestion.key === e.key){
          playSound(defaultSuccess)
        }else{
          playSound(defaultAww)
        }
      }

    }); 

  }, [])


  useEffect(() => {
    if (currentQuestion) {

      setCurrentImage(currentQuestion.image)
      setCurrentText(currentQuestion.text)
    }



  }, [currentQuestion])

  function playSound(sound) {
    console.log(sound)
    var audio = new Audio(sound);
    audio.loop = false;
    audio.play();
  }

  function getNextQuestion() {
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

      <div><button onClick={() => { getNextQuestion() }} class="button is-large">Next</button></div>
      <div id="scoreboard">
        <div></div>
        <div></div>
      </div>

      <div style={{ display: "flex", justifyContent: "center" }}>
        <div class="card" style={{ width: "300px" }}>
          <div class="card-image">
            <figure class="image is-4by3">
              <img src={currentImage || defaultImage} alt="Placeholder image" />
            </figure>
          </div>
          <div class="card-content">
            <p class="title">
              {currentText}
            </p>
            <div><button onClick={() => { playCurrentQuestion() }} class="button is-large">Play</button></div>
          </div>
          <footer class="card-footer">

            <p class="card-footer-item">
              <span>
              <button onClick={() => { playSound(defaultAww ) }} class="button is-large is-danger">Awwww</button>
              </span>
            </p>
            <p class="card-footer-item" onClick={getNextQuestion}>
              <span>
              <button onClick={() => { playSound(defaultSuccess )}} class="button is-large is-success">Success</button>
              </span>
            </p>

          </footer>
        </div>
      </div>
    </div>

  );
}

export default App;
