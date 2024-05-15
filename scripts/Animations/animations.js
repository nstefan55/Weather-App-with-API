export function gsapHeadingAnimation() {
  const words = ['to', 'the', 'Weather', 'App'];

  let cursor = gsap.to('.cursor', {
    opacity: 0,
    ease: 'power2.InOut',
    repeat: -1,
  });

  let masterTimeline = gsap.timeline({
    repeat: -1,
  });

  words.forEach((word, index) => {
    let timeline = gsap.timeline({
      yoyo: false,
    });

    if (index === 0) {
      timeline.to('.text-1', {
        duration: 1,
        text: word,
      });
    }

    if (index === 1) {
      timeline.to('.text-2', {
        duration: 1,
        text: word,
      });
    }

    if (index === 2) {
      timeline.to('.text-3', {
        duration: 1,
        text: word,
      });
    }

    if (index === 3) {
      timeline.to('.text-4', {
        duration: 1,
        text: word,
      });
    }

    masterTimeline.add(timeline);
  });
}
