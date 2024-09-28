import "dotenv/config";

import { scrapeURL } from ".";
import { scrapeOptions } from "../../controllers/v1/types";

describe("Standalone scrapeURL tests", () => {
    it("Basic scrape", async () => {
        const out = await scrapeURL("test:scrape-basic", "https://roastmywebsite.ai", scrapeOptions.parse({}));
    
        expect(out.logs.length).toBeGreaterThan(0);
        expect(out.success).toBe(true);
        if (out.success) {
            expect(out.document).not.toHaveProperty("content");
            expect(out.document).toHaveProperty("markdown");
            expect(out.document).toHaveProperty("metadata");
            expect(out.document).not.toHaveProperty("html");
            expect(out.document.markdown).toContain("_Roast_");
            expect(out.document.metadata.error).toBeUndefined();
            expect(out.document.metadata.title).toBe("Roast My Website");
            expect(out.document.metadata.description).toBe(
                "Welcome to Roast My Website, the ultimate tool for putting your website through the wringer! This repository harnesses the power of Firecrawl to scrape and capture screenshots of websites, and then unleashes the latest LLM vision models to mercilessly roast them. 🌶️"
            );
            expect(out.document.metadata.keywords).toBe(
                "Roast My Website,Roast,Website,GitHub,Firecrawl"
            );
            expect(out.document.metadata.robots).toBe("follow, index");
            expect(out.document.metadata.ogTitle).toBe("Roast My Website");
            expect(out.document.metadata.ogDescription).toBe(
                "Welcome to Roast My Website, the ultimate tool for putting your website through the wringer! This repository harnesses the power of Firecrawl to scrape and capture screenshots of websites, and then unleashes the latest LLM vision models to mercilessly roast them. 🌶️"
            );
            expect(out.document.metadata.ogUrl).toBe(
                "https://www.roastmywebsite.ai"
            );
            expect(out.document.metadata.ogImage).toBe(
                "https://www.roastmywebsite.ai/og.png"
            );
            expect(out.document.metadata.ogLocaleAlternate).toStrictEqual([]);
            expect(out.document.metadata.ogSiteName).toBe("Roast My Website");
            expect(out.document.metadata.sourceURL).toBe(
                "https://roastmywebsite.ai"
            );
            expect(out.document.metadata.statusCode).toBe(200);
        }
    
    }, 30000);

    it("Scrape with formats markdown and html", async () => {
        const out = await scrapeURL("test:scrape-formats-markdown-html", "https://roastmywebsite.ai", scrapeOptions.parse({
            formats: ["markdown", "html"],
        }));
    
        expect(out.logs.length).toBeGreaterThan(0);
        expect(out.success).toBe(true);
        if (out.success) {
            expect(out.document).toHaveProperty("markdown");
            expect(out.document).toHaveProperty("html");
            expect(out.document).toHaveProperty("metadata");
            expect(out.document.markdown).toContain("_Roast_");
            expect(out.document.html).toContain("<h1");
            expect(out.document.metadata.statusCode).toBe(200);
            expect(out.document.metadata.error).toBeUndefined();
        }
    
    }, 30000);

    it("Scrape with onlyMainContent disabled", async () => {
        const out = await scrapeURL("test:scrape-onlyMainContent-false", "https://www.scrapethissite.com/", scrapeOptions.parse({
            onlyMainContent: false,
        }));

        expect(out.logs.length).toBeGreaterThan(0);
        expect(out.success).toBe(true);
        if (out.success) {
            expect(out.document).toHaveProperty("markdown");
            expect(out.document).toHaveProperty("metadata");
            expect(out.document).not.toHaveProperty("html");
            expect(out.document.markdown).toContain("[FAQ](/faq/)"); // .nav
            expect(out.document.markdown).toContain("Hartley Brody 2023"); // #footer
        }
    });

    it("Scrape with excludeTags", async () => {
        const out = await scrapeURL("test:scrape-excludeTags", "https://www.scrapethissite.com/", scrapeOptions.parse({
            onlyMainContent: false,
            excludeTags: ['.nav', '#footer', 'strong'],
        }));

        expect(out.logs.length).toBeGreaterThan(0);
        expect(out.success).toBe(true);
        if (out.success) {
            expect(out.document).toHaveProperty("markdown");
            expect(out.document).toHaveProperty("metadata");
            expect(out.document).not.toHaveProperty("html");
            expect(out.document.markdown).not.toContain("Hartley Brody 2023");
            expect(out.document.markdown).not.toContain("[FAQ](/faq/)");
        }
    });

    it("Scrape of a page with 400 status code", async () => {
        const out = await scrapeURL("test:scrape-400", "https://httpstat.us/400", scrapeOptions.parse({}));

        expect(out.logs.length).toBeGreaterThan(0);
        expect(out.success).toBe(true);
        if (out.success) {
            expect(out.document).toHaveProperty('markdown');
            expect(out.document).toHaveProperty('metadata');
            expect(out.document.metadata.statusCode).toBe(400);
        }
    });

    it("Scrape of a page with 401 status code", async () => {
        const out = await scrapeURL("test:scrape-401", "https://httpstat.us/401", scrapeOptions.parse({}));

        expect(out.logs.length).toBeGreaterThan(0);
        expect(out.success).toBe(true);
        if (out.success) {
            expect(out.document).toHaveProperty('markdown');
            expect(out.document).toHaveProperty('metadata');
            expect(out.document.metadata.statusCode).toBe(401);
        }
    });

    it("Scrape of a page with 403 status code", async () => {
        const out = await scrapeURL("test:scrape-403", "https://httpstat.us/403", scrapeOptions.parse({}));

        expect(out.logs.length).toBeGreaterThan(0);
        expect(out.success).toBe(true);
        if (out.success) {
            expect(out.document).toHaveProperty('markdown');
            expect(out.document).toHaveProperty('metadata');
            expect(out.document.metadata.statusCode).toBe(403);
        }
    });

    it("Scrape of a page with 404 status code", async () => {
        const out = await scrapeURL("test:scrape-404", "https://httpstat.us/404", scrapeOptions.parse({}));

        expect(out.logs.length).toBeGreaterThan(0);
        expect(out.success).toBe(true);
        if (out.success) {
            expect(out.document).toHaveProperty('markdown');
            expect(out.document).toHaveProperty('metadata');
            expect(out.document.metadata.statusCode).toBe(404);
        }
    });

    it("Scrape of a page with 405 status code", async () => {
        const out = await scrapeURL("test:scrape-405", "https://httpstat.us/405", scrapeOptions.parse({}));

        expect(out.logs.length).toBeGreaterThan(0);
        expect(out.success).toBe(true);
        if (out.success) {
            expect(out.document).toHaveProperty('markdown');
            expect(out.document).toHaveProperty('metadata');
            expect(out.document.metadata.statusCode).toBe(405);
        }
    });

    it("Scrape of a page with 500 status code", async () => {
        const out = await scrapeURL("test:scrape-500", "https://httpstat.us/500", scrapeOptions.parse({}));

        expect(out.logs.length).toBeGreaterThan(0);
        expect(out.success).toBe(true);
        if (out.success) {
            expect(out.document).toHaveProperty('markdown');
            expect(out.document).toHaveProperty('metadata');
            expect(out.document.metadata.statusCode).toBe(500);
        }
    });

    it("Scrape of a PDF file", async () => {
        const out = await scrapeURL("test:scrape-pdf", "https://arxiv.org/pdf/astro-ph/9301001.pdf", scrapeOptions.parse({}));

        expect(out.logs.length).toBeGreaterThan(0);
        expect(out.success).toBe(true);
        if (out.success) {
            expect(out.document).toHaveProperty('metadata');
            expect(out.document.markdown).toContain('Broad Line Radio Galaxy');
            expect(out.document.metadata.statusCode).toBe(200);
            expect(out.document.metadata.error).toBeUndefined();
        }
    }, 60000);

    test.concurrent.each(new Array(100).fill(0).map((_, i) => "https://www.scrapethissite.com/?i=" + i))("Concurrent scrapes", async (url) => {
        const id = "test:concurrent:" + url;
        const out = await scrapeURL(id, url, scrapeOptions.parse({}));

        const replacer = (key: string, value: any) => {
            if (value instanceof Error) {
                return {
                    ...value,
                    message: value.message,
                    name: value.name,
                    cause: value.cause,
                    stack: value.stack,
                }
            } else {
                return value;
            }
        }

        expect(out.logs.length).toBeGreaterThan(0);
        expect(out.logs.every(x => x.scrapeId == id)).toBe(true); // verify that log collection works properly while concurrency is happening
        if (!out.success) console.error(JSON.stringify(out, replacer));
        expect(out.success).toBe(true);
        if (out.success) {
            expect(out.document).toHaveProperty('markdown');
            expect(out.document).toHaveProperty('metadata');
            if (out.document.metadata.statusCode === 0) {
                console.log(JSON.stringify(out, replacer));
            }
            expect(out.document.metadata.error).toBeUndefined();
            expect(out.document.metadata.statusCode).toBe(200);
        }
    }, 30000);
})
