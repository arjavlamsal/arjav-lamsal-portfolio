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
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

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
    const handleKeydown = (e: KeyboardEvent) => {
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
    const menuLinkHeadings = document.querySelectorAll(".menu-link-heading");
    const menuLinkBgs = document.querySelectorAll(".menu-link-bg");
    const eyebrows = document.querySelectorAll(".eyebrow");
    const fadeTargets = document.querySelectorAll("[data-menu-fade]");
    
    // Set up the menu links and backgrounds for animation
    gsap.set(menuLinkBgs, { scaleY: 0 });
    gsap.set(menuLinkHeadings, { y: 0 });
    
    timelineRef.current?.clear()
      .set(navRef.current, { display: "block" })
      .set(menuRef.current, { xPercent: 0 }, "<")
      .fromTo(menuButtonTexts, { yPercent: 0 }, { yPercent: -100, stagger: 0.2 })
      .fromTo(menuButtonIcon, { rotate: 0 }, { rotate: 315 }, "<")
      .fromTo(overlayRef.current, { autoAlpha: 0 }, { autoAlpha: 1 }, "<")
      .fromTo(bgPanels, { xPercent: 101 }, { xPercent: 0, stagger: 0.12, duration: 0.575 }, "<")
      .fromTo(menuLinks, { yPercent: 140, rotate: 10 }, { yPercent: 0, rotate: 0, stagger: 0.05 }, "<+=0.35")
      // Animate eyebrows with a slight delay after menu links appear
      .fromTo(eyebrows, 
        { autoAlpha: 0, x: -20 }, 
        { autoAlpha: 1, x: 0, stagger: 0.05, duration: 0.4 }, 
        "<+=0.1")
      // Create a ripple effect on menu links
      .fromTo(menuLinkHeadings, 
        { textShadow: "0px 0px 0px rgba(0,0,0,0)" }, 
        { 
          textShadow: "0px 1em 0px var(--color-neutral-200)", 
          stagger: 0.07,
          duration: 0.4
        }, 
        "<+=0.15")
      .fromTo(fadeTargets, { autoAlpha: 0, yPercent: 50 }, { autoAlpha: 1, yPercent: 0, stagger: 0.04 }, "<+=0.2")
      .call(() => {
        // Set up hover animations AFTER menu is open
        setupLinkAnimations();
      });
  };
  
  const setupLinkAnimations = () => {
    // First, clear any existing hover listeners to prevent duplicates
    const menuLinks = document.querySelectorAll(".menu-link");
    
    menuLinks.forEach((link) => {
      // Clone the link element to remove existing event listeners
      const newLink = link.cloneNode(true) as Element;
      if (link.parentNode) {
        link.parentNode.replaceChild(newLink, link);
      }
      
      const linkHeading = newLink.querySelector(".menu-link-heading");
      const linkBg = newLink.querySelector(".menu-link-bg");
      
      // Ensure heading and linkBg are not null before using them
      if (linkHeading && linkBg) {
        // Create hover animations
        newLink.addEventListener("mouseenter", () => {
          gsap.to(linkHeading, {
            y: -92,
            duration: 0.05,
            ease: "power2.out"
          });
          
          gsap.to(linkBg, {
            scaleY: 1,
            duration: 0.05,
            ease: "power2.out"
          });
        });
        
        newLink.addEventListener("mouseleave", () => {
          gsap.to(linkHeading, {
            y: 0,
            duration: 0.05,
            ease: "power2.in"
          });
          
          gsap.to(linkBg, {
            scaleY: 0,
            duration: 0.05,
            ease: "power2.in"
          });
        });
      }
    });
  };
  
  const closeNav = () => {
    const menuButtonTexts = document.querySelectorAll(".menu-button p");
    const menuButtonIcon = document.querySelector(".menu-button-icon");
    const menuLinkHeadings = document.querySelectorAll(".menu-link-heading");
    const eyebrows = document.querySelectorAll(".eyebrow");
    
    // Clear any active hover animations
    gsap.killTweensOf(".menu-link-heading");
    gsap.killTweensOf(".menu-link-bg");
    
    timelineRef.current?.clear()
      // Animate the eyebrows out first
      .to(eyebrows, { autoAlpha: 0, x: -20, duration: 0.3, stagger: 0.03 })
      // Then menu link text
      .to(menuLinkHeadings, { 
        textShadow: "0px 0px 0px rgba(0,0,0,0)",
        duration: 0.3, 
        stagger: 0.03 
      }, "<+=0.1")
      .to(overlayRef.current, { autoAlpha: 0 }, "<+=0.1")
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
                <button role="button" data-menu-toggle="" className="menu-button flex justify-end items-center bg-transparent m-4 border-none" onClick={toggleNav}>
                  <div className="menu-button-text flex flex-col justify-start items-end h-6 overflow-hidden">
                    <p className="p-large text-lg font-sans text-white">Menu</p>
                    <p className="p-large text-lg font-sans text-white">Close</p>
                  </div>
                </button>
              </div>
            </nav>
          </div>
        </header>
      </div>

      <section className="cloneable flex justify-center items-center min-h-screen relative px-6 py-12">
        
        <div ref={navRef} data-nav={navState} className="nav fixed inset-0 z-100 w-full h-screen mx-auto">
          <div ref={overlayRef} data-menu-toggle="" className="overlay absolute inset-0 w-full h-full cursor-pointer bg-[#13131366]" onClick={toggleNav}></div>
          <nav ref={menuRef} className="menu relative w-[35em] h-full ml-auto overflow-auto flex flex-col justify-between items-start gap-5 pt-24 pb-8 rounded-4xl">
            <div className="menu-bg absolute inset-0 z-0 margin-list-item">
                <div className="bg-panel first absolute inset-0 z-0" style={{ backgroundColor: "#FD5937" }}></div>
              <div className="bg-panel second absolute inset-0 z-0 bg-neutral-100 rounded-tl-5 rounded-bl-5"></div>
              <div className="bg-panel absolute inset-0 z-0 bg-neutral-300 rounded-tl-5 rounded-bl-5"></div>
            </div>
            <div className="menu-inner relative z-1 flex flex-col justify-between items-start h-full w-full gap-10 overflow-auto">
              <ul className="menu-list flex flex-col w-full p-0 m-0 list-none">
                <li className="menu-list-item relative overflow-hidden">
                  <a href="#" className="menu-link w-inline-block flex w-full text-decoration-none pt-1 pl-8 gap-3">
                    <p className="menu-link-heading relative z-1 uppercase font-bold text-[6em] leading-3/4 font-['PP_Neue_Corp_Tight',_Arial,_sans-serif]">About Me</p>
                    <p className="eyebrow relative z-1 uppercase text-primary font-['RM_Mono',_Arial,_sans-serif] font-normal" style={{ color: "#FD5937" }}>01</p>
                    <div className="menu-link-bg absolute inset-0 z-0 bg-neutral-800 origin-bottom preserve-3d scale-y-0"></div>
                  </a>
                </li>
                <li className="menu-list-item relative overflow-hidden">
                  <a href="#" className="menu-link w-inline-block flex w-full text-decoration-none pt-1 pl-8 gap-3">
                    <p className="menu-link-heading relative z-1 uppercase font-bold text-[6em] leading-3/4 font-['PP_Neue_Corp_Tight',_Arial,_sans-serif]">My work</p>
                    <p className="eyebrow relative z-1 uppercase text-primary font-['RM_Mono',_Arial,_sans-serif] font-normal" style={{ color: "#FD5937" }}>02</p>
                    <div className="menu-link-bg absolute inset-0 z-0 bg-neutral-800 origin-bottom preserve-3d scale-y-0"></div>
                  </a>
                </li>
                <li className="menu-list-item relative overflow-hidden">
                  <a href="#" className="menu-link w-inline-block flex w-full text-decoration-none pt-3 pb-3 pl-8 gap-3">
                    <p className="menu-link-heading relative z-1 uppercase font-bold text-[6em] leading-3/4 font-['PP_Neue_Corp_Tight',_Arial,_sans-serif]">Services</p>
                    <p className="eyebrow relative z-1 uppercase text-primary font-['RM_Mono',_Arial,_sans-serif] font-normal" style={{ color: "#FD5937" }}>03</p>
                    <div className="menu-link-bg absolute inset-0 z-0 bg-neutral-800 origin-bottom preserve-3d scale-y-0"></div>
                  </a>
                </li>
                <li className="menu-list-item relative overflow-hidden">
                  <a href="#" className="menu-link w-inline-block flex w-full text-decoration-none pt-3 pb-3 pl-8 gap-3">
                    <p className="menu-link-heading relative z-1 uppercase font-bold text-[6em] leading-3/4 font-['PP_Neue_Corp_Tight',_Arial,_sans-serif]">Blog</p>
                    <p className="eyebrow relative z-1 uppercase text-primary font-['RM_Mono',_Arial,_sans-serif] font-normal" style={{ color: "#FD5937" }}>04</p>
                    <div className="menu-link-bg absolute inset-0 z-0 bg-neutral-800 origin-bottom preserve-3d scale-y-0"></div>
                  </a>
                </li>
                <li className="menu-list-item relative overflow-hidden">
                  <a href="#" className="menu-link w-inline-block flex w-full text-decoration-none pt-3 pb-3 pl-8 gap-3">
                    <p className="menu-link-heading relative z-1 uppercase font-bold text-[6em] leading-3/4 font-['PP_Neue_Corp_Tight',_Arial,_sans-serif]">Contact Me</p>
                    <p className="eyebrow relative z-1 uppercase text-primary font-['RM_Mono',_Arial,_sans-serif] font-normal" style={{ color: "#FD5937" }}>05</p>
                    <div className="menu-link-bg absolute inset-0 z-0 bg-neutral-800 origin-bottom preserve-3d scale-y-0"></div>
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