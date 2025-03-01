import React, { useState, useEffect } from 'react';
import './HomePage.css'; // Import CSS for styling


const images = [
  window.location.origin + '/image6.png',
  window.location.origin + '/kyuugi.jpg',
  window.location.origin + '/image8.png',
  window.location.origin + '/race.JPG',
  window.location.origin + '/image7.png',
  window.location.origin + '/speech.png',
  window.location.origin + '/image4.png',
  window.location.origin + '/jikyuso.JPG',
  window.location.origin + '/image1.png',
  window.location.origin + '/undokai.JPG',
  window.location.origin + '/image2.png',
  window.location.origin + '/relay.JPG',
  window.location.origin + '/image3.png'
];

function HomePage() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="homepage-container">
      {/* Image Slider */}
      <div className="slider">
        <img 
          src={images[currentIndex]} 
          alt="Slideshow" 
          className="slide-image"
        />
      </div>

      {/* Website Title and Description */}
      <h1 className="homepage-title">SeitoLInx</h1>
      <p className="homepage-description">
        LI校生徒ウェブサイトへようこそ！生徒会中心にLI校の情報を発信します。
      </p>
    </div>
  );
}

export default HomePage;
