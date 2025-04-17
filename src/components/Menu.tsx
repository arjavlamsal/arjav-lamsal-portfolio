"use client";

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import CustomEase from 'gsap/CustomEase';

// Register GSAP plugins
gsap.registerPlugin(CustomEase);

export default function Menu() {
  const navRef = useRef(null);
  const menuRef = useRef(null);
  const overlayRef = useRef(null);
  const [navState, setNavState] = useState("closed");
  const timelineRef = useRef(null);

  useEffect(() => {
    // Initialize GSAP settings
    CustomEase.create("main", "0.65, 0.01, 0.05, 0.99");
    gsap.defaults({
      ease: "main",
      duration: 0.7
    });

    // Set initial state
    gsap.set(navRef.current, { display: "none" });
    
    // Create timeline once
    timelineRef.current = gsap.timeline();
    
    // Add escape key listener
    const handleKeydown = (e) => {
      if (e.key === "Escape" && navState === "open") {
        closeNav();
      }
    };
    
    document.addEventListener("keydown", handleKeydown);
    
    // Cleanup
    return () => {
      document.removeEventListener("keydown", handleKeydown);
    };
  }, []);

  // Watch for navState changes
  useEffect(() => {
    if (navState === "open") {
      openNav();
    } else if (navState === "closed") {
      closeNav();
    }
  }, [navState]);

  const toggleNav = () => {
    setNavState(navState === "open" ? "closed" : "open");
  };
  
  const openNav = () => {
    const menuButtonTexts = document.querySelectorAll(".menu-button p");
    const menuButtonIcon = document.querySelector(".menu-button-icon");
    const bgPanels = document.querySelectorAll(".bg-panel");
    const menuLinks = document.querySelectorAll(".menu-link");
    const fadeTargets = document.querySelectorAll("[data-menu-fade]");
    
    timelineRef.current.clear()
      .set(navRef.current, { display: "block" })
      .set(menuRef.current, { xPercent: 0 }, "<")
      .fromTo(menuButtonTexts, { yPercent: 0 }, { yPercent: -100, stagger: 0.2 })
      .fromTo(menuButtonIcon, { rotate: 0 }, { rotate: 315 }, "<")
      .fromTo(overlayRef.current, { autoAlpha: 0 }, { autoAlpha: 1 }, "<")
      .fromTo(bgPanels, { xPercent: 101 }, { xPercent: 0, stagger: 0.12, duration: 0.575 }, "<")
      .fromTo(menuLinks, { yPercent: 140, rotate: 10 }, { yPercent: 0, rotate: 0, stagger: 0.05 }, "<+=0.35")
      .fromTo(fadeTargets, { autoAlpha: 0, yPercent: 50 }, { autoAlpha: 1, yPercent: 0, stagger: 0.04 }, "<+=0.2");
  };
  
  const closeNav = () => {
    const menuButtonTexts = document.querySelectorAll(".menu-button p");
    const menuButtonIcon = document.querySelector(".menu-button-icon");
    
    timelineRef.current.clear()
      .to(overlayRef.current, { autoAlpha: 0 })
      .to(menuRef.current, { xPercent: 120 }, "<")
      .to(menuButtonTexts, { yPercent: 0 }, "<")
      .to(menuButtonIcon, { rotate: 0 }, "<")
      .set(navRef.current, { display: "none" });
  };
  
  return (
    <>
      <div className="osmo-ui">
        <header className="header fixed top-0 right-0 left-0 pt-6 z-110">
          <div className="container is--full w-full mx-auto px-6 relative">
            <nav className="nav-row flex justify-between items-center w-full">
              <div className="nav-row__right flex justify-end items-center pointer-events-auto">
                <button role="button" data-menu-toggle="" className="menu-button flex justify-end items-center bg-transparent m-4 -m-4 border-none" onClick={toggleNav}>
                  <div className="menu-button-text flex flex-col justify-start items-end h-5 overflow-hidden">
                    <p className="p-large text-lg font-sans">Menu</p>
                    <p className="p-large text-lg font-sans">Close</p>
                  </div>
                </button>
              </div>
            </nav>
          </div>
        </header>
      </div>

      <section className="cloneable flex justify-center items-center min-h-screen relative px-6 py-12">
        <svg xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 160 160" fill="none" className="osmo-icon-svg w-32">
          <path d="M94.8284 53.8578C92.3086 56.3776 88 54.593 88 51.0294V0H72V59.9999C72 66.6273 66.6274 71.9999 60 71.9999H0V87.9999H51.0294C54.5931 87.9999 56.3777 92.3085 53.8579 94.8283L18.3431 130.343L29.6569 141.657L65.1717 106.142C67.684 103.63 71.9745 105.396 72 108.939V160L88.0001 160L88 99.9999C88 93.3725 93.3726 87.9999 100 87.9999H160V71.9999H108.939C105.407 71.9745 103.64 67.7091 106.12 65.1938L106.142 65.1716L141.657 29.6568L130.343 18.3432L94.8284 53.8578Z" fill="currentColor"></path>
        </svg>
        
        <div ref={navRef} data-nav={navState} className="nav fixed inset-0 z-100 w-full h-screen mx-auto">
          <div ref={overlayRef} data-menu-toggle="" className="overlay absolute inset-0 w-full h-full cursor-pointer bg-[#13131366]" onClick={toggleNav}></div>
          <nav ref={menuRef} className="menu relative w-[35em] h-full ml-auto overflow-auto flex flex-col justify-between items-start gap-20 pt-24 pb-8 rounded-4xl">
            <div className="menu-bg absolute inset-0 z-0">
              <div className="bg-panel first absolute inset-0 z-0 bg-primary rounded-tl-5 rounded-bl-5"></div>
              <div className="bg-panel second absolute inset-0 z-0 bg-neutral-100 rounded-tl-5 rounded-bl-5"></div>
              <div className="bg-panel absolute inset-0 z-0 bg-neutral-300 rounded-tl-5 rounded-bl-5"></div>
            </div>
            <div className="menu-inner relative z-1 flex flex-col justify-between items-start h-full w-full gap-10 overflow-auto">
              <ul className="menu-list flex flex-col w-full p-0 m-0 list-none">
                <li className="menu-list-item relative overflow-hidden">
                  <a href="#" className="menu-link w-inline-block flex w-full text-decoration-none pt-1 pl-8 gap-3">
                    <p className="menu-link-heading relative z-1 uppercase font-bold text-[5.5em] leading-3/4 font-['PP_Neue_Corp_Tight',_Arial,_sans-serif] transition-transform duration-550">About us</p>
                    <p className="eyebrow relative z-1 uppercase text-primary font-['RM_Mono',_Arial,_sans-serif] font-normal">01</p>
                    <div className="menu-link-bg absolute inset-0 z-0 bg-neutral-800 origin-bottom preserve-3d transition-transform duration-550 scale-y-0"></div>
                  </a>
                </li>
                <li className="menu-list-item relative overflow-hidden">
                  <a href="#" className="menu-link w-inline-block flex w-full text-decoration-none pt-1 pl-8 gap-3">
                    <p className="menu-link-heading relative z-1 uppercase font-bold text-[5.5em] leading-3/4 font-['PP_Neue_Corp_Tight',_Arial,_sans-serif] transition-transform duration-550">Our work</p>
                    <p className="eyebrow relative z-1 uppercase text-primary font-['RM_Mono',_Arial,_sans-serif] font-normal">02</p>
                    <div className="menu-link-bg absolute inset-0 z-0 bg-neutral-800 origin-bottom preserve-3d transition-transform duration-550 scale-y-0"></div>
                  </a>
                </li>
                <li className="menu-list-item relative overflow-hidden">
                  <a href="#" className="menu-link w-inline-block flex w-full text-decoration-none pt-3 pb-3 pl-8 gap-3">
                    <p className="menu-link-heading relative z-1 uppercase font-bold text-[5.5em] leading-3/4 font-['PP_Neue_Corp_Tight',_Arial,_sans-serif] transition-transform duration-550">Services</p>
                    <p className="eyebrow relative z-1 uppercase text-primary font-['RM_Mono',_Arial,_sans-serif] font-normal">03</p>
                    <div className="menu-link-bg absolute inset-0 z-0 bg-neutral-800 origin-bottom preserve-3d transition-transform duration-550 scale-y-0"></div>
                  </a>
                </li>
                <li className="menu-list-item relative overflow-hidden">
                  <a href="#" className="menu-link w-inline-block flex w-full text-decoration-none pt-3 pb-3 pl-8 gap-3">
                    <p className="menu-link-heading relative z-1 uppercase font-bold text-[5.5em] leading-3/4 font-['PP_Neue_Corp_Tight',_Arial,_sans-serif] transition-transform duration-550">Blog</p>
                    <p className="eyebrow relative z-1 uppercase text-primary font-['RM_Mono',_Arial,_sans-serif] font-normal">04</p>
                    <div className="menu-link-bg absolute inset-0 z-0 bg-neutral-800 origin-bottom preserve-3d transition-transform duration-550 scale-y-0"></div>
                  </a>
                </li>
                <li className="menu-list-item relative overflow-hidden">
                  <a href="#" className="menu-link w-inline-block flex w-full text-decoration-none pt-3 pb-3 pl-8 gap-3">
                    <p className="menu-link-heading relative z-1 uppercase font-bold text-[5.5em] leading-3/4 font-['PP_Neue_Corp_Tight',_Arial,_sans-serif] transition-transform duration-550">Contact us</p>
                    <p className="eyebrow relative z-1 uppercase text-primary font-['RM_Mono',_Arial,_sans-serif] font-normal">05</p>
                    <div className="menu-link-bg absolute inset-0 z-0 bg-neutral-800 origin-bottom preserve-3d transition-transform duration-550 scale-y-0"></div>
                  </a>
                </li>
              </ul>
              <div className="menu-details flex flex-col justify-start items-start pl-8 gap-5">
                <p data-menu-fade="" className="p-small text-sm font-sans">Socials</p>
                <div className="socials-row flex flex-row gap-6">
                  <a data-menu-fade="" href="#" className="p-large text-lg font-sans text-link relative no-underline">Instagram</a>
                  <a data-menu-fade="" href="#" className="p-large text-lg font-sans text-link relative no-underline">LinkedIn</a>
                  <a data-menu-fade="" href="#" className="p-large text-lg font-sans text-link relative no-underline">X/Twitter</a>
                  <a data-menu-fade="" href="#" className="p-large text-lg font-sans text-link relative no-underline">Awwwards</a>
                </div>
              </div>
            </div>
          </nav>
        </div>
      </section>
    </>
  );
}