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
  let image = element.querySelector(".reveal-image");
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
const circleContent0 = document.querySelector(".hover0");
const circleContent1 = document.querySelector(".hover1");
const circleContent2 = document.querySelector(".hover2");
const circleContent3 = document.querySelector(".hover3");

const circleImage0 = document.querySelector(".circ-img-0");
const circleImage1 = document.querySelector(".circ-img-1");
const circleImage2 = document.querySelector(".circ-img-2");
const circleImage3 = document.querySelector(".circ-img-3");

circleContent0.addEventListener("mouseenter", () => {
  circleImage0.classList.add("active");
  circleImage1.classList.remove("active");
  circleImage2.classList.remove("active");
  circleImage3.classList.remove("active");
  circleContent0.classList.add("active");
  circleContent1.classList.remove("active");
  circleContent2.classList.remove("active");
  circleContent3.classList.remove("active");
  });

  circleContent1.addEventListener("mouseenter", () => {
    circleImage1.classList.add("active");
    circleImage0.classList.remove("active");
    circleImage2.classList.remove("active");
    circleImage3.classList.remove("active");
    circleContent1.classList.add("active");
    circleContent0.classList.remove("active");
    circleContent2.classList.remove("active");
    circleContent3.classList.remove("active");
    });
  
    circleContent2.addEventListener("mouseenter", () => {
      circleImage2.classList.add("active");
      circleImage0.classList.remove("active");
      circleImage1.classList.remove("active");
      circleImage3.classList.remove("active");
      circleContent2.classList.add("active");
      circleContent0.classList.remove("active");
      circleContent1.classList.remove("active");
      circleContent3.classList.remove("active");
      });
    
      circleContent3.addEventListener("mouseenter", () => {
        circleImage3.classList.add("active");
        circleImage0.classList.remove("active");
        circleImage1.classList.remove("active");
        circleImage2.classList.remove("active");
        circleContent3.classList.add("active");
        circleContent0.classList.remove("active");
        circleContent1.classList.remove("active");
        circleContent2.classList.remove("active");
        });
}
}
