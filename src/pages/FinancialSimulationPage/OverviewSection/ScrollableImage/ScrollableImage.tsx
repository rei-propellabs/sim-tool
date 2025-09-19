import React, { useState, useRef, useEffect } from 'react';
import styles from './ScrollableImage.module.css';

interface ScrollableImageProps {
  imageSrc: string;
  /**
   * Normalized scroll position (0 = left, 1 = right, 0.5 = center)
   */
  scrollPosition?: number;
  /**
   * Called with normalized scroll position (0-1)
   */
  onScrollPositionChange?: (position: number) => void;
}

const ScrollableImage: React.FC<ScrollableImageProps> = ({
  imageSrc,
  scrollPosition = 0,
  onScrollPositionChange,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [containerWidth, setContainerWidth] = useState(0);
  const [imageWidth, setImageWidth] = useState(0);

  const [isDragging, setIsDragging] = useState(false);
  const dragStartX = useRef(0);
  const dragStartScrollNorm = useRef(0);

  // Calculate scroll bounds
  // Always fill height, so width is scaled proportionally
  const scaledImageWidth = imageRef.current && containerRef.current
    ? imageRef.current.naturalWidth * (containerRef.current.offsetHeight / imageRef.current.naturalHeight)
    : imageWidth;
  const maxScrollX = Math.max(0, scaledImageWidth - containerWidth);
  // Clamp normalized scroll position between 0 and 1
  // Clamp so that the right edge of the image never goes past the right edge of the container
  const normScroll = Math.max(0, Math.min(scrollPosition ?? 0, 1));
  // Convert normalized scroll to pixel offset
  const pixelScroll = maxScrollX * normScroll;

  // Handle image load to get dimensions
  const handleImageLoad = () => {
    if (imageRef.current && containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      setContainerWidth(containerRect.width);
      setImageWidth(imageRef.current.naturalWidth);
      setImageLoaded(true);
    }
  };

 
  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current && imageRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect();
        const imageRect = imageRef.current.getBoundingClientRect();

        setContainerWidth(containerRect.width);
        setImageWidth(imageRect.width);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [imageLoaded]);

  // Handle wheel scroll (normalized)
  const handleWheel = (e: WheelEvent | React.WheelEvent) => {
    if (!imageLoaded || maxScrollX <= 0) return;
    if (e instanceof WheelEvent) {
      e.preventDefault();
    }
    const delta = e.deltaY || e.deltaX;
    const scrollSensitivity = 5;
    // Convert delta to normalized units
    let newNorm = normScroll + (delta * scrollSensitivity / 100);
    // Clamp so that the right edge of the image never goes past the right edge of the container
    newNorm = Math.max(0, Math.min(newNorm, 1));
    if (onScrollPositionChange) {
      onScrollPositionChange(newNorm);
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => container.removeEventListener('wheel', handleWheel);
  }, [imageLoaded, maxScrollX]);

  // Handle drag scroll (normalized)
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragStartX.current = e.clientX;
    dragStartScrollNorm.current = normScroll;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStartX.current;
    // Convert dx to normalized units
    const normDelta = maxScrollX > 0 ? dx / maxScrollX : 0;
    let newNorm = dragStartScrollNorm.current - normDelta;
    // Clamp so that the right edge of the image never goes past the right edge of the container
    newNorm = Math.max(0, Math.min(newNorm, 1));
    if (onScrollPositionChange) onScrollPositionChange(newNorm);
  };

  const handleMouseUp = () => setIsDragging(false);
  const handleMouseLeave = () => setIsDragging(false);

  // Calculate scroll indicator properties
  const scrollableRatio = maxScrollX > 0 ? containerWidth / imageWidth : 1;
  const scrollProgress = normScroll;

  return (
    <div className={styles.container}>
      <div
        ref={containerRef}
        className={styles.imageContainer}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
      >
        <img
          ref={imageRef}
          src={imageSrc}
          alt="Scrollable content"
          className={styles.image}
          style={{
            height: '100%',
            width: 'auto',
            minWidth: 0,
            maxWidth: 'none',
            transform: `translateX(-${pixelScroll}px)`
          }}
          onLoad={handleImageLoad}
          draggable={false}
        />
      </div>

      {imageLoaded && maxScrollX > 0 && (
        <div className={styles.scrollIndicator}>
          <div className={styles.scrollTrack}>
            <div
              className={styles.scrollThumb}
              style={{
                width: `${scrollableRatio * 100}%`,
                transform: `translateX(${scrollProgress * (100 / scrollableRatio - 100)}%)`
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ScrollableImage;
