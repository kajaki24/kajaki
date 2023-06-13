gsap.registerPlugin(ScrollTrigger);
 
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

document.addEventListener("DOMContentLoaded", function() {

// Handwrite --------------------------------------------------------------

let splitTextLetters = [...document.querySelectorAll('.split-text-letters')];

splitTextLetters.forEach(element =>{
  new SplitText(element, { 
    type: "words, chars",
    wordsClass: "word",
    charsClass: "char-perspective" 
  });
  let mySplitText = new SplitText(element, {
    type:"chars",
    charsClass: "char"
  });
  
   gsap.from(mySplitText.chars, {
       autoAlpha: 0,
       opacity: 0,
       duration: 2,
       delay: 0.8,
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
   
    gsap.from(mySplitText.lines, {
        duration: 0.6,
        stagger: 0.1,
        yPercent: 100,
        ease: "sine.out",
        scrollTrigger: { 
          trigger: element,
          //toggleActions: 'restart pause reverse pause',
        },
    })
});


// Split text lines --------------------------------------------------------------
let splitTextLinesLoad = [...document.querySelectorAll('.split-text-lines-load')];

splitTextLinesLoad.forEach(element =>{
   let mySplitText = new SplitText(element, {
     type:"lines",
     linesClass: "line"
   });
    new SplitText(element, {
     type:"lines",
     linesClass: "line-parent",
   });

   gsap.set(".line-parent", {overflow: "hidden"}),
   
    gsap.from(mySplitText.lines, {
        duration: 0.6,
        stagger: 0.1,
        yPercent: 100,
        ease: "sine.out",
        scrollTrigger: { 
          trigger: element,
          //toggleActions: 'restart pause reverse pause',
        },
    })
});

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
