# Website writing standard

I use first-person, clear English for my website. I base this project style on ASD-STE100, Issue 9, with the adaptations below.

## Voice and scope

- I use “I,” “me,” and “my” for my work, views, and biography. I use “we” only when it identifies actual collaborators.
- I keep navigation, action labels, alt text, names, publication titles, author lists, quotations, and bibliographic records in their appropriate form.
- I keep published titles, citations, equations, dates, measurements, authorship roles, uncertainty, and source links accurate.
- I apply this policy to authored web text and page descriptions. Linked papers, certificates, archived blog issues, and downloadable documents retain their source wording.

## Clear English

- I use one main topic per paragraph, with no more than six sentences.
- I limit descriptive sentences to 25 words. I use short, direct instructions for interface actions.
- I prefer active verbs, concrete subjects, American English spelling, and consistent terms.
- I explain an abbreviation when readers first need it. I keep necessary scientific terms instead of replacing them with imprecise everyday words.
- I identify opinions as my views. I attribute reported findings to their sources and retain their limits.
- I remove unnecessary metaphors, repeated slogans, inflated claims, and accidental invisible characters.

## Technical terms

I retain subject-specific terms such as quantum dot, passivation, phonon, perovskite, density functional theory (DFT), GW approximation, Raman spectrum, and self-consistent-field (SCF) coordinates. I also retain names such as Quantum ESPRESSO, WEST/PDEP-GW, SIESTA, Kant, Scheler, and Schopenhauer. These terms need contextual review; this list does not confer STE approval on other uses or parts of speech.

## Checks before publication

I run `pnpm check:copy`, `pnpm lint`, `pnpm typecheck`, and `pnpm build`. The deployment workflow runs the copy check before it publishes the site.

The copy checker checks authored paragraph text and selected prose fields. It excludes headings, list items, upstream UI primitives, and bibliographic records from personal-voice requirements. It checks first-person markers, sentence length, paragraph length, and selected text-hygiene problems. It cannot establish grammar, word meanings, complete runtime coverage, factual accuracy, or formal ASD-STE100 compliance. I review those matters manually, including interface states and metadata.

## Standard reference and adaptation

ASD-STE100 has both writing rules and a controlled dictionary. Short sentences alone do not establish compliance. I use a first-person portfolio adaptation, including philosophical argument and technical vocabulary. I describe it as **STE-based first-person English**, not certified or fully validated ASD-STE100.

Official references: [ASD-STE100](https://www.asd-ste100.org/), [current standard and downloads](https://asd-ste100.org/STE_downloads.html), and [frequently asked questions](https://www.asd-ste100.org/STE_faq.html).
