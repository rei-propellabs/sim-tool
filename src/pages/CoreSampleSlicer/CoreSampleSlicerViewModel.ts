import { useState } from 'react';

export function useCoreSampleSlicerViewModel() {
  const [selectedImage, setSelectedImage] = useState("");
  const [clickedCoords, setClickedCoords] = useState<any[]>([]);
  const [currentCoords, setCurrentCoords] = useState<any[]>([]);
  const [naturalSize, setNaturalSize] = useState({ width: 0, height: 0 });
  const [type, setType] = useState('rod');
  const [labelNumber, setLabelNumber] = useState('');
  const [markedData, setMarkedData] = useState<any[]>([]);

  const handleImageChange = (file: string) => {
    if (file && file.length > 0) {
      setSelectedImage(file);
      setClickedCoords([]);
      setNaturalSize({ width: 0, height: 0 });
      markedData.splice(0, markedData.length);

      const img = new Image();
      img.onload = () => {
        setNaturalSize({ width: img.naturalWidth, height: img.naturalHeight });
      };
      img.src = file;
    }
  };

  const handleImageClick = (e: any, imageRef: any) => {
    if (imageRef.current && currentCoords.length < 4) {
      const rect = imageRef.current.getBoundingClientRect();
      const scaleX = naturalSize.width / rect.width;
      const scaleY = naturalSize.height / rect.height;
      
      const x = Math.round((e.clientX - rect.left) * scaleX);
      const y = Math.round((e.clientY - rect.top) * scaleY);
      
      const displayX = e.clientX - rect.left;
      const displayY = e.clientY - rect.top;

      console.log("clicked coord", {rect})
      
      setCurrentCoords(prevCoords => [...prevCoords, { x, y, displayX, displayY, type: 'default' }]);
    }
  };

  const handleTypeChange = (newType: string) => {
    setType(newType);
    if (newType === 'rod') {
      setLabelNumber('');
    }
  };

  const handleLabelNumberChange = (value: any) => {
    setLabelNumber(value.slice(0, 4));
  };

  const validateInput = () => {
    // Validate that exactly 4 coordinates are selected
    if (currentCoords.length !== 4) {
      alert('Please select 4 coordinates.');
      return false;
    }

     // If the type is 'marker', validate the label number
    if (type === 'marker') {
      const parsedValue = parseInt(labelNumber);
      if (labelNumber === null || labelNumber.trim() === '' || labelNumber.includes('e') || isNaN(parsedValue) || parsedValue < 0) {
        alert('Please enter a valid non-negative number for the marker.');
        return false;
      }
    }
    return true;

  };


  const handleAdd = () => {
    if (!validateInput()) {
      return;
    }

    const coordSet = currentCoords.map(coord => ({ x: coord.x, y: coord.y }));

    const newEntry = {
      type: type,
      ...(type === 'marker' && { value: parseInt(labelNumber) }), // Add value only for markers
      coordinates: coordSet
    };

    markedData.push(newEntry);
    
    const newCoords = currentCoords.map(coord => ({ ...coord, type: type })); 
    setClickedCoords(prevCoords => [...prevCoords, ...newCoords]);
    // Reset form and current coordinates
    setCurrentCoords([]);
    setLabelNumber('');
  };

  const handleReset = () => {
    setCurrentCoords([]);
  };

  const orderCoordinates = (coords: any) => {
    if (coords.length <= 2) return coords;
    const center = coords.reduce((acc: any, curr: any) => ({x: acc.x + curr.x / coords.length, y: acc.y + curr.y / coords.length}), {x: 0, y: 0});
    return coords.sort((a: any, b: any) => 
      Math.atan2(a.y - center.y, a.x - center.x) - Math.atan2(b.y - center.y, b.x - center.x)
    );
  };

  return {
    selectedImage,
    clickedCoords,
    currentCoords,
    type,
    labelNumber,
    handleImageChange,
    handleImageClick,
    handleTypeChange,
    handleLabelNumberChange,
    handleAdd,
    handleReset,
    orderCoordinates,
    markedData
  };
}