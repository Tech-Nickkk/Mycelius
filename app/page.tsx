import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import WhatWeDo, { Story } from "./components/WhatWeDo";
import TargetAudience, { Audience } from "./components/TargetAudience";
import Incubators, { IncubatorItem } from "./components/Incubators";
import ProductAdvantage from "./components/ProductAdvantage";
import Collaborations from "./components/Collaborations";
import LimitedEditions, { LimitedEditionItem } from "./components/LimitedEditions";
import Gallery, { GalleryItem } from "./components/Gallery";
import Contact from "./components/Contact";

import { client } from "../sanity/lib/client";
import { urlFor } from "../sanity/lib/image";
import { type SanityImageSource } from "@sanity/image-url";

export const revalidate = 60;

const defaultStories: Story[] = [
  { title: ["Custom", "Installations"], storyImg: "/carousel/slide-img-1.png" },
  { title: ["Cultivated", "Furniture"], storyImg: "/carousel/slide-img-2.png" },
  { title: ["Wall", "Panels"], storyImg: "/carousel/slide-img-3.png" },
  { title: ["Design", "Luminaires"], storyImg: "/carousel/slide-img-4.png" },
  { title: ["Wall", "Panels"], storyImg: "/carousel/slide-img-5.png" },
];

const defaultAudiences: Audience[] = [
  { title: "Interior Designers", image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop" },
  { title: "Architects", image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=2070&auto=format&fit=crop" },
  { title: "Luxury Residences", image: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=2070&auto=format&fit=crop" },
  { title: "Hospitality Spaces", image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=2070&auto=format&fit=crop" },
  { title: "Sustainable Commercial", image: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop" },
];

const getSanityImageUrl = (source: SanityImageSource, updatedAt?: string) => {
  if (!source) return "";
  try {
    const url = urlFor(source).url();
    if (!url) return "";
    if (!updatedAt) return url;
    const separator = url.includes("?") ? "&" : "?";
    return `${url}${separator}t=${updatedAt}`;
  } catch (e) {
    return "";
  }
};

async function getSanityData() {
  try {
    const whatWeDoData = await client.fetch(`*[_type == "whatWeDo"]`);
    const targetAudienceData = await client.fetch(`*[_type == "targetAudience"]`);
    const limitedEditionsData = await client.fetch(`*[_type == "limitedEdition"]`);
    const limitedEditionSettingsData = await client.fetch(`*[_type == "limitedEditionSettings"][0]`);
    const incubatorsData = await client.fetch(`*[_type == "incubator"]`);
    const galleryItemsData = await client.fetch(`*[_type == "galleryItem"]`);
    
    const stories: Story[] = whatWeDoData.map((item: { titleLine1: string; titleLine2: string; image: SanityImageSource; _updatedAt: string }) => ({
      title: [item.titleLine1, item.titleLine2],
      storyImg: getSanityImageUrl(item.image, item._updatedAt),
    }));

    const audiences: Audience[] = targetAudienceData.map((item: { title: string; image: SanityImageSource; _updatedAt: string }) => ({
      title: item.title,
      image: getSanityImageUrl(item.image, item._updatedAt),
    }));

    const limitedEditions: LimitedEditionItem[] = limitedEditionsData.map((item: { 
      name: string; 
      isUpcoming?: boolean; 
      availableStock?: number; 
      image: SanityImageSource; 
      _updatedAt: string 
    }) => {
      let derivedStatus = "Growing";
      if (item.isUpcoming) {
        derivedStatus = "Growing";
      } else if (item.availableStock !== undefined && item.availableStock !== null) {
        if (item.availableStock <= 0) {
          derivedStatus = "Sold Out";
        } else {
          derivedStatus = `${item.availableStock} Left`;
        }
      } else {
        derivedStatus = "Growing";
      }
      return {
        name: item.name,
        status: derivedStatus,
        image: getSanityImageUrl(item.image, item._updatedAt),
      };
    });

    const limitedEditionTimerSettings = limitedEditionSettingsData
      ? {
          launchDate: limitedEditionSettingsData.launchDate,
          timerTitle: limitedEditionSettingsData.timerTitle,
          showTimer: limitedEditionSettingsData.showTimer,
          expiredMessage: limitedEditionSettingsData.expiredMessage,
        }
      : undefined;

    const incubators: IncubatorItem[] = incubatorsData.map((item: { name: string; logo: SanityImageSource; link?: string; _updatedAt: string }) => ({
      name: item.name,
      logo: getSanityImageUrl(item.logo, item._updatedAt),
      link: item.link || "",
    }));

    const galleryItems: GalleryItem[] = galleryItemsData.map((item: { _id?: string; title?: string; description?: string; image: SanityImageSource; _updatedAt: string }) => ({
      id: item._id,
      title: item.title,
      description: item.description,
      image: getSanityImageUrl(item.image, item._updatedAt),
    }));

    return { stories, audiences, limitedEditions, limitedEditionTimerSettings, incubators, galleryItems };
  } catch (error) {
    console.error("Failed to fetch Sanity data:", error);
    return { stories: [], audiences: [], limitedEditions: [], limitedEditionTimerSettings: undefined, incubators: [], galleryItems: [] };
  }
}

export default async function Home() {
  const { stories, audiences, limitedEditions, limitedEditionTimerSettings, incubators, galleryItems } = await getSanityData();

  const finalStories = stories.length > 0 ? stories : defaultStories;
  const finalAudiences = audiences.length > 0 ? audiences : defaultAudiences;

  return (
    <>
      <Navbar />
      <div className="main-content-container relative bg-[#ffffff] text-[#12110E] overflow-x-hidden selection:bg-[#FF6118] selection:text-black">
        <Hero />
        <About />
        <WhatWeDo stories={finalStories} />
        <div className="bg-[#12110E]">
          <TargetAudience audiences={finalAudiences} />
          <ProductAdvantage />
          <Collaborations />
          <Incubators items={incubators} />
          <LimitedEditions items={limitedEditions} timerSettings={limitedEditionTimerSettings} />
          <Gallery items={galleryItems} />
          <Contact />
        </div>
      </div>
    </>
  );
}