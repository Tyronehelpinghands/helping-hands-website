import fs from "node:fs";

const tariefBlock = `"question": "Wat kosten jullie diensten?",
        "answer": "Tarief op aanvraag. De prijs hangt af van functie, tijden, locatie en aantallen. Deel je planning — wij sturen een passende indicatie."
      },
      {
        "question": "Voor wie is Helping Hands Agency bedoeld?"`;

const path = "src/lib/seo/servicePages.ts";
let s = fs.readFileSync(path, "utf8");
const marker = "export const servicePages: ServicePage[]";
const [head, ...rest] = s.split(marker);
const tail = rest.join(marker);
const needle = `"question": "Voor wie is Helping Hands Agency bedoeld?"`;
if (!head.includes("Wat kosten jullie diensten?")) {
  const fixed = head.split(needle).join(tariefBlock);
  fs.writeFileSync(path, fixed + marker + tail);
  console.log("Inserted tarief FAQ into core service pages");
} else {
  console.log("Core service pages already have tarief FAQ");
}

const locPath = "src/lib/seo/locationPages.ts";
let loc = fs.readFileSync(locPath, "utf8");
loc = loc.replaceAll(
  '"question": "Voor wie is Helping Hands bedoeld?"',
  '"question": "Voor wie is Helping Hands Agency bedoeld?"',
);
loc = loc.replaceAll(
  '"answer": "Voor opdrachtgevers die betrouwbare event-, horeca- of productiemeewerkers nodig hebben — en voor crew die wil werken op echte producties."',
  '"answer": "Voor opdrachtgevers die betrouwbare event-, horeca- of productiemeewerkers nodig hebben — en voor crew die wil werken op echte producties in de live branche."',
);
if (!loc.includes("Wat kosten jullie diensten?")) {
  loc = loc.split('"question": "Voor wie is Helping Hands Agency bedoeld?"').join(
    `"question": "Wat kosten jullie diensten?",
        "answer": "Tarief op aanvraag. De prijs hangt af van functie, tijden, locatie en aantallen."
      },
      {
        "question": "Voor wie is Helping Hands Agency bedoeld?"`,
  );
}
fs.writeFileSync(locPath, loc);
console.log("Updated locationPages FAQs");

const workPath = "src/lib/seo/workPages.ts";
let work = fs.readFileSync(workPath, "utf8");
work = work.replaceAll('| Helping Hands"', "| Helping Hands Agency\"");
work = work.replaceAll(
  '"question": "Voor wie is Helping Hands bedoeld?"',
  '"question": "Voor wie is Helping Hands Agency bedoeld?"',
);
work = work.replaceAll("bij Helping Hands.\"", 'bij Helping Hands Agency."');
work = work.replaceAll("bij Helping Hands.", "bij Helping Hands Agency.");
fs.writeFileSync(workPath, work);
console.log("Updated workPages brand");
