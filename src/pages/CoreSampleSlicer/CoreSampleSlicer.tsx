import React, { useRef, useEffect } from 'react';
import { useCoreSampleSlicerViewModel } from './CoreSampleSlicerViewModel';
import styles from "./CoreSampleSlicer.module.css"
import { useLocation } from 'react-router-dom';

function CoreSampleSlicer() {
  const viewModel = useCoreSampleSlicerViewModel();
  const imageRef = useRef(null);
  const labelInputRef = useRef<any>(null);

  const location = useLocation();
  const { image } = location.state || {};

  // Effect to focus the input when marker is selected
  useEffect(() => {
    if (viewModel.type === 'marker' && labelInputRef.current) {
      labelInputRef.current.focus();
    }
    console.log(image)
  }, [viewModel.type]);

  useEffect(() => {
    viewModel.handleImageChange(image)
  }, [image])

  // Function to handle key down events
  const handleKeyDown = (e: any) => {
    console.log(e.key)
    if (e.key === 'Enter') {
      e.preventDefault();
      viewModel.handleAdd();
    }
  };

  const handleImageClick = (e: any) => {
    e.currentTarget.focus();

    viewModel.handleImageClick(e, imageRef);
  };

  return (
    <form className={styles.coreSampleSlicer} onKeyDown={handleKeyDown}>
      <header className={styles.coreSampleSlicerHeader}>
       
        {image && (
          <>
          <div className={styles.imageContainer}>
            <img
              ref={imageRef}
              src={image}
              alt="Selected"
              onClick={(e) => {
                e.preventDefault();
                handleImageClick(e)
              }}
              className={styles.selectedImage}
              tabIndex={0}
            />
            {viewModel.clickedCoords.map((coord, index) => (
              <div
                key={`clicked-${index}`}
                className={`${styles.coordinateMarker} ${coord.type}`}
                style={{
                  left: `${coord.displayX}px`,
                  top: `${coord.displayY}px`,
                }}
              />
            ))}
            {viewModel.currentCoords.map((coord, index) => (
              <div
                key={`current-${index}`}
                className={`${styles.coordinateMarker} ${styles.default}`}
                style={{
                  left: `${coord.displayX}px`,
                  top: `${coord.displayY}px`,
                }}
              />
            ))}
            </div>
            <div className={styles.annotationContainer}>
              <div className={styles.annotationForm}>
                <div className={styles.radioGroup}>
                  <span>
                    <input 
                      type="radio" 
                      value="rod" 
                      checked={viewModel.type === 'rod'} 
                      onChange={() => viewModel.handleTypeChange('rod')}
                    /> Rod
                  </span>
                  <span>
                    <input 
                      type="radio" 
                      value="marker" 
                      checked={viewModel.type === 'marker'} 
                      onChange={() => viewModel.handleTypeChange('marker')}
                    /> Marker
                  </span>
                  {viewModel.type === 'marker' && (
                    <span className={styles.labelInput}>
                      <input 
                      ref={labelInputRef}
                        type="number" 
                        value={viewModel.labelNumber} 
                        onChange={(e) => viewModel.handleLabelNumberChange(e.target.value)}
                        max="9999"
                      />
                      <span>m</span>
                    </span>
                  )}
                </div>
                <div className={styles.coordinatesDisplay}>
                  <span className={styles.smallCoordinates}>
                    Coordinates: {viewModel.orderCoordinates(viewModel.currentCoords).map((coord:any) => `(${coord.x}, ${coord.y})`).join(', ')}
                  </span>
                  <button type="button" 
                    onClick={(e) => {
                      e.preventDefault();
                      viewModel.handleReset();
                    }}>Reset</button>
                </div>
                <button type="button" 
                  onClick={(e) => {
                    e.preventDefault();
                    viewModel.handleAdd();
                  }}>Add</button>
              </div>
              <div className={styles.jsonDisplay}>
                <textarea
                  readOnly
                  value={JSON.stringify(viewModel.markedData, null, 2)}
                  className={styles.jsonTextarea}
                />
              </div>
            </div>
          </>
        )}
      </header>
    </form>
  );
}

export default CoreSampleSlicer;