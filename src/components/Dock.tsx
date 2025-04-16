"use client";

import React, { useRef } from 'react';
import { useEffect } from 'react';
import clsx from 'clsx';

const apps = [
  { name: 'Notion', icon: 'https://cdn.prod.website-files.com/6728a3e6f4f4161c235bc519/6728a6be92ee5ddf0080fb90_notion.png' },
  { name: 'Asana', icon: 'https://cdn.prod.website-files.com/6728a3e6f4f4161c235bc519/6728a6bef9d004f8a9cf3b29_asana.png' },
  { name: 'Slack', icon: 'https://cdn.prod.website-files.com/6728a3e6f4f4161c235bc519/6728a6be8c099d4e1ed55770_slack.png' },
  { name: 'Loom', icon: 'https://cdn.prod.website-files.com/6728a3e6f4f4161c235bc519/6728a6be5b31ba243e4da377_loom.png' },
  { name: 'Spotify', icon: 'https://cdn.prod.website-files.com/6728a3e6f4f4161c235bc519/6728a6bea97e140677496dae_spotify.png' },
  { name: 'Webflow', icon: 'https://cdn.prod.website-files.com/6728a3e6f4f4161c235bc519/6728a6bea73fcc6ee568f6f0_webflow.png' },
  { name: 'Osmo', icon: 'https://cdn.prod.website-files.com/6728a3e6f4f4161c235bc519/6728b10be6bc07649a51369e_Osmo.png' },
  { name: 'Adobe Illustrator', icon: 'https://cdn.prod.website-files.com/6728a3e6f4f4161c235bc519/6728a6bdf9d004f8a9cf3b09_adobe-illustrator.png' },
  { name: 'Figma', icon: 'https://cdn.prod.website-files.com/6728a3e6f4f4161c235bc519/6728a6be1de916069b5e1aaa_figma.png' },
  { name: 'Photoshop', icon: 'https://cdn.prod.website-files.com/6728a3e6f4f4161c235bc519/6728a6be1de916069b5e1a86_adobe-photoshop.png' },
  { name: 'Premiere Pro', icon: 'https://cdn.prod.website-files.com/6728a3e6f4f4161c235bc519/6728a6be051d32942a7aa31e_adobe-premierepro.png' },
];

const Dock: React.FC = () => {
  const navRef = useRef<HTMLLIElement[]>([]);

  useEffect(() => {
    const toggleSiblingClass = (index: number, offset: number, className: string, add: boolean) => {
      const sibling = navRef.current[index + offset];
      if (sibling) sibling.classList.toggle(className, add);
    };

    navRef.current.forEach((item, index) => {
      item.addEventListener('mouseenter', () => {
        item.classList.add('hover');
        toggleSiblingClass(index, -1, 'sibling-close', true);
        toggleSiblingClass(index, 1, 'sibling-close', true);
        toggleSiblingClass(index, -2, 'sibling-far', true);
        toggleSiblingClass(index, 2, 'sibling-far', true);
      });
      item.addEventListener('mouseleave', () => {
        item.classList.remove('hover');
        toggleSiblingClass(index, -1, 'sibling-close', false);
        toggleSiblingClass(index, 1, 'sibling-close', false);
        toggleSiblingClass(index, -2, 'sibling-far', false);
        toggleSiblingClass(index, 2, 'sibling-far', false);
      });
    });
  }, []);

  return (
    <section className="flex items-center justify-center min-h-screen bg-neutral-300">
      <div className="fixed inset-x-0 bottom-[10vh] flex items-end justify-center z-50 pointer-events-none">
        <nav>
          <ul className="flex items-end justify-center space-x-1 text-[1.4vw]">
            {apps.map((app, index) => (
              <li
                key={app.name}
                ref={(el) => {
                  if (el) navRef.current[index] = el;
                }}
                className={clsx(
                  'relative flex items-center justify-center w-20 transition-all duration-500 ease-[cubic-bezier(.16,1,.3,1)]',
                  'hover:w-32 sibling-close:w-28 sibling-far:w-24'
                )}
              >
                <a
                  href="#"
                  className="relative z-10 flex items-center justify-center w-full h-full px-2 pointer-events-auto"
                >
                  <img
                    src={app.icon}
                    alt={`${app.name} icon`}
                    className="w-full object-contain"
                    loading="eager"
                  />
                </a>
                <div className="absolute z-0 px-2 py-1 text-sm font-normal text-black bg-neutral-100 rounded opacity-0 translate-y-[-80%] group-hover:opacity-100 group-hover:-translate-y-[140%] transition-all duration-500 ease-[cubic-bezier(.16,1,.3,1)] whitespace-nowrap">
                  {app.name}
                </div>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </section>
  );
};

export default Dock;
