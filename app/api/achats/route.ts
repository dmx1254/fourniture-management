import { NextResponse } from "next/server";
import puppeteer from "puppeteer";

export async function GET(req: Request) {
  const browser = await puppeteer.launch({
    headless: true,
  });

  try {
    const page = await browser.newPage();

    // Navigate to the page
    await page.goto("http://www.marchespublics.sn");

    // Wait for and fill the search form
    await page.waitForSelector("#frontsearch");
    await page.waitForSelector('form#frontsearch input[name="crit"]');
    await page.type('form#frontsearch input[name="crit"]', "achat");
    await page.click('form#frontsearch input[type="submit"]');

    // Wait for results table to load
    await page.waitForSelector(".cooltable");

    // Extract data from the table
    const results = await page.evaluate(() => {
      const rows = document.querySelectorAll(
        ".cooltable tr:not(.cooltablehdr)"
      );

      return Array.from(rows)
        .map((row) => {
          const columns = row.querySelectorAll("td");
          if (columns.length >= 3) {
            return {
              title: columns[0].textContent?.trim() || "",
              publishDate: columns[1].textContent?.trim() || "",
              deadline: columns[2].textContent?.trim() || "",
              // Extract ID from the details link
              id: columns[3].querySelector("a")?.href || "",
            };
          }
          return null;
        })
        .filter((item) => item !== null);
    });

    await browser.close();

    return NextResponse.json({
      success: true,
      count: results.length,
      data: results,
    });
  } catch (error) {
    await browser.close();
    return NextResponse.json({
      success: false,
      error:
        error instanceof Error ? error.message : "An unknown error occurred",
    });
  }
}
