import type { Site, SocialObjects } from "./types";

export const SITE: Site = {
  website: "https://shafii-madhhab.de",
  author: "Ibn Abdullah",
  desc: "Fiqh gemäß den Methoden von Imām ash-Shāfi’ī und denjenigen, die ihm darin folgten.",
  title: "Shāfi’ī-Madhhab 🇵🇸",
  ogImage: "/assets/logo-big.png",
  lightAndDarkMode: true,
  postPerPage: 3,
};

export const LOCALE = ["de-DE"]; // set to [] to use the environment default

export const LOGO_IMAGE = {
  enable: true,
  svg: false,
  width: 48,
  height: 48,
};

export const SOCIALS: SocialObjects = [
  {
    name: "Facebook",
    href: "https://facebook.com/gershafiimadhhab",
    linkTitle: `${SITE.title} auf Facebook`,
    active: true,
  },
  {
    name: "Instagram",
    href: "https://www.instagram.com/shafii_madhhab_de",
    linkTitle: `${SITE.title} auf Instagram`,
    active: true,
  },
  {
    name: "Telegram",
    href: "https://t.me/shafiimadhhab",
    linkTitle: `${SITE.title} auf Telegram`,
    active: true,
  },
  {
    name: "RSS",
    href: "/rss.xml",
    linkTitle: `${SITE.title} als RSS Feed`,
    active: false,
  },
];
