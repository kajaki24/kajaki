gsap.registerPlugin(ScrollTrigger);
     
// Fade in no duration -------------------------------------------------------
   gsap.to(".fade-no-duration", {
       autoAlpha: 1,
       opacity: 1,
       duration: 0.05
});

// Fade in --------------------------------------------------------------
let splitTextChars = [...document.querySelectorAll('.fade-in')];

splitTextChars.forEach(element =>{
   gsap.from(element, {
       autoAlpha: 0,
       opacity: 0,
       y: 80,
       duration: 1,
       ease: Expo.easeOut,
       scrollTrigger: { 
         trigger: element,
         //toggleActions: 'restart pause reverse pause',
       },
   })
});

// Handwrite --------------------------------------------------------------

let splitTextLetters = [...document.querySelectorAll('.split-text-letters')];

splitTextLetters.forEach(element =>{
  new SplitText(element, { 
    type: "words, chars",
    wordsClass: "word",
    charsClass: "char-wrap" 
  });
  let mySplitText = new SplitText(element, {
    type:"chars",
    charsClass: "char"
  });

  gsap.set(".char-wrap", {overflow: "hidden"});
  gsap.set(".char", {yPercent: 100,});
  
   gsap.to(mySplitText.chars, {
       autoAlpha: 1,
       opacity: 1,
       yPercent: 0,
       duration: 2,
       ease: Expo. easeOut,
       stagger: {
         amount: 0.5,
         from: "0"
       },
       scrollTrigger: { 
         trigger: element,
         //toggleActions: 'restart pause reverse pause',
       },
   })
});


// Split text lines --------------------------------------------------------------
let splitTextLines = [...document.querySelectorAll('.split-text-lines')];

splitTextLines.forEach(element =>{
   let mySplitText = new SplitText(element, {
     type:"lines",
     linesClass: "line"
   });
    new SplitText(element, {
     type:"lines",
     linesClass: "line-parent",
   });

   gsap.set(".line-parent", {overflow: "hidden"}),
   gsap.set(".line", {yPercent: 100}),
   
    gsap.to(mySplitText.lines, {
        duration: 0.6,
        stagger: 0.1,
        yPercent: 0,
        ease: "sine.out",
        scrollTrigger: { 
          trigger: element,
          //toggleActions: 'restart pause reverse pause',
        },
    })
});


// Kayak  --------------------------------------------------------------------
gsap.from(".kayak-wrap", {
  xPercent: 120,
  duration: 2
})
gsap.to(".kayak", {
  xPercent: 20,
  scrollTrigger: {
    trigger: ".hero-main",
    start: "bottom 100%",
    scrub: 1
  }
});

// Reveal image --------------------------------------------------------------
let revealContainers = document.querySelectorAll(".reveal-wrap");

revealContainers.forEach((element) => {
  let image = element.querySelector(".reveal-image");
  gsap.set(element, { autoAlpha: 1 }); 

  gsap.from(element, 1.5, {
    xPercent: -100,
    delay: .3,
    ease: Power2.out,
    scrollTrigger: {
      trigger: element
    }
  });
  gsap.from(image, 1.5, {
    xPercent: 100,
    delay: .3,
    scale: 1.3,
    ease: Power2.out,
    scrollTrigger: {
      trigger: element
    }
  });
});


// Footer parallax
if (window.matchMedia("(min-width: 767px)").matches) {
    gsap.from(".footer-parallax", {
      y: "-25%",
      opacity: 0,
      scrollTrigger: {
        trigger: ".bixol-footer",
        start: "top 85%",
        end: "top 55%",
        scrub: true
      }
    });
    } else {
      gsap.from(".footer-parallax", {
        y: "-15%",
        opacity: 0,
        scrollTrigger: {
          trigger: ".bixol-footer",
          start: "top 95%",
          end: "bottom 90%",
          scrub: true
        }
      });
    };
  

// parallax 
if (window.matchMedia("(min-width: 767px)").matches) {
    gsap.utils.toArray(".parallax-wrap").forEach(function(container) {
      let image = container.querySelector("img");
    
      let tl = gsap.timeline({
          scrollTrigger: {
            trigger: container,
            scrub: true,
            pin: false,
          },
        }); 
        tl.from(image, {
          yPercent: -10,
          ease: "none",
        }).to(image, {
          yPercent: 10,
          ease: "none",
        }); 
    });
  }
