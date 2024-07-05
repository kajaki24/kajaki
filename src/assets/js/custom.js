gsap.registerPlugin(ScrollTrigger);
if (window.matchMedia("(min-width: 767px)").matches) {
// Fade in --------------------------------------------------------------
let fadeIn = [...document.querySelectorAll('.fade-in')];

fadeIn.forEach(element =>{
   gsap.from(element, {
       autoAlpha: 0,
       opacity: 0,
       yPercent: 100,
       duration: 1,
       ease: Power3. easeInOut,
       scrollTrigger: { 
         trigger: element,
         //toggleActions: 'restart pause reverse pause',
       },
   })
});

// Fade --------------------------------------------------------------
let splitTextChars = [...document.querySelectorAll('.fade')];

splitTextChars.forEach(element =>{
   gsap.from(element, {
       autoAlpha: 0,
       opacity: 0,
       duration: 1,
       ease: Power3. easeInOut,
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
  
   gsap.from(mySplitText.chars, {
       yPercent: 105,
       duration: 1,
       ease: Power3.easeOut,
       stagger: {
         amount: 0.3,
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

splitTextLines.forEach(element => {
   let mySplitText = new SplitText(element, {
     type:"words, chars",
     wordsClass: "words",
     charsClass: "chars"
   });

   gsap.set(".words", {overflow: "hidden"}),
   
    gsap.from(mySplitText.chars, {
      autoAlpha: 0,
        opacity: 0,
        duration: 0.6,
        delay: .1,
        stagger: 0.005,
        yPercent: 105,
        ease: "sine.out",
        scrollTrigger: { 
          trigger: element,
          //toggleActions: 'restart pause reverse pause',
        },
    })
});

// Kayak  --------------------------------------------------------------------
if(document.querySelector(".kayak-wrap")) {
gsap.from(".kayak-wrap", {
  xPercent: 120,
  delay: .1,
  duration: 2
})
gsap.to(".kayak", {
  xPercent: -20,
  scrollTrigger: {
    trigger: ".hero-main",
    start: "bottom 100%",
    scrub: 1
  }
});
};
  
// Reveal image --------------------------------------------------------------
let revealContainers = document.querySelectorAll(".reveal-wrap");

revealContainers.forEach((element) => {
  let image = element.querySelector(".reveal-wrap picture img");
  gsap.set(element, { autoAlpha: 1 }); 

  gsap.from(element, 1.5, {
    xPercent: -100,
    duration: .7,
    ease: Power3. easeInOut,
    scrollTrigger: {
      trigger: element
    }
  });
  gsap.from(image, 1.5, {
    xPercent: 100,
    duration: .7,
    scale: 1.3,
    ease: Power3. easeInOut,
    scrollTrigger: {
      trigger: element
    }
  });
});

// parallax 
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

// About parallax img
gsap.to(".image-small", {
  yPercent: 30,
  scrollTrigger: {
    trigger: ".section-about",
    scrub: 1
  }
});


};

// Navigation

var menuToggle = document.getElementById("menuToggle");

var menuBar = gsap.timeline({ paused: true});

menuBar.to('.bar-1', 1,{
	attr:{d: "M8,2 L2,8"},
	x: 1,
	ease: Power2.easeInOut
}, 'start')

menuBar.to('.bar-2', 1,{
	autoAlpha: 0
}, 'start')

menuBar.to('.bar-3', 1,{
	attr:{d: "M8,8 L2,2"},
	x: 1,
	ease: Power2.easeInOut
}, 'start')

menuBar.reverse();

var navTl = gsap.timeline({ paused:true });

navTl.to('.fullpage-menu', {
	duration: 0,
	display: "block",
	ease: Expo.easeInOut
}, "<");

navTl.to('.menu-bg', {
	duration: 1.2,
	opacity: 1,
	ease: Expo.easeInOut
}, "<");

navTl.to('.menu li a', {
	y: 0,
	stagger: 0.05,
  duration: 1,
  ease: Expo.easeInOut
}, "-=0.6");

navTl.reverse();

menuToggle.addEventListener('click', function(){
	menuBar.reversed(!menuBar.reversed());
	navTl.reversed(!navTl.reversed());
});

// Accordion
if (document.querySelector(".accordion")) {
  let t = document.getElementsByClassName("accordion");
    for (let e = 0; e < t.length; e++) t[e].addEventListener("click", function () {
      let e = this.nextElementSibling;
      if (e.style.maxHeight) e.style.maxHeight = null, this.classList.remove("open");
      else {
        for (let a = 0; a < t.length; a++) t[a].classList.remove("open"), t[a].nextElementSibling.style.maxHeight = null;
        e.style.maxHeight = e.scrollHeight + "px", this.classList.toggle("open");
      }
    });
  };

  // Line animation
const lineX = gsap.utils.toArray('.line-x');
lineX.forEach(lineXItem => {
gsap.from(lineXItem, { 
width: "0",
duration: 1.2,
delay: 0.1,
ease: Power4.easeInOut,
scrollTrigger: {
trigger: lineXItem,
start: "top 98%",
}
})
});

// Circle
if(document.querySelector(".circ-flex-col")) {
if (window.matchMedia("(min-width: 767px)").matches) {
  const rotateImages = document.querySelectorAll('.center-rotate-image .image-wrapper');
  const hoverColumns = document.querySelectorAll('.hover-col');
  
  hoverColumns.forEach((hoverCol, index) => {
    hoverCol.addEventListener("mouseenter", () => {
  
      hoverColumns.forEach((col) => {
        col.classList.remove("active");
      });
  
      rotateImages.forEach((img) => {
        img.classList.remove("active");
      });
  
      hoverCol.classList.add("active");
      rotateImages[index].classList.add("active");
    });
  });
  
  
}
}


  // Lazy blur images
  if (document.querySelector(".blur-load")) {
    const blurImgWrap = document.querySelectorAll(".blur-load");
    blurImgWrap.forEach((item) => {
      const img = item.querySelector("picture img");
      function loaded() {
        item.classList.add("loaded");
      }
      if (img.complete) {
        loaded();
      } else {
        img.addEventListener("load", loaded);
      }
    });
  }
