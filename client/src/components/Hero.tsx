import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Slide } from '../types';

const fallback: Slide = {
  eyebrow: 'Lions Club of Nugegoda',
  title: 'Helping those in need',
  imageUrl: '',
  primaryLabel: 'Donations',
  primaryHref: '/donations',
  secondaryLabel: 'Newsletter',
  secondaryHref: '/newsletters',
  sortOrder: 0,
  active: true,
};

export default function Hero({ slides }: { slides: Slide[] }) {
  const items = slides.length ? slides : [fallback];
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const slide = items[index] ?? items[0];

  useEffect(() => {
    if (paused || items.length < 2) return;
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (media.matches) return;
    const timer = window.setInterval(() => setIndex((value) => (value + 1) % items.length), 7000);
    return () => window.clearInterval(timer);
  }, [paused, items.length]);

  function go(next: number) {
    setIndex((next + items.length) % items.length);
  }

  return (
    <section className="hero" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div className="wrap hero-slide" key={`${slide.title}-${index}`}>
        <div className="hero-content">
          {slide.eyebrow ? <p className="eyebrow">{slide.eyebrow}</p> : null}
          <h1>{slide.title}</h1>
          <div className="hero-actions">
            <Link className="btn btn-blue" to={slide.primaryHref}>{slide.primaryLabel}</Link>
            <Link className="btn btn-gold" to={slide.secondaryHref}>{slide.secondaryLabel}</Link>
          </div>
          {items.length > 1 ? (
            <div className="hero-controls">
              <button className="hero-arrow prev" aria-label="Previous slide" onClick={() => go(index - 1)}>
                ‹
              </button>
              <div className="hero-dots">
                {items.map((item, dot) => (
                  <button key={`${item.title}-${dot}`} className={dot === index ? 'on' : ''} aria-label={`Show slide ${dot + 1}`} onClick={() => setIndex(dot)} />
                ))}
              </div>
              <button className="hero-arrow next" aria-label="Next slide" onClick={() => go(index + 1)}>
                ›
              </button>
            </div>
          ) : null}
        </div>
        <div className="hero-visual">
          {slide.imageUrl ? (
            <img src={slide.imageUrl} alt="" />
          ) : (
            <div className="hero-quiet">
              <span>We Serve</span>
              <p>Nugegoda · Nawala</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
